package com.prod.ploy.security;

import com.prod.ploy.repository.MemberRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/*
 * Reads the Bearer token from the Authorization header.
 * If valid, loads the Member and sets the SecurityContext.
 * Requests without a valid token pass through unauthenticated —
 * endpoint-level authorization then decides whether to reject them.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final MemberRepository memberRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        // Always use the JWT when a valid Bearer token is present.
        // Removing the getAuthentication() == null guard ensures that a JWT
        // from a newer login (e.g. admin) always takes precedence over a stale
        // session-based auth (e.g. previous USER session cookie), which would
        // otherwise cause 403s even though the correct token is supplied.
        if (email != null) {
            UserDetails user = memberRepository.findByEmail(email).orElse(null);

            if (user != null && jwtService.isValid(token)) {
                var auth = new UsernamePasswordAuthenticationToken(
                        user, null, user.getAuthorities());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        chain.doFilter(request, response);
    }
}
