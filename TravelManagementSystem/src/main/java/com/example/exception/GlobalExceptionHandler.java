package com.example.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.dto.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // =========================================================
    // INVALID LOGIN
    // =========================================================

    @ExceptionHandler(
            InvalidCredentialsException.class
    )
    public ResponseEntity<ApiResponse>
    handleInvalidCredentials(
            InvalidCredentialsException ex) {

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(
                        new ApiResponse(
                                false,
                                ex.getMessage()
                        )
                );
    }

    // =========================================================
    // USER NOT FOUND
    // =========================================================

    @ExceptionHandler(
            UserNotFoundException.class
    )
    public ResponseEntity<ApiResponse>
    handleUserNotFound(
            UserNotFoundException ex) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(
                        new ApiResponse(
                                false,
                                ex.getMessage()
                        )
                );
    }

    // =========================================================
    // USER ALREADY EXISTS
    // =========================================================

    @ExceptionHandler(
            UserAlreadyExistsException.class
    )
    public ResponseEntity<ApiResponse>
    handleUserAlreadyExists(
            UserAlreadyExistsException ex) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(
                        new ApiResponse(
                                false,
                                ex.getMessage()
                        )
                );
    }

    // =========================================================
    // DESTINATION NOT FOUND
    // =========================================================

    @ExceptionHandler(
            DestinationNotFoundException.class
    )
    public ResponseEntity<ApiResponse>
    handleDestinationNotFound(
            DestinationNotFoundException ex) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(
                        new ApiResponse(
                                false,
                                ex.getMessage()
                        )
                );
    }

    // =========================================================
    // VALIDATION ERROR
    // =========================================================

    @ExceptionHandler(
            MethodArgumentNotValidException.class
    )
    public ResponseEntity<ApiResponse>
    handleValidation(
            MethodArgumentNotValidException ex) {

        String message =
                "Invalid request";

        if (ex.getBindingResult()
                .getFieldError() != null) {

            message =
                    ex.getBindingResult()
                            .getFieldError()
                            .getDefaultMessage();
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                        new ApiResponse(
                                false,
                                message
                        )
                );
    }

    // =========================================================
    // ALL OTHER ERRORS
    // =========================================================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse>
    handleException(Exception ex) {

        ex.printStackTrace();

        return ResponseEntity
                .status(
                        HttpStatus.INTERNAL_SERVER_ERROR
                )
                .body(
                        new ApiResponse(
                                false,
                                "Something went wrong."
                        )
                );
    }
}