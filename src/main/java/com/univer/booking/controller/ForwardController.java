package com.univer.booking.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ForwardController {

    @GetMapping(value = {
        "/login",
        "/register",
        "/equipment/{id}",
        "/equipment",
        "/bookings/**",
        "/my-bookings",
        "/admin/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
