package com.prod.ploy.security;

import com.prod.ploy.dto.AuthResponse;
import com.prod.ploy.model.Member;
import com.prod.ploy.service.AuthService;
import com.prod.ploy.service.LoginAuditService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * Called by Spring Security after a successful OAuth2 login.
 * Issues a JWT and redirects the browser back to the React frontend.
 *
 * Redirect target: {FRONTEND_URL}/oauth2/success?token=...&id=...&name=...&email=...&role=...
 * The frontend /oauth2/success page reads these params and stores the session.
 */
@Component
@RequiredArgsConstructor
public class OAuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AuthService authService;
    private final LoginAuditService loginAuditService;

    @Value("${ploy.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuthMemberPrincipal principal = (OAuthMemberPrincipal) authentication.getPrincipal();
        Member member = principal.getMember();
        String provider = member.getOauthProvider() != null ? member.getOauthProvider() : "unknown";
        loginAuditService.recordOAuthSuccess(member, provider, request);

        AuthResponse auth = authService.toAuthResponse(member);

        String redirectUrl = UriComponentsBuilder
                .fromUriString(frontendUrl)
                .path("/oauth2/success")
                .queryParam("token", auth.token())
                .queryParam("id",    auth.user().id())
                .queryParam("name",  auth.user().name())
                .queryParam("email", auth.user().email())
                .queryParam("role",  auth.user().role())
                .build()
                .encode()
                .toUriString();

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
