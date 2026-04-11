package com.ttokbaro.api.dashboard;

import com.ttokbaro.api.dashboard.dto.DashboardCandidateCardResponse;
import com.ttokbaro.api.dashboard.dto.DashboardCandidateDetailResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardCandidateController {

    private final DashboardService dashboardService;

    public DashboardCandidateController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/candidates")
    public List<DashboardCandidateCardResponse> getDashboardCandidates(
            @RequestParam String region,
            @RequestParam String electionType
    ) {
        return dashboardService.getDashboardCandidates(region, electionType);
    }

    @GetMapping("/candidates/{id}")
    public DashboardCandidateDetailResponse getDashboardCandidate(@PathVariable Long id) {
        return dashboardService.getDashboardCandidate(id);
    }
}
