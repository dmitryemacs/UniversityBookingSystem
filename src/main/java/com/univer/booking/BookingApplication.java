package com.univer.booking;

import com.univer.booking.config.RailwayConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BookingApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(BookingApplication.class);
        app.addInitializers(new RailwayConfig());
        app.run(args);
    }
}
