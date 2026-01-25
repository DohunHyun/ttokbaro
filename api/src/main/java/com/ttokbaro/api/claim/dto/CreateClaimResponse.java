package com.ttokbaro.api.claim.dto;

import com.ttokbaro.api.claim.Claim;
import java.time.Instant;

public record CreateClaimResponse(
        Long id,
        String sourceUrl,
        String text,
        Instant createdAt
) {
    public static CreateClaimResponse from(Claim claim) {
        return new CreateClaimResponse(
                claim.getId(),
                claim.getSourceUrl(),
                claim.getText(),
                claim.getCreatedAt()
        );
    }
}
