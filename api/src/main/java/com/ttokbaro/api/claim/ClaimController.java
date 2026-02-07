package com.ttokbaro.api.claim;

import com.ttokbaro.api.claim.dto.CreateClaimRequest;
import com.ttokbaro.api.claim.dto.CreateClaimResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreateClaimResponse createClaim(@Valid @RequestBody CreateClaimRequest request) {
        return claimService.createClaim(request);
    }

    @GetMapping
    public List<CreateClaimResponse> listClaims(@RequestParam(name = "limit", required = false) Integer limit) {
        return claimService.list(limit);
    }

    @GetMapping("/{id}")
    public CreateClaimResponse getClaim(@PathVariable Long id) {
        return claimService.getById(id);
    }
}
