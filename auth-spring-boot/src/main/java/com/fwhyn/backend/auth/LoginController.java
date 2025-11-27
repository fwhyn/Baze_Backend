package com.fwhyn.backend.auth;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@RestController
public class LoginController {

    private final SecretKey key;

    public LoginController(@Value("${jwt.secret}") String secretString) {
        // The secret string should be long enough (e.g., 32+ bytes for HS256).
        // We generate the key in the constructor after receiving the secret.
        this.key = Keys.hmacShaKeyFor(secretString.getBytes(StandardCharsets.UTF_8));
    }

    // Data Transfer Object (DTO) for the login request
    public static class LoginRequest {

        private String username;
        private String password;

        // Getters and setters (or use a Java record in JDK 16+)
        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    // DTO for the token response
    public static class TokenResponse {

        private final String token;

        public TokenResponse(String token) {
            this.token = token;
        }

        public String getToken() {
            return token;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequest req) {
        // Replace this with real user validation
        if ("user".equals(req.getUsername()) && "pass".equals(req.getPassword())) {
            Date now = new Date();
            // 1 hour expiration time
            Date exp = new Date(now.getTime() + 3600_000);

            String token = Jwts.builder()
                    .setSubject(req.getUsername())
                    .setIssuedAt(now)
                    .setExpiration(exp)
                    .claim("role", "user")
                    // Use the generated SecretKey with the recommended signWith method
                    .signWith(key)
                    .compact();

            return ResponseEntity.ok(new TokenResponse(token));
        }

        // Using a map for a simple error response body
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Invalid credentials");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }
}
