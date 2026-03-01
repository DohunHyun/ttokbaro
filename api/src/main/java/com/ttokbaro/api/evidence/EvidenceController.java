package com.ttokbaro.api.evidence;

import com.ttokbaro.api.evidence.dto.CreateEvidenceRequest;
import com.ttokbaro.api.evidence.dto.EvidenceResponse;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/claims/{claimId}/evidences")
public class EvidenceController {

    private final EvidenceService evidenceService;

    public EvidenceController(EvidenceService evidenceService) {
        this.evidenceService = evidenceService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EvidenceResponse createEvidence(
            @PathVariable Long claimId,
            @RequestBody CreateEvidenceRequest request
    ) {
        return evidenceService.createEvidence(claimId, request.parentEvidenceId(), request.url(), request.note());
    }

    @GetMapping
    public List<EvidenceResponse> listEvidences(@PathVariable Long claimId) {
        return evidenceService.listEvidences(claimId);
    }
}
