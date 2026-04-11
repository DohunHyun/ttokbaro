package com.ttokbaro.api.dashboard.dto;

import java.time.Instant;

public record DashboardCandidateDetailResponse(
        Long id,
        String name,
        String partyName,
        String number,
        String photoUrl,
        String electionType,
        String region,
        String districtName,
        String age,
        String gender,
        String job,
        String education,
        String career,
        String homepageUrl,
        Instant createdAt,
        Instant updatedAt
) {
}
