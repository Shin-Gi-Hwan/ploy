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
        member.setRole(Member.UserRole.CLIENT);

        Member saved = memberRepository.save(member);
        return toAuthResponse(saved);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        Member member = memberRepository.findByEmail(req.email().trim().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));

        if (!passwordEncoder.matches(req.password(), member.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password.");
        }

        return toAuthResponse(member);
    }

    private AuthResponse toAuthResponse(Member member) {
        String token = jwtService.generateToken(member.getEmail(), member.getRole().name());
        return new AuthResponse(
                token,
                new AuthResponse.UserView(
                        member.getId(),
                        member.getName(),
                        member.getEmail(),
                        member.getRole().name()
                )
        );
    }

    public static class EmailTakenException extends RuntimeException {
        public EmailTakenException(String message) { super(message); }
    }
}
