package com.ttokbaro.api.dashboard.dto;

public record DashboardElectionTypeResponse(
        String electionType,
        String label,
        long candidateCount,
        boolean available
) {
}
