package com.matchme.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

// Converts common backend errors into clear JSON responses.
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    ProblemDetail handleResponseStatusException(ResponseStatusException exception) {
        // Keeps service-layer HTTP errors readable in Postman.
        return ProblemDetail.forStatusAndDetail(
                exception.getStatusCode(),
                exception.getReason()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail handleValidationException(MethodArgumentNotValidException exception) {
        // Returns 400 when request JSON fails validation annotations.
        return ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Invalid request"
        );
    }
}