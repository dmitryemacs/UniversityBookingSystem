package com.univer.booking.config;

import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

/**
 * Configuration for Railway deployment that parses DATABASE_URL
 * This runs BEFORE the application context is refreshed, so datasource gets correct URL
 * Railway provides database URL in format: postgresql://user:password@host:port/dbname
 */
public class RailwayConfig implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext context) {
        Environment env = context.getEnvironment();
        String databaseUrl = env.getProperty("DATABASE_URL");
        
        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            // Convert Railway's DATABASE_URL to Spring Boot compatible format
            // Format: postgresql://user:password@host:port/dbname
            // or: postgres://user:password@host:port/dbname
            String jdbcUrl = databaseUrl;
            
            if (jdbcUrl.startsWith("postgresql://")) {
                jdbcUrl = "jdbc:" + jdbcUrl.replace("postgresql://", "");
            } else if (jdbcUrl.startsWith("postgres://")) {
                jdbcUrl = "jdbc:" + jdbcUrl.replace("postgres://", "");
            }
            
            // Set as system properties so Spring Boot auto-configuration picks them up
            System.setProperty("SPRING_DATASOURCE_URL", jdbcUrl);
            System.setProperty("spring.datasource.url", jdbcUrl);
            
            String username = env.getProperty("DATABASE_USER");
            if (username != null) {
                System.setProperty("SPRING_DATASOURCE_USERNAME", username);
                System.setProperty("spring.datasource.username", username);
            }
            
            String password = env.getProperty("DATABASE_PASSWORD");
            if (password != null) {
                System.setProperty("SPRING_DATASOURCE_PASSWORD", password);
                System.setProperty("spring.datasource.password", password);
            }
        }
    }
}
