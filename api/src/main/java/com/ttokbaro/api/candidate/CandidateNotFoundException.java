package com.ttokbaro.api.candidate;

public class CandidateNotFoundException extends RuntimeException {

    public CandidateNotFoundException(Long id) {
        super("Candidate not found");
    }
}
