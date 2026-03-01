package com.ttokbaro.api.evidence;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class EvidenceHttpIntegrationTest {

    private static final Pattern ID_PATTERN = Pattern.compile("\"id\"\\s*:\\s*(\\d+)");

    @LocalServerPort
    private int port;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Test
    void postAndGetEvidences_persistsAndReturnsParentEvidenceId() throws Exception {
        Long claimId = createClaim("http threading claim");
        Long parentId = createEvidence(claimId, """
                {
                  "note": "parent evidence"
                }
                """);
        Long replyId = createEvidence(claimId, """
                {
                  "parentEvidenceId": %d,
                  "note": "child evidence"
                }
                """.formatted(parentId));

        HttpResponse<String> listResponse = get("/claims/" + claimId + "/evidences");
        assertThat(listResponse.statusCode()).isEqualTo(200);
        assertThat(listResponse.body()).contains("\"id\":" + replyId);
        assertThat(listResponse.body()).contains("\"parentEvidenceId\":" + parentId);
    }

    private Long createClaim(String text) throws Exception {
        HttpResponse<String> response = post(
                "/claims",
                """
                {
                  "text": %s
                }
                """.formatted(quoted(text))
        );
        assertThat(response.statusCode()).isEqualTo(201);
        return extractId(response.body());
    }

    private Long createEvidence(Long claimId, String payload) throws Exception {
        HttpResponse<String> response = post("/claims/" + claimId + "/evidences", payload);
        assertThat(response.statusCode()).isEqualTo(201);
        return extractId(response.body());
    }

    private HttpResponse<String> post(String path, String body) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder(URI.create(baseUrl() + path))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
        return httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    }

    private HttpResponse<String> get(String path) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder(URI.create(baseUrl() + path))
                .header("Content-Type", "application/json")
                .GET()
                .build();
        return httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    }

    private String baseUrl() {
        return "http://localhost:" + port;
    }

    private String quoted(String value) {
        return "\"" + value.replace("\"", "\\\"") + "\"";
    }

    private Long extractId(String json) {
        Matcher matcher = ID_PATTERN.matcher(json);
        assertThat(matcher.find()).isTrue();
        return Long.parseLong(matcher.group(1));
    }
}
