package com.prod.ploy.service;

import com.prod.ploy.dto.AuthResponse;
import com.prod.ploy.dto.LoginRequest;
import com.prod.ploy.dto.RegisterRequest;
import com.prod.ploy.model.Member;
import com.prod.ploy.repository.MemberRepository;
import com.prod.ploy.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (memberRepository.existsByEmail(req.email())) {
            throw new EmailTakenException("An account with this email already exists.");
        }

        Member member = new Member();
        member.setName(req.name().trim());
        member.setEmail(req.email().trim().toLowerCase());
        member.setPasswordHash(passwordEncoder.encode(req.password()));
        member.setRole(Member.UserRole.USER);

        Member saved = memberRepository.save(member);
        return toAuthResponse(saved);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        Member member = memberRepository.findByEmail(req.email().trim().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));

        // Social-only accounts have no password
        if (member.getPasswordHash() == null
                || !passwordEncoder.matches(req.password(), member.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password.");
        }

        return toAuthResponse(member);
    }

    /** Find-or-create a Member from a social OAuth2 login. */
    @Transactional
    public Member processOAuthLogin(String email, String name,
                                     String provider, String providerId) {
        // 1. Look up by provider + providerId (fastest, most reliable)
        return memberRepository
                .findByOauthProviderAndOauthProviderId(provider, providerId)
                .orElseGet(() -> {
                    // 2. Same email already registered locally → link the social account
                    return memberRepository.findByEmail(email.toLowerCase())
                            .map(existing -> {
                                existing.setOauthProvider(provider);
                                existing.setOauthProviderId(providerId);
                                return memberRepository.save(existing);
                            })
                            // 3. Brand-new user → create a Member (no passwordHash)
                            .orElseGet(() -> {
                                Member m = new Member();
                                m.setEmail(email.toLowerCase());
                                m.setName(name != null && !name.isBlank()
                                        ? name : email.split("@")[0]);
                                m.setPasswordHash(null);
                                m.setRole(Member.UserRole.USER);
                                m.setOauthProvider(provider);
                                m.setOauthProviderId(providerId);
                                return memberRepository.save(m);
                            });
                });
    }

    public AuthResponse toAuthResponse(Member member) {
        String token = jwtService.generateToken(member.getEmail(), member.getRole().name());
        return new AuthResponse(token, new AuthResponse.UserView(
                member.getId(), member.getName(), member.getEmail(), member.getRole().name()));
    }

    public static class EmailTakenException extends RuntimeException {
        public EmailTakenException(String message) { super(message); }
    }
}
