package com.ttokbaro.api.evidence;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/evidences")
public class EvidenceDeleteController {

    private final EvidenceService evidenceService;

    public EvidenceDeleteController(EvidenceService evidenceService) {
        this.evidenceService = evidenceService;
    }

    @DeleteMapping("/{evidenceId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEvidence(@PathVariable Long evidenceId) {
        evidenceService.deleteEvidence(evidenceId);
    }
}
