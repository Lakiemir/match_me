package com.matchme.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

// This class runs once when the backend starts
// To confirm that Spring Boot can connect to PostgreSQL.
@Component
public class DatabaseConnectionCheck implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    // Spring gives us JdbcTemplate automatically because we configured the datasource.
    public DatabaseConnectionCheck(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        // Asks PostgreSQL which database we are connected to.
        String databaseName = jdbcTemplate.queryForObject(
                "SELECT current_database()",
                String.class
        );

        System.out.println("Connected to PostgreSQL database: " + databaseName);
    }
}