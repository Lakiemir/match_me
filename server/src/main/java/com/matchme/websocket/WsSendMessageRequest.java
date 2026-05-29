package com.matchme.websocket;

import jakarta.validation.constraints.NotBlank;

public record WsSendMessageRequest (@NotBlank String content) {}
