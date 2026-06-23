package com.prod.ploy.config;

import com.prod.ploy.security.CustomOAuth2UserService;
import com.prod.ploy.security.JwtAuthFilter;
import com.prod.ploy.security.OAuthSuccessHandler;
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
 * Three parallel auth schemes:
 *
 *  1. HTTP Basic  → /api/admin/**
 *     In-memory admin user, credentials from env vars (legacy, unchanged).
 *
 *  2. JWT Bearer  → /api/client/**, /api/console/**, /api/freelancer/**
 *     JwtAuthFilter populates SecurityContext from the Bearer token.
 *     Members register/login via /api/auth/** (email+password).
 *
 *  3. OAuth2 Login → /api/auth/oauth2/**
 *     Spring Security handles the redirect/callback cycle.
 *     OAuthSuccessHandler issues a JWT and redirects to the frontend.
 *     Supported providers: Google, Naver, Kakao.
 *
 * Session policy is IF_REQUIRED (not STATELESS) so OAuth2 can store
 * the state parameter in the session during the authorization flow.
 * All other auth (JWT, Basic) ignores the session.
 *
 * CSRF disabled: stateless REST API with no session cookies for auth.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${ploy.admin.username}")
    private String adminUsername;

    @Value("${ploy.admin.password}")
    private String adminPassword;

    @Value("${ploy.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http,
                                    JwtAuthFilter jwtAuthFilter,
                                    CustomOAuth2UserService oAuth2UserService,
                                    OAuthSuccessHandler oAuthSuccessHandler) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                // IF_REQUIRED: sessions are created during OAuth2 flow only
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                    // OAuth2 flow endpoints — must be public
                    .requestMatchers("/api/auth/oauth2/**").permitAll()
                    // Standard auth
                    .requestMatchers("/api/auth/**").permitAll()
                    // Public data endpoints
                    .requestMatchers("/api/partners/**").permitAll()
                    .requestMatchers("/api/projects/**").permitAll()
                    .requestMatchers("/api/files/**").permitAll()
                    // Role-protected
                    .requestMatchers("/api/admin/**").hasRole("ADMIN")
                    .requestMatchers("/api/console/**").hasRole("ADMIN")
                    .requestMatchers("/api/client/**").hasRole("USER")
                    .requestMatchers("/api/partner/**").hasAnyRole("USER", "OUTSOURCING_PARTNER")
                    .requestMatchers("/api/freelancer/**").hasRole("OUTSOURCING_PARTNER")
                    .anyRequest().permitAll())
                // JWT filter for Bearer token auth
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                // OAuth2 Login (Google, Naver, Kakao)
                .oauth2Login(oauth2 -> oauth2
                    .authorizationEndpoint(ep -> ep
                        .baseUri("/api/auth/oauth2/authorization"))
                    .redirectionEndpoint(ep -> ep
                        .baseUri("/api/auth/oauth2/callback/*"))
                    .userInfoEndpoint(ep -> ep
                        .userService(oAuth2UserService))
                    .successHandler(oAuthSuccessHandler)
                    .failureUrl(frontendUrl + "/login?error=oauth_failed"))
                // Keep HTTP Basic for the in-memory admin user (legacy /api/admin/**)
                .httpBasic(Customizer.withDefaults())
                .build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "https://ploy.kr",
                "https://www.ploy.kr",
                frontendUrl
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"));
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

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
