package com.univer.booking.config;

import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Configuration for Railway deployment that parses DATABASE_URL / DATABASE_PUBLIC_URL
 * and exposes all DATABASE_* variables as Spring properties.
 * 
 * Railway provides:
 *   DATABASE_URL           - internal: postgresql://user:pass@host:port/dbname
 *   DATABASE_PUBLIC_URL    - external: postgresql://user:pass@public-host:port/dbname
 *   DATABASE_USER          - username
 *   DATABASE_PASSWORD      - password
 *   DATABASE_HOST          - internal host
 *   DATABASE_PUBLIC_HOST   - public host
 *   DATABASE_PORT          - port
 *   DATABASE_NAME          - database name
 *   PGUSER, PGPASSWORD, PGDATABASE, PGHOST, PGPORT - PostgreSQL convention
 */
public class RailwayConfig implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext context) {
        Environment env = context.getEnvironment();

        // Debug: print all DATABASE_* variables
        System.out.println("[RailwayConfig] Scanning database environment variables...");
        String[] dbVars = {
            "DATABASE_URL", "DATABASE_PUBLIC_URL",
            "DATABASE_USER", "DATABASE_PASSWORD", "DATABASE_HOST", "DATABASE_PUBLIC_HOST",
            "DATABASE_PORT", "DATABASE_NAME",
            "PGUSER", "PGPASSWORD", "PGDATABASE", "PGHOST", "PGPORT"
        };
        for (String v : dbVars) {
            String val = env.getProperty(v);
            if (val != null) {
                System.out.println("[RailwayConfig]   " + v + "=" + maskIfSensitive(v, val));
            }
        }

        try {
            // 1. Try DATABASE_URL first (internal connection — preferred in Railway)
            String jdbcUrl = parseDatabaseUrl(env.getProperty("DATABASE_URL"));
            String username = resolveUsername(env);
            String password = resolvePassword(env);

            if (jdbcUrl != null) {
                System.setProperty("spring.datasource.url", jdbcUrl);
                System.setProperty("spring.datasource.username", username);
                System.setProperty("spring.datasource.password", password);
                System.out.println("[RailwayConfig] ✓ Connected using DATABASE_URL");
                return;
            }

            // 2. Try DATABASE_PUBLIC_URL (for external access)
            String publicUrl = parseDatabaseUrl(env.getProperty("DATABASE_PUBLIC_URL"));
            if (publicUrl != null) {
                System.setProperty("spring.datasource.url", publicUrl);
                System.setProperty("spring.datasource.username", username);
                System.setProperty("spring.datasource.password", password);
                System.out.println("[RailwayConfig] ✓ Connected using DATABASE_PUBLIC_URL");
                return;
            }

            // 3. Try individual variables (DATABASE_HOST, DATABASE_USER, etc.)
            String host = env.getProperty("DATABASE_HOST");
            String port = env.getProperty("DATABASE_PORT", "5432");
            String name = env.getProperty("DATABASE_NAME");
            String user = env.getProperty("DATABASE_USER");
            String pass = env.getProperty("DATABASE_PASSWORD");

            if (host != null && name != null && user != null && pass != null) {
                String url = "jdbc:postgresql://" + host + ":" + port + "/" + name;
                System.setProperty("spring.datasource.url", url);
                System.setProperty("spring.datasource.username", user);
                System.setProperty("spring.datasource.password", pass);
                System.out.println("[RailwayConfig] ✓ Connected using individual DATABASE_* variables");
                return;
            }

            // 4. Try PG* convention
            String pgHost = env.getProperty("PGHOST");
            String pgPort = env.getProperty("PGPORT", "5432");
            String pgDb = env.getProperty("PGDATABASE");
            String pgUser = env.getProperty("PGUSER");
            String pgPass = env.getProperty("PGPASSWORD");

            if (pgHost != null && pgDb != null && pgUser != null && pgPass != null) {
                String url = "jdbc:postgresql://" + pgHost + ":" + pgPort + "/" + pgDb;
                System.setProperty("spring.datasource.url", url);
                System.setProperty("spring.datasource.username", pgUser);
                System.setProperty("spring.datasource.password", pgPass);
                System.out.println("[RailwayConfig] ✓ Connected using PG* variables");
                return;
            }

            System.out.println("[RailwayConfig] ⚠ No database configuration found, using defaults");

        } catch (Exception e) {
            System.err.println("[RailwayConfig] ✗ Error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /** Parse postgresql://user:pass@host:port/dbname into jdbc:postgresql://host:port/dbname */
    private String parseDatabaseUrl(String url) {
        if (url == null || url.isEmpty()) return null;

        // Already a JDBC URL
        if (url.startsWith("jdbc:")) return url;

        Pattern pattern = Pattern.compile(
            "^(postgresql|postgres)://([^:]+):([^@]+)@([^/]+)/(\\S+)$"
        );
        Matcher matcher = pattern.matcher(url);

        if (matcher.matches()) {
            String hostPort = matcher.group(4);  // host:port
            String dbname = matcher.group(5);
            return "jdbc:postgresql://" + hostPort + "/" + dbname;
        }

        System.out.println("[RailwayConfig] ⚠ URL format not recognized: " + url);
        return null;
    }

    private String resolveUsername(Environment env) {
        String u = env.getProperty("DATABASE_USER");
        if (u != null) return u;
        u = env.getProperty("PGUSER");
        if (u != null) return u;
        // Extract from DATABASE_URL
        String url = env.getProperty("DATABASE_URL");
        if (url != null) {
            Matcher m = Pattern.compile("^(?:postgresql|postgres)://([^:]+):").matcher(url);
            if (m.find()) return m.group(1);
        }
        return "postgres";
    }

    private String resolvePassword(Environment env) {
        String p = env.getProperty("DATABASE_PASSWORD");
        if (p != null) return p;
        p = env.getProperty("PGPASSWORD");
        if (p != null) return p;
        String url = env.getProperty("DATABASE_URL");
        if (url != null) {
            Matcher m = Pattern.compile("^(?:postgresql|postgres)://[^:]+:([^@]+)@").matcher(url);
            if (m.find()) return m.group(1);
        }
        return "postgres";
    }

    private String maskIfSensitive(String name, String value) {
        if (name.contains("PASSWORD") || name.contains("PASS") || name.contains("SECRET")) {
            return "***";
        }
        return value;
    }
}
