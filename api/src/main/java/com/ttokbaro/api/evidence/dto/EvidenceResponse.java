package com.ttokbaro.api.evidence.dto;

import com.ttokbaro.api.evidence.Evidence;
import java.time.Instant;

public record EvidenceResponse(
        Long id,
        Long claimId,
        Long parentEvidenceId,
        String url,
        String note,
        Instant createdAt
) {
    public static EvidenceResponse from(Evidence evidence) {
        return new EvidenceResponse(
                evidence.getId(),
                evidence.getClaim().getId(),
                evidence.getParentEvidence() == null ? null : evidence.getParentEvidence().getId(),
                evidence.getUrl(),
                evidence.getNote(),
                evidence.getCreatedAt()
        );
    }
}
