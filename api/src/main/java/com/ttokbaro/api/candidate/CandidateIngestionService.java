package com.ttokbaro.api.candidate;

import com.ttokbaro.api.datago.DataGoKrClient;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilderFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

@Service
public class CandidateIngestionService {

    private static final String SEOUL = "서울특별시";
    private static final String CANDIDATE_SOURCE = "datago:poelpcddRegistSttus";

    private final DataGoKrClient dataGoKrClient;
    private final CandidateRepository candidateRepository;

    public CandidateIngestionService(DataGoKrClient dataGoKrClient, CandidateRepository candidateRepository) {
        this.dataGoKrClient = dataGoKrClient;
        this.candidateRepository = candidateRepository;
    }

    @Transactional
    public SyncSummary fetchAndUpsertSeoulCandidates(String sgId, Integer sgTypecode) {
        Map<String, String> queryParams = new LinkedHashMap<>();
        queryParams.put("sgId", sgId);
        queryParams.put("sgTypecode", String.valueOf(sgTypecode));
        queryParams.put("sdName", SEOUL);
        queryParams.put("numOfRows", "200");
        queryParams.put("pageNo", "1");

        String rawXml = dataGoKrClient.getRaw(
                "/9760000/PofelcddInfoInqireService/getPoelpcddRegistSttusInfoInqire",
                queryParams
        );

        List<ParsedCandidate> parsed = parseCandidateItems(rawXml);
        int inserted = 0;
        int updated = 0;
        Instant now = Instant.now();

        for (ParsedCandidate candidate : parsed) {
            Optional<Candidate> existing = candidateRepository.findBySgIdAndSgTypecodeAndSdNameAndNameAndPartyName(
                    candidate.sgId(),
                    candidate.sgTypecode(),
                    candidate.sdName(),
                    candidate.name(),
                    candidate.partyName()
            );

            if (existing.isPresent()) {
                Candidate current = existing.get();
                current.updateFrom(candidate.sggName(), candidate.partyName(), rawXml, CANDIDATE_SOURCE, now);
                updated++;
            } else {
                Candidate created = new Candidate(
                        candidate.sgId(),
                        candidate.sgTypecode(),
                        candidate.sdName(),
                        candidate.sggName(),
                        candidate.name(),
                        candidate.partyName(),
                        rawXml,
                        CANDIDATE_SOURCE,
                        now
                );
                candidateRepository.save(created);
                inserted++;
            }
        }

        return new SyncSummary(inserted, updated, parsed.size());
    }

    @Transactional(readOnly = true)
    public List<Candidate> getSeoulMayorCandidates() {
        return candidateRepository.findBySdNameAndSgTypecodeOrderByUpdatedAtDescNameAsc(SEOUL, 3);
    }

    @Transactional(readOnly = true)
    public List<Candidate> getSeoulCandidatesBySgTypecode(Integer sgTypecode) {
        return candidateRepository.findBySdNameAndSgTypecodeOrderByUpdatedAtDescNameAsc(SEOUL, sgTypecode);
    }

    @Transactional(readOnly = true)
    public long countSeoulCandidatesBySgTypecode(Integer sgTypecode) {
        return candidateRepository.countBySdNameAndSgTypecode(SEOUL, sgTypecode);
    }

    @Transactional(readOnly = true)
    public Candidate getCandidateById(Long id) {
        return candidateRepository.findById(id)
                .orElseThrow(() -> new CandidateNotFoundException(id));
    }

    private List<ParsedCandidate> parseCandidateItems(String rawXml) {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
            factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
            factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
            factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");

            Document document = factory.newDocumentBuilder()
                    .parse(new ByteArrayInputStream(rawXml.getBytes(StandardCharsets.UTF_8)));

            NodeList items = document.getElementsByTagName("item");
            List<ParsedCandidate> parsed = new ArrayList<>();

            for (int i = 0; i < items.getLength(); i++) {
                Element item = (Element) items.item(i);

                String name = text(item, "name");
                if (!StringUtils.hasText(name)) {
                    continue;
                }

                String sgId = text(item, "sgId");
                Integer sgTypecode = parseInteger(text(item, "sgTypecode"));
                if (!StringUtils.hasText(sgId) || sgTypecode == null) {
                    continue;
                }

                String sdName = text(item, "sdName");
                if (!StringUtils.hasText(sdName)) {
                    sdName = SEOUL;
                }

                parsed.add(new ParsedCandidate(
                        sgId,
                        sgTypecode,
                        sdName,
                        trimToNull(text(item, "sggName")),
                        name,
                        trimToNull(text(item, "jdName"))
                ));
            }
            return parsed;
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to parse candidate XML", e);
        }
    }

    private String text(Element parent, String tagName) {
        NodeList nodeList = parent.getElementsByTagName(tagName);
        if (nodeList.getLength() == 0) {
            return "";
        }
        return nodeList.item(0).getTextContent();
    }

    private Integer parseInteger(String value) {
        try {
            return Integer.valueOf(value);
        } catch (Exception e) {
            return null;
        }
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private record ParsedCandidate(
            String sgId,
            Integer sgTypecode,
            String sdName,
            String sggName,
            String name,
            String partyName
    ) {
    }

    public record SyncSummary(int inserted, int updated, int total) {
    }
}
