package com.ttokbaro.api.candidate;

import com.ttokbaro.api.candidate.dto.CandidateResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/candidates/seoul")
public class CandidateController {

    private final CandidateIngestionService candidateIngestionService;

    public CandidateController(CandidateIngestionService candidateIngestionService) {
        this.candidateIngestionService = candidateIngestionService;
    }

    @GetMapping("/mayor")
    public List<CandidateResponse> getSeoulMayorCandidates() {
        return candidateIngestionService.getSeoulMayorCandidates()
                .stream()
                .map(CandidateResponse::from)
                .toList();
    }
}
