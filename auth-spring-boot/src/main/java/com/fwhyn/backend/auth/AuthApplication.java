package com.fwhyn.backend.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class AuthApplication {

    public static void main(String[] args) {
        // Load environment variables from the .env file
        Dotenv.load();
        SpringApplication.run(AuthApplication.class, args);
    }

}
