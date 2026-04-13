package com.univer.booking.config;

import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
            try {
                // Parse Railway's DATABASE_URL format
                // Format: postgresql://user:password@host:port/dbname
                // or: postgres://user:password@host:port/dbname
                Pattern pattern = Pattern.compile(
                    "^(postgresql|postgres)://([^:]+):([^@]+)@([^/]+)/(\\S+)$"
                );
                Matcher matcher = pattern.matcher(databaseUrl);

                if (matcher.matches()) {
                    String host = matcher.group(4);
                    String username = matcher.group(2);
                    String password = matcher.group(3);
                    String dbname = matcher.group(5);

                    // Build proper JDBC URL
                    String jdbcUrl = "jdbc:postgresql://" + host + "/" + dbname;

                    System.setProperty("spring.datasource.url", jdbcUrl);
                    System.setProperty("spring.datasource.username", username);
                    System.setProperty("spring.datasource.password", password);

                    System.out.println("[RailwayConfig] DATABASE_URL parsed successfully");
                    System.out.println("[RailwayConfig] JDBC URL: " + jdbcUrl);
                } else {
                    // Maybe already a JDBC URL or different format
                    if (databaseUrl.startsWith("jdbc:")) {
                        System.setProperty("spring.datasource.url", databaseUrl);
                    }
                    System.out.println("[RailwayConfig] DATABASE_URL format not recognized, using as-is: " + databaseUrl);
                }

                // Also try to get credentials from separate env vars if available
                String envUsername = env.getProperty("DATABASE_USER");
                String envPassword = env.getProperty("DATABASE_PASSWORD");
                if (envUsername != null) {
                    System.setProperty("spring.datasource.username", envUsername);
                }
                if (envPassword != null) {
                    System.setProperty("spring.datasource.password", envPassword);
                }
            } catch (Exception e) {
                System.err.println("[RailwayConfig] Error parsing DATABASE_URL: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
}
