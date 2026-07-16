package com.example.demo.security;

import com.example.demo.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/***
 * Bu dosya jjwt 0.12.x API'sini varsayıyor
 * pom.xml dosyasında yer alan dependency sürümleri ile eşleştirilmiştir. 
 */

@Component
public class JwtUtil {
    // application.properties dosyasında "jwt.secret" tanımlı olacak, en az 32 karakter
    @Value("${jwt.secret}")
    private String secret;

    @Value ("${jwt.expiration-ms:86400000}") // varsayılan 24 saat
    private long expirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(User user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
        .subject(user.getEmail())
        .claim("role", user.getRole()) // DashboardScreen bu alandan okuyor
        .claim("name", user.getUsername())
        .issuedAt(now)
        .expiration(expiry)
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
        .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
        .verifyWith(getSigningKey())
        .build()
        .parseSignedClaims(token)
        .getPayload();
    }

    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = parseClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}