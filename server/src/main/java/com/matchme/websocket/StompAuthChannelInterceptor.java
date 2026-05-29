package com.matchme.websocket;

import com.matchme.auth.JwtService;
import io.jsonwebtoken.JwtException;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Component
public class StompAuthChannelInterceptor implements ChannelInterceptor{
    private final JwtService jwtService;
    public StompAuthChannelInterceptor(JwtService jwtService){
        this.jwtService = jwtService;
    }
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel){
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")){
                throw new ResponseStatusException(UNAUTHORIZED, "Missing token");
            }

            String token = authHeader.substring("Bearer ".length()).trim();
            try {
                Long userId = jwtService.getUserIdFromToken(token);
                accessor.setUser(new StompPrincipal(userId.toString()));
            } catch (JwtException | IllegalArgumentException e) {
                throw new ResponseStatusException(UNAUTHORIZED, "Invalid token");
            }
        }
        return message;
    }
}
