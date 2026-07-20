// Localde çalıştırırken Spring Boota istek attığımızda
// Network Error veya CORS hatası almamak için

package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
// SpringBoot'a bu sınıfın bir yapılandırma sınıfı olduğunu 
// söyler. Uygulama ayağa kalkarken Spring bu sınıfı tarar ve içindeki kuralları sisteme 
// dahil eder. 
public class WebMvcConfig {

    @Bean
    // Spring'in IoC (Inversion of Control) konteynerine, "Buradan dönen nesneyi al ve uygulamanın 
    // genelinde kullanılmak üzere bellekte tut" diyor.
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            // registry nesnesi üzerinden kurallar sisteme kaydolunuyor.
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("*") // local için ideal ama canlıya alınınca güvenlik açığı oluşturur.
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
            }
        };
    }
}