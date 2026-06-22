package com.prod.ploy.security;

import com.prod.ploy.model.Member;
import com.prod.ploy.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Handles user info extraction for all three providers (Google, Naver, Kakao).
 * Finds or creates a Member row, then wraps it in OAuthMemberPrincipal.
 */
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final AuthService authService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        OAuth2User oauthUser = super.loadUser(request);
        String provider = request.getClientRegistration().getRegistrationId(); // "google" | "naver" | "kakao"

        String email, name, providerId;

        try {
            switch (provider) {
                case "google" -> {
                    email      = oauthUser.getAttribute("email");
                    name       = oauthUser.getAttribute("name");
                    providerId = oauthUser.getAttribute("sub");
                }
                case "naver" -> {
                    // Naver wraps user info in a nested "response" object
                    @SuppressWarnings("unchecked")
                    Map<String, Object> resp = (Map<String, Object>) oauthUser.getAttribute("response");
                    if (resp == null) throw new OAuth2AuthenticationException(
                            new OAuth2Error("naver_missing_response"), "Naver response is null");
                    email      = (String) resp.get("email");
                    name       = (String) resp.get("name");
                    providerId = (String) resp.get("id");
                }
                case "kakao" -> {
                    // Kakao: id at top level, email inside kakao_account
                    Object rawId = oauthUser.getAttribute("id");
                    providerId = rawId != null ? String.valueOf(rawId) : null;

                    @SuppressWarnings("unchecked")
                    Map<String, Object> account = (Map<String, Object>) oauthUser.getAttribute("kakao_account");
                    email = account != null ? (String) account.get("email") : null;

                    @SuppressWarnings("unchecked")
                    Map<String, Object> profile = account != null
                            ? (Map<String, Object>) account.get("profile") : null;
                    name = profile != null ? (String) profile.get("nickname") : null;
                }
                default -> throw new OAuth2AuthenticationException(
                        new OAuth2Error("unsupported_provider"), "Unknown provider: " + provider);
            }
        } catch (OAuth2AuthenticationException e) {
            throw e;
        } catch (Exception e) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("user_info_error"), "Failed to extract user info from " + provider, e);
        }

        // Fallback email for providers that don't return one (e.g., Kakao without consent)
        if (email == null || email.isBlank()) {
            email = provider + "_" + providerId + "@oauth.ploy.kr";
        }
        if (providerId == null || providerId.isBlank()) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("missing_provider_id"), "Provider ID is missing from " + provider);
        }

        Member member = authService.processOAuthLogin(email, name, provider, providerId);
        return new OAuthMemberPrincipal(member, oauthUser.getAttributes());
    }
}
