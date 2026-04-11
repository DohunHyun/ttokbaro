package com.ttokbaro.api.dashboard;

import com.ttokbaro.api.candidate.Candidate;
import com.ttokbaro.api.candidate.CandidateRepository;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class DashboardHttpIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private CandidateRepository candidateRepository;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Test
    void getSeoulElectionTypes_returnsMayorAvailabilityFromLoadedCandidateData() throws Exception {
        candidateRepository.deleteAll();

        candidateRepository.save(new Candidate(
                "20260603",
                3,
                "서울특별시",
                null,
                "후보A",
                "정당A",
                "<xml />",
                "test",
                Instant.now()
        ));
        candidateRepository.save(new Candidate(
                "20260603",
                3,
                "서울특별시",
                null,
                "후보B",
                "정당B",
                "<xml />",
                "test",
                Instant.now()
        ));
        candidateRepository.save(new Candidate(
                "20260603",
                4,
                "서울특별시",
                "종로구",
                "다른선거후보",
                "정당C",
                "<xml />",
                "test",
                Instant.now()
        ));

        HttpResponse<String> response = get("/dashboard/regions/seoul/elections");

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.body()).contains("\"electionType\":\"MAYOR\"");
        assertThat(response.body()).contains("\"label\":\"서울특별시장\"");
        assertThat(response.body()).contains("\"candidateCount\":2");
        assertThat(response.body()).contains("\"available\":true");
        assertThat(response.body()).contains("\"electionType\":\"DISTRICT_HEAD\"");
        assertThat(response.body()).contains("\"candidateCount\":0");
        assertThat(response.body()).contains("\"available\":false");
    }

    private HttpResponse<String> get(String path) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create(baseUrl() + path))
                .header("Content-Type", "application/json")
                .GET()
                .build();
        return httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    }

    private String baseUrl() {
        return "http://localhost:" + port;
    }
}
