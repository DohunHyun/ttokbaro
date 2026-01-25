package com.ttokbaro.api.claim.dto;

import jakarta.validation.constraints.Size;

public record CreateClaimRequest(
        @Size(max = 2048, message = "sourceUrl must be 2048 characters or fewer")
        String sourceUrl,

        @Size(max = 10000, message = "text must be 10000 characters or fewer")
        String text
) {
}
