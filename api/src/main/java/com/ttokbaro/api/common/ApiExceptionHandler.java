package com.ttokbaro.api.common;

import com.ttokbaro.api.claim.ClaimNotFoundException;
import com.ttokbaro.api.evidence.EvidenceNotFoundException;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        String message = ex.getMessage() == null ? "Invalid request" : ex.getMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", message));
    }

    @ExceptionHandler(ClaimNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleClaimNotFound(ClaimNotFoundException ex) {
        String message = ex.getMessage() == null ? "Claim not found" : ex.getMessage();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", message));
    }

    @ExceptionHandler(EvidenceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleEvidenceNotFound(EvidenceNotFoundException ex) {
        String message = ex.getMessage() == null ? "Evidence not found" : ex.getMessage();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", message));
    }
}
