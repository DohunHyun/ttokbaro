package com.ttokbaro.api.datago;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UriUtils;

@Component
public class DataGoKrClient {

    private final RestClient restClient;
    private final DataGoKrProperties properties;

    public DataGoKrClient(DataGoKrProperties properties) {
        this.restClient = RestClient.create();
        this.properties = properties;
    }

    public String getRaw(String endpointPath, Map<String, String> queryParams) {
        if (!StringUtils.hasText(properties.getServiceKey())) {
            throw new IllegalArgumentException("app.datago.service-key must be configured for local profile");
        }

        URI uri = buildUri(endpointPath, queryParams);
        String response = restClient.get()
                .uri(uri)
                .retrieve()
                .body(String.class);
        return response == null ? "" : response;
    }

    private URI buildUri(String endpointPath, Map<String, String> queryParams) {
        String serviceKey = properties.getServiceKey();
        String encodedServiceKey = serviceKey.contains("%")
                ? serviceKey
                : UriUtils.encodeQueryParam(serviceKey, StandardCharsets.UTF_8);

        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(properties.getBaseUrl())
                .path(endpointPath)
                .queryParam("ServiceKey", encodedServiceKey);

        for (Map.Entry<String, String> entry : queryParams.entrySet()) {
            builder.queryParam(
                    entry.getKey(),
                    UriUtils.encodeQueryParam(entry.getValue(), StandardCharsets.UTF_8)
            );
        }

        return builder.build(true).toUri();
    }
}
