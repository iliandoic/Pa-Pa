package bg.papa.config;

import bg.papa.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/", "/api/health").permitAll()
                .requestMatchers("/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .requestMatchers("/error").permitAll()

                // Auth endpoints
                .requestMatchers("/api/auth/**").permitAll()

                // Product endpoints (public read)
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/collections/**").permitAll()

                // Cart endpoints (public - uses cart ID)
                .requestMatchers("/api/cart/**").permitAll()

                // Checkout (public for guest checkout)
                .requestMatchers("/api/checkout/**").permitAll()

                // Payment webhooks (public, verified by signature)
                .requestMatchers("/api/payments/*/webhook").permitAll()

                // Shipping calculation (public)
                .requestMatchers(HttpMethod.POST, "/api/shipping/calculate").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/shipping/*/offices").permitAll()

                // Stock check (public for cart validation)
                .requestMatchers("/api/stock/**").permitAll()

                // Admin endpoints (temporarily public for development)
                .requestMatchers("/api/admin/**").permitAll()

                // Admin endpoints (require ADMIN role)
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Customer endpoints (require authentication)
                .requestMatchers("/api/customers/**").authenticated()
                .requestMatchers("/api/orders/**").authenticated()

                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
