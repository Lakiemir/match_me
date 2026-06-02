package com.matchme.config;

import java.security.Principal;

// Store the authenticated user id in the WebSocket session.
public class StompPrincipal implements Principal {

    private final String name;

    public StompPrincipal(String name) {
        this.name = name;
    }

    @Override
    public String getName() {
        return name;
    }
}
