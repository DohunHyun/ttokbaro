package com.ttokbaro.api.evidence.dto;

public record CreateEvidenceRequest(
        Long parentEvidenceId,
        String url,
        String note
) {
}
