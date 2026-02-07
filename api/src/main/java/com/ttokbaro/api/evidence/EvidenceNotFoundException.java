package com.ttokbaro.api.evidence;

public class EvidenceNotFoundException extends RuntimeException {

    public EvidenceNotFoundException(Long id) {
        super("Evidence not found");
    }
}
