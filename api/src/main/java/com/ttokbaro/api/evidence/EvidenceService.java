package com.ttokbaro.api.evidence;

import com.ttokbaro.api.claim.Claim;
import com.ttokbaro.api.claim.ClaimNotFoundException;
import com.ttokbaro.api.claim.ClaimRepository;
import com.ttokbaro.api.evidence.dto.EvidenceResponse;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EvidenceService {

    private final EvidenceRepository evidenceRepository;
    private final ClaimRepository claimRepository;

    public EvidenceService(EvidenceRepository evidenceRepository, ClaimRepository claimRepository) {
        this.evidenceRepository = evidenceRepository;
        this.claimRepository = claimRepository;
    }

    @Transactional
    public EvidenceResponse createEvidence(Long claimId, String url, String note) {
        String normalizedUrl = trimToNull(url);
        String normalizedNote = trimToNull(note);
        if (normalizedUrl == null && normalizedNote == null) {
            throw new IllegalArgumentException("Either url or note must be provided");
        }

        Claim claim = getClaimOrThrow(claimId);
        Evidence saved = evidenceRepository.save(Evidence.of(claim, normalizedUrl, normalizedNote));
        return EvidenceResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<EvidenceResponse> listEvidences(Long claimId) {
        getClaimOrThrow(claimId);
        return evidenceRepository.findByClaimIdOrderByCreatedAtDesc(claimId)
                .stream()
                .map(EvidenceResponse::from)
                .toList();
    }

    @Transactional
    public void deleteEvidence(Long evidenceId) {
        Evidence evidence = evidenceRepository.findById(evidenceId)
                .orElseThrow(() -> new EvidenceNotFoundException(evidenceId));
        evidenceRepository.delete(evidence);
    }

    private Claim getClaimOrThrow(Long claimId) {
        return claimRepository.findById(claimId)
                .orElseThrow(() -> new ClaimNotFoundException(claimId));
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
