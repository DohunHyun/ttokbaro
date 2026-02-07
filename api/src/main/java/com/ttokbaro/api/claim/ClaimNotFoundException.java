package com.ttokbaro.api.claim;

public class ClaimNotFoundException extends RuntimeException {

    public ClaimNotFoundException(Long id) {
        super("Claim not found");
    }
}
