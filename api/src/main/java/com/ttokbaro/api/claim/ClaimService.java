package com.ttokbaro.api.claim;

import com.ttokbaro.api.claim.dto.CreateClaimRequest;
import com.ttokbaro.api.claim.dto.CreateClaimResponse;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClaimService {

    private static final int DEFAULT_LIMIT = 20;
    private static final int MAX_LIMIT = 100;

    private final ClaimRepository claimRepository;

    public ClaimService(ClaimRepository claimRepository) {
        this.claimRepository = claimRepository;
    }

    @Transactional
    public CreateClaimResponse createClaim(CreateClaimRequest request) {
        if (isBlank(request.sourceUrl()) && isBlank(request.text())) {
            throw new IllegalArgumentException("Either sourceUrl or text must be provided");
        }

        Claim claim = Claim.of(trimToNull(request.sourceUrl()), trimToNull(request.text()));
        Claim saved = claimRepository.save(claim);
        return CreateClaimResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<CreateClaimResponse> list(Integer limit) {
        int resolvedLimit = resolveLimit(limit);
        return claimRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, resolvedLimit))
                .stream()
                .map(CreateClaimResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CreateClaimResponse getById(Long id) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ClaimNotFoundException(id));
        return CreateClaimResponse.from(claim);
    }

    private int resolveLimit(Integer limit) {
        if (limit == null || limit <= 0) {
            return DEFAULT_LIMIT;
        }
        return Math.min(limit, MAX_LIMIT);
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
