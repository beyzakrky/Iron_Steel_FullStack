package com.example.demo.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // @PreAuthorize'ın çalışması için şart
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> 
        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // token bazlı, session yok
        .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/auth/**").permitAll() // kayıt/giriş herkese açık
        .anyRequest().authenticated()
        )
        // token yok/geçersiz/süresi dolmuşsa 401 fırlatır
        .exceptionHandling(ex -> ex
        .authenticationEntryPoint((request, response, authException) -> {
            response.setStatus(401);
            response.setContentType("application/json");
            response.getWriter().write(
                "{\"error\":\"TOKEN_EXPIRED\",\"message\":\"Oturum süresi doldu, lütfen tekrar giriş yapın.\"}"
            );
        })
        )
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }
}