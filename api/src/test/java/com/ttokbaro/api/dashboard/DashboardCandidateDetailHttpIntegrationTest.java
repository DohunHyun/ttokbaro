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
class DashboardCandidateDetailHttpIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private CandidateRepository candidateRepository;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Test
    void getDashboardCandidate_returnsCandidateDetail() throws Exception {
        candidateRepository.deleteAll();

        Candidate saved = candidateRepository.save(new Candidate(
                "20260603",
                3,
                "서울특별시",
                "서울특별시",
                "김형남",
                "더불어민주당",
                """
                <?xml version="1.0" encoding="UTF-8"?>
                <response>
                  <body>
                    <items>
                      <item>
                        <num>1</num>
                        <sgId>20260603</sgId>
                        <sgTypecode>3</sgTypecode>
                        <sggName>서울특별시</sggName>
                        <sdName>서울특별시</sdName>
                        <jdName>더불어민주당</jdName>
                        <name>김형남</name>
                        <age>36</age>
                        <gender>남</gender>
                        <job>인권운동가</job>
                        <edu>대학원 졸업</edu>
                        <career1>경력1</career1>
                        <career2>경력2</career2>
                      </item>
                    </items>
                  </body>
                </response>
                """,
                "test",
                Instant.parse("2026-04-11T00:00:00Z")
        ));

        HttpResponse<String> response = get("/dashboard/candidates/" + saved.getId());

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.body()).contains("\"id\":" + saved.getId());
        assertThat(response.body()).contains("\"name\":\"김형남\"");
        assertThat(response.body()).contains("\"partyName\":\"더불어민주당\"");
        assertThat(response.body()).contains("\"number\":\"1\"");
        assertThat(response.body()).contains("\"photoUrl\":null");
        assertThat(response.body()).contains("\"electionType\":\"MAYOR\"");
        assertThat(response.body()).contains("\"region\":\"seoul\"");
        assertThat(response.body()).contains("\"districtName\":null");
        assertThat(response.body()).contains("\"age\":\"36\"");
        assertThat(response.body()).contains("\"gender\":\"남\"");
        assertThat(response.body()).contains("\"job\":\"인권운동가\"");
        assertThat(response.body()).contains("\"education\":\"대학원 졸업\"");
        assertThat(response.body()).contains("\"career\":\"경력1 / 경력2\"");
        assertThat(response.body()).contains("\"homepageUrl\":null");
        assertThat(response.body()).contains("\"createdAt\":null");
        assertThat(response.body()).contains("\"updatedAt\":\"2026-04-11T00:00:00Z\"");
    }

    @Test
    void getDashboardCandidate_returns404WhenCandidateDoesNotExist() throws Exception {
        candidateRepository.deleteAll();

        HttpResponse<String> response = get("/dashboard/candidates/999999");

        assertThat(response.statusCode()).isEqualTo(404);
        assertThat(response.body()).contains("\"message\":\"Candidate not found\"");
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
