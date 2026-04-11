package com.ttokbaro.api.dashboard;

import com.ttokbaro.api.candidate.Candidate;
import com.ttokbaro.api.candidate.CandidateIngestionService;
import com.ttokbaro.api.dashboard.dto.DashboardCandidateCardResponse;
import com.ttokbaro.api.dashboard.dto.DashboardCandidateDetailResponse;
import com.ttokbaro.api.dashboard.dto.DashboardElectionTypeResponse;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.Comparator;
import java.util.List;
import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilderFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

@Service
public class DashboardService {

    private final CandidateIngestionService candidateIngestionService;

    public DashboardService(CandidateIngestionService candidateIngestionService) {
        this.candidateIngestionService = candidateIngestionService;
    }

    @Transactional(readOnly = true)
    public List<DashboardElectionTypeResponse> getSeoulElectionTypes() {
        long mayorCandidateCount = candidateIngestionService.countSeoulCandidatesBySgTypecode(
                DashboardElectionType.MAYOR.getSgTypecode()
        );

        return List.of(
                toResponse(DashboardElectionType.MAYOR.getValue(), "서울특별시장", mayorCandidateCount),
                toResponse(DashboardElectionType.DISTRICT_HEAD.getValue(), "구청장", 0),
                toResponse(DashboardElectionType.CITY_COUNCIL.getValue(), "서울시의원", 0),
                toResponse(DashboardElectionType.DISTRICT_COUNCIL.getValue(), "구의원", 0)
        );
    }

    @Transactional(readOnly = true)
    public List<DashboardCandidateCardResponse> getDashboardCandidates(String region, String electionType) {
        DashboardRegion dashboardRegion = DashboardRegion.from(region);
        DashboardElectionType dashboardElectionType = DashboardElectionType.from(electionType);

        if (dashboardRegion != DashboardRegion.SEOUL || dashboardElectionType == null) {
            return List.of();
        }

        if (dashboardElectionType != DashboardElectionType.MAYOR) {
            return List.of();
        }

        return candidateIngestionService.getSeoulCandidatesBySgTypecode(dashboardElectionType.getSgTypecode())
                .stream()
                .map(candidate -> toCandidateCardResponse(candidate, dashboardElectionType, dashboardRegion))
                .sorted(candidateCardComparator())
                .toList();
    }

    @Transactional(readOnly = true)
    public DashboardCandidateDetailResponse getDashboardCandidate(Long id) {
        Candidate candidate = candidateIngestionService.getCandidateById(id);
        CandidateCardMetadata metadata = extractMetadata(candidate);
        DashboardElectionType electionType = resolveElectionType(candidate);
        DashboardRegion region = resolveRegion(candidate);

        return new DashboardCandidateDetailResponse(
                candidate.getId(),
                candidate.getName(),
                candidate.getPartyName(),
                metadata.number(),
                metadata.photoUrl(),
                electionType == null ? null : electionType.getValue(),
                region == null ? null : region.getValue(),
                resolveDistrictName(candidate, electionType),
                metadata.age(),
                metadata.gender(),
                metadata.job(),
                metadata.education(),
                metadata.career(),
                metadata.homepageUrl(),
                null,
                candidate.getUpdatedAt()
        );
    }

    private DashboardElectionTypeResponse toResponse(String electionType, String label, long candidateCount) {
        return new DashboardElectionTypeResponse(
                electionType,
                label,
                candidateCount,
                candidateCount > 0
        );
    }

    private DashboardCandidateCardResponse toCandidateCardResponse(
            Candidate candidate,
            DashboardElectionType electionType,
            DashboardRegion region
    ) {
        CandidateCardMetadata metadata = extractMetadata(candidate);
        return new DashboardCandidateCardResponse(
                candidate.getId(),
                candidate.getName(),
                candidate.getPartyName(),
                metadata.number(),
                metadata.photoUrl(),
                electionType.getValue(),
                region.getValue(),
                resolveDistrictName(candidate, electionType)
        );
    }

    private Comparator<DashboardCandidateCardResponse> candidateCardComparator() {
        return Comparator
                .comparing(DashboardService::parseSortableNumber, Comparator.nullsLast(Integer::compareTo))
                .thenComparing(DashboardCandidateCardResponse::name, Comparator.nullsLast(String::compareTo));
    }

    private String resolveDistrictName(Candidate candidate, DashboardElectionType electionType) {
        if (electionType == DashboardElectionType.MAYOR) {
            return null;
        }
        return StringUtils.hasText(candidate.getSggName()) ? candidate.getSggName() : null;
    }

    private CandidateCardMetadata extractMetadata(Candidate candidate) {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
            factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
            factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
            factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");

            NodeList items = factory.newDocumentBuilder()
                    .parse(new ByteArrayInputStream(candidate.getRawXml().getBytes(StandardCharsets.UTF_8)))
                    .getElementsByTagName("item");

            for (int i = 0; i < items.getLength(); i++) {
                Element item = (Element) items.item(i);
                if (matchesCandidate(item, candidate)) {
                    String number = trimToNull(firstNonBlank(
                            text(item, "giho"),
                            text(item, "gihoSangse"),
                            text(item, "num")
                    ));
                    String photoUrl = trimToNull(firstNonBlank(
                            text(item, "photoUrl"),
                            text(item, "photo"),
                            text(item, "imageUrl"),
                            text(item, "imgUrl")
                    ));
                    String career = joinNonBlank(
                            trimToNull(text(item, "career1")),
                            trimToNull(text(item, "career2"))
                    );
                    String homepageUrl = trimToNull(firstNonBlank(
                            text(item, "homepage"),
                            text(item, "homepageUrl"),
                            text(item, "hmpgAddr"),
                            text(item, "url")
                    ));
                    return new CandidateCardMetadata(
                            number,
                            photoUrl,
                            trimToNull(text(item, "age")),
                            trimToNull(text(item, "gender")),
                            trimToNull(text(item, "job")),
                            trimToNull(text(item, "edu")),
                            career,
                            homepageUrl
                    );
                }
            }
        } catch (Exception ignored) {
        }

        return CandidateCardMetadata.empty();
    }

    private boolean matchesCandidate(Element item, Candidate candidate) {
        return equalsTrimmed(text(item, "name"), candidate.getName())
                && equalsTrimmed(text(item, "jdName"), candidate.getPartyName())
                && equalsTrimmed(text(item, "sgId"), candidate.getSgId());
    }

    private boolean equalsTrimmed(String left, String right) {
        String leftValue = trimToNull(left);
        String rightValue = trimToNull(right);
        if (leftValue == null && rightValue == null) {
            return true;
        }
        if (leftValue == null || rightValue == null) {
            return false;
        }
        return leftValue.equals(rightValue);
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (StringUtils.hasText(value)) {
                return value;
            }
        }
        return null;
    }

    private String text(Element parent, String tagName) {
        NodeList nodeList = parent.getElementsByTagName(tagName);
        if (nodeList.getLength() == 0) {
            return "";
        }
        return nodeList.item(0).getTextContent();
    }

    private String joinNonBlank(String... values) {
        StringBuilder builder = new StringBuilder();
        for (String value : values) {
            if (!StringUtils.hasText(value)) {
                continue;
            }
            if (!builder.isEmpty()) {
                builder.append(" / ");
            }
            builder.append(value);
        }
        return builder.isEmpty() ? null : builder.toString();
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private static Integer parseSortableNumber(DashboardCandidateCardResponse response) {
        if (!StringUtils.hasText(response.number())) {
            return null;
        }
        String digitsOnly = response.number().replaceAll("[^0-9]", "");
        if (!StringUtils.hasText(digitsOnly)) {
            return null;
        }
        try {
            return Integer.valueOf(digitsOnly);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private DashboardElectionType resolveElectionType(Candidate candidate) {
        for (DashboardElectionType electionType : DashboardElectionType.values()) {
            if (electionType.getSgTypecode().equals(candidate.getSgTypecode())) {
                return electionType;
            }
        }
        return null;
    }

    private DashboardRegion resolveRegion(Candidate candidate) {
        if ("서울특별시".equals(candidate.getSdName())) {
            return DashboardRegion.SEOUL;
        }
        return null;
    }

    private record CandidateCardMetadata(
            String number,
            String photoUrl,
            String age,
            String gender,
            String job,
            String education,
            String career,
            String homepageUrl
    ) {
        private static CandidateCardMetadata empty() {
            return new CandidateCardMetadata(null, null, null, null, null, null, null, null);
        }
    }
}
