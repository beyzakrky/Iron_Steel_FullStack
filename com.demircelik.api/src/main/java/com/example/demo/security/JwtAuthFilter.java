package com.example.demo.security;
 
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
 
import java.io.IOException;
import java.util.List;

/***
 * Her HTTP isteğinde çalışır: "Authorization: Bearer <token>" headerını 
 * okur, JwtUtil ile doğrular, token geçerliyse ilgili User'ı veritabanından 
 * çekip Spring Security nin SecurityContext'ine koyar. 
 * 
 * Bu tamamlanınca controllerdaki 
 * @AuthenticationPrincipal User currentUser 
 * parametreleri dolur gelir
 */


@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
 
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
 
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain)
            throws ServletException, IOException {
 
        String authHeader = request.getHeader("Authorization");
        System.out.println("---- JWT FILTER ---- " + request.getRequestURI());
        System.out.println("Authorization header: " + authHeader);
 
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("-> Header yok/hatalı format, filtre atlanıyor.");
            filterChain.doFilter(request, response);
            return;
        }
 
        String token = authHeader.substring(7);
        boolean valid = jwtUtil.isTokenValid(token);
        System.out.println("-> Token geçerli mi: " + valid);
 
        if (valid) {
            String email = jwtUtil.extractEmail(token);
            System.out.println("-> Token'dan çıkarılan email: " + email);
 
            var userOpt = userRepository.findByEmail(email);
            System.out.println("-> Bu email ile kullanıcı bulundu mu: " + userOpt.isPresent());
 
            userOpt.ifPresent(user -> {
                System.out.println("-> Kullanıcının rolü: " + user.getRole());
                List<GrantedAuthority> authorities =
                        List.of(new SimpleGrantedAuthority(user.getRole()));
 
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(user, null, authorities);
 
                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("-> SecurityContext'e authentication YAZILDI.");
            });
        }
 
        filterChain.doFilter(request, response);
    }
}
 