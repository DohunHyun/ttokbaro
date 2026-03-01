package com.ttokbaro.api.candidate;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    Optional<Candidate> findBySgIdAndSgTypecodeAndSdNameAndNameAndPartyName(
            String sgId,
            Integer sgTypecode,
            String sdName,
            String name,
            String partyName
    );

    List<Candidate> findBySdNameAndSgTypecodeOrderByUpdatedAtDescNameAsc(String sdName, Integer sgTypecode);
}
