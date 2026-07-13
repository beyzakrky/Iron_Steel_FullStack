package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.util.Base64;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();
        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            response.put("error", "Bu e-posta zaten kayıtlı!");
            return response;
        }
        // Varsayılan rol atayalım (Eğer boş geldiyse)
        if(user.getRole() == null) user.setRole("INTERN");
        
        userRepository.save(user);
        response.put("message", "Kayıt başarıyla tamamlandı!");
        return response;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> credentials) {
        Map<String, String> response = new HashMap<>();
        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null && user.getPassword().equals(password)) {
            // Güvenli veri paketi oluşturuyoruz (Simüle JWT)
            String rawToken = user.getUsername() + ":" + user.getRole();
            String token = Base64.getEncoder().encodeToString(rawToken.getBytes());
            
            response.put("token", token);
            response.put("role", user.getRole());
            response.put("name", user.getUsername());
        } else {
            response.put("error", "Hatalı e-posta veya şifre!");
        }
        return response;
    }
}