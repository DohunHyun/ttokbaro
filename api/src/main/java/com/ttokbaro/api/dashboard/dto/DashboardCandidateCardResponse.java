package com.ttokbaro.api.dashboard.dto;

public record DashboardCandidateCardResponse(
        Long id,
        String name,
        String partyName,
        String number,
        String photoUrl,
        String electionType,
        String region,
        String districtName
) {
}
