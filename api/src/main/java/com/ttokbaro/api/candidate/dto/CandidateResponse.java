package com.ttokbaro.api.candidate.dto;

import com.ttokbaro.api.candidate.Candidate;
import java.time.Instant;

public record CandidateResponse(
        Long id,
        String name,
        String partyName,
        String sggName,
        Instant updatedAt
) {
    public static CandidateResponse from(Candidate candidate) {
        return new CandidateResponse(
                candidate.getId(),
                candidate.getName(),
                candidate.getPartyName(),
                candidate.getSggName(),
                candidate.getUpdatedAt()
        );
    }
}
