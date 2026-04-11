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
class DashboardCandidatesHttpIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private CandidateRepository candidateRepository;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Test
    void getDashboardCandidates_returnsSeoulMayorCandidateCardsSortedByNumber() throws Exception {
        candidateRepository.deleteAll();

        String rawXml = """
                <?xml version="1.0" encoding="UTF-8"?>
                <response>
                  <body>
                    <items>
                      <item>
                        <num>2</num>
                        <sgId>20260603</sgId>
                        <sgTypecode>3</sgTypecode>
                        <sggName>서울특별시</sggName>
                        <sdName>서울특별시</sdName>
                        <jdName>정당B</jdName>
                        <name>후보B</name>
                      </item>
                      <item>
                        <num>1</num>
                        <sgId>20260603</sgId>
                        <sgTypecode>3</sgTypecode>
                        <sggName>서울특별시</sggName>
                        <sdName>서울특별시</sdName>
                        <jdName>정당A</jdName>
                        <name>후보A</name>
                      </item>
                    </items>
                  </body>
                </response>
                """;

        candidateRepository.save(new Candidate(
                "20260603",
                3,
                "서울특별시",
                "서울특별시",
                "후보B",
                "정당B",
                rawXml,
                "test",
                Instant.now()
        ));
        candidateRepository.save(new Candidate(
                "20260603",
                3,
                "서울특별시",
                "서울특별시",
                "후보A",
                "정당A",
                rawXml,
                "test",
                Instant.now()
        ));

        HttpResponse<String> response = get("/dashboard/candidates?region=seoul&electionType=MAYOR");

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.body()).contains("\"name\":\"후보A\"");
        assertThat(response.body()).contains("\"partyName\":\"정당A\"");
        assertThat(response.body()).contains("\"number\":\"1\"");
        assertThat(response.body()).contains("\"photoUrl\":null");
        assertThat(response.body()).contains("\"electionType\":\"MAYOR\"");
        assertThat(response.body()).contains("\"region\":\"seoul\"");
        assertThat(response.body()).contains("\"districtName\":null");
        assertThat(response.body().indexOf("\"name\":\"후보A\""))
                .isLessThan(response.body().indexOf("\"name\":\"후보B\""));
    }

    @Test
    void getDashboardCandidates_returnsEmptyArrayForUnsupportedElectionType() throws Exception {
        candidateRepository.deleteAll();

        HttpResponse<String> response = get("/dashboard/candidates?region=seoul&electionType=DISTRICT_HEAD");

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.body()).isEqualTo("[]");
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
