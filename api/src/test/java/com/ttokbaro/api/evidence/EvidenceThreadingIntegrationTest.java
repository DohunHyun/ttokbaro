package com.ttokbaro.api.evidence;

import com.ttokbaro.api.claim.ClaimService;
import com.ttokbaro.api.claim.dto.CreateClaimRequest;
import com.ttokbaro.api.claim.dto.CreateClaimResponse;
import com.ttokbaro.api.evidence.dto.EvidenceResponse;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
class EvidenceThreadingIntegrationTest {

    @Autowired
    private ClaimService claimService;

    @Autowired
    private EvidenceService evidenceService;

    @Test
    void createReplyEvidence_persistsParentAndReturnsParentEvidenceIdInList() {
        Long claimId = createClaim("thread claim");
        EvidenceResponse parent = evidenceService.createEvidence(claimId, null, null, "parent evidence");
        EvidenceResponse reply = evidenceService.createEvidence(claimId, parent.id(), null, "reply evidence");

        List<EvidenceResponse> evidences = evidenceService.listEvidences(claimId);

        EvidenceResponse listedParent = findById(evidences, parent.id());
        EvidenceResponse listedReply = findById(evidences, reply.id());

        assertThat(listedParent).isNotNull();
        assertThat(listedParent.parentEvidenceId()).isNull();

        assertThat(listedReply).isNotNull();
        assertThat(listedReply.parentEvidenceId()).isEqualTo(parent.id());
    }

    @Test
    void createReplyEvidence_withUnknownParent_throwsEvidenceNotFound() {
        Long claimId = createClaim("missing parent claim");

        assertThatThrownBy(() -> evidenceService.createEvidence(claimId, 999999L, null, "reply"))
                .isInstanceOf(EvidenceNotFoundException.class)
                .hasMessage("Evidence not found");
    }

    @Test
    void createReplyEvidence_withParentFromDifferentClaim_throwsIllegalArgumentException() {
        Long parentClaimId = createClaim("claim A");
        Long otherClaimId = createClaim("claim B");
        EvidenceResponse parent = evidenceService.createEvidence(parentClaimId, null, null, "parent");

        assertThatThrownBy(() -> evidenceService.createEvidence(otherClaimId, parent.id(), null, "invalid"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Parent evidence must belong to same claim");
    }

    private Long createClaim(String text) {
        CreateClaimResponse claim = claimService.createClaim(new CreateClaimRequest(null, text));
        return claim.id();
    }

    private EvidenceResponse findById(List<EvidenceResponse> evidences, Long id) {
        return evidences.stream()
                .filter(evidence -> evidence.id().equals(id))
                .findFirst()
                .orElse(null);
    }
}
