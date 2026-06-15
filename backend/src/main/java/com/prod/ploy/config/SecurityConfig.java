package com.prod.ploy.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/*
 * Security model:
 *   - /api/admin/**  → HTTP Basic, in-memory admin user, credentials from env vars
 *   - everything else → permitAll (public API + React static files)
 *
 * CORS is wired through SecurityFilterChain (not @CrossOrigin) so that Spring
 * Security's filter handles preflight OPTIONS requests before they're blocked.
 * CSRF is disabled: all state changes go through the stateless REST API.
 *
 * TLS REQUIREMENT: HTTP Basic is only safe over HTTPS. Railway and Render
 * provision TLS automatically. VPS deployments require a reverse proxy
 * (Nginx + Certbot, or Caddy) terminating TLS before traffic reaches this app.
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
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/admin/**").authenticated()
                        .anyRequest().permitAll())
                .httpBasic(Customizer.withDefaults())
                .build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Dev: allow Vite dev server. Prod: allow the deployed frontend origin.
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                baseUrl
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

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
}
