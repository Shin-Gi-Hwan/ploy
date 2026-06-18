package com.prod.ploy.config;

import com.prod.ploy.security.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/*
 * Two parallel auth schemes, zero overlap:
 *
 *  1. HTTP Basic  → /api/admin/**
 *     In-memory admin user, credentials from env vars.
 *     Used by the React admin SPA (legacy, unchanged).
 *
 *  2. JWT Bearer  → /api/client/**, /api/freelancer/**
 *     JwtAuthFilter populates SecurityContext from the Bearer token.
 *     Members register/login via /api/auth/**.
 *
 *  /api/auth/** and all public routes → permitAll
 *
 * CSRF disabled: stateless REST API, no session cookies.
 * TLS REQUIRED in production — HTTP Basic is cleartext without it.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${ploy.admin.username}")
    private String adminUsername;

    @Value("${ploy.admin.password}")
    private String adminPassword;

    @Value("${ploy.base-url:http://localhost:8080}")
    private String baseUrl;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // Auth endpoints — always public
                        .requestMatchers("/api/auth/**").permitAll()
                        // Legacy admin — HTTP Basic
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        // Member dashboards — JWT required
                        .requestMatchers("/api/client/**").hasRole("CLIENT")
                        .requestMatchers("/api/freelancer/**").hasRole("FREELANCER")
                        // Everything else (public API, React static files)
                        .anyRequest().permitAll())
                // Add JWT filter before Spring's username/password filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                // Keep HTTP Basic for the in-memory admin user (legacy admin UI)
                .httpBasic(Customizer.withDefaults())
                .build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                baseUrl
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /*
     * In-memory user for legacy /api/admin/** Basic Auth.
     * This does NOT affect JWT-authenticated member routes —
     * those use MemberRepository directly in JwtAuthFilter.
     */
    @Bean
    UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        var admin = User.builder()
                .username(adminUsername)
                .password(passwordEncoder.encode(adminPassword))
                .roles("ADMIN")
                .build();
        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
