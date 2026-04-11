package com.ttokbaro.api.dashboard;

import com.ttokbaro.api.dashboard.dto.DashboardElectionTypeResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard/regions/seoul")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/elections")
    public List<DashboardElectionTypeResponse> getSeoulElectionTypes() {
        return dashboardService.getSeoulElectionTypes();
    }
}
