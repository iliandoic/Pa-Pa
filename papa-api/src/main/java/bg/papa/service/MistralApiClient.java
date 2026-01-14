package bg.papa.service;

import bg.papa.config.MistralConfig;
import bg.papa.dto.mistral.MistralAuthResponse;
import bg.papa.dto.mistral.MistralProductDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MistralApiClient {

    private final MistralConfig mistralConfig;
    private final RestTemplate restTemplate;

    private String accessToken;
    private Instant tokenExpiry;

    /**
     * Authenticates with Mistral API and returns access token
     */
    public String authenticate() {
        // Return cached token if still valid
        if (accessToken != null && tokenExpiry != null && Instant.now().isBefore(tokenExpiry)) {
            return accessToken;
        }

        String tokenUrl = mistralConfig.getBaseUrl() + "/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("Username", mistralConfig.getUsername());
        body.add("Password", mistralConfig.getPassword());
        body.add("grant_type", "password");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<MistralAuthResponse> response = restTemplate.postForEntity(
                    tokenUrl,
                    request,
                    MistralAuthResponse.class
            );

            if (response.getBody() != null) {
                accessToken = response.getBody().getAccessToken();
                // Set expiry to 90% of actual expiry to be safe
                long expiresInSeconds = response.getBody().getExpiresIn();
                tokenExpiry = Instant.now().plusSeconds((long) (expiresInSeconds * 0.9));
                log.info("Successfully authenticated with Mistral API");
                return accessToken;
            }
        } catch (Exception e) {
            log.error("Failed to authenticate with Mistral API: {}", e.getMessage());
            throw new RuntimeException("Mistral authentication failed", e);
        }

        throw new RuntimeException("Mistral authentication returned empty response");
    }

    /**
     * Fetches products from Mistral API by search term
     */
    public List<MistralProductDto> fetchProducts(String search) {
        String token = authenticate();

        String url = UriComponentsBuilder.fromHttpUrl(mistralConfig.getBaseUrl() + "/api/GetAllData")
                .queryParam("locationid", mistralConfig.getLocationId())
                .queryParam("priceid", mistralConfig.getPriceId())
                .queryParam("search", search != null ? search : "")
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<Void> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<List<MistralProductDto>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    request,
                    new ParameterizedTypeReference<List<MistralProductDto>>() {}
            );

            List<MistralProductDto> products = response.getBody();
            log.info("Fetched {} products from Mistral for search: '{}'",
                    products != null ? products.size() : 0, search);
            return products != null ? products : Collections.emptyList();

        } catch (Exception e) {
            log.error("Failed to fetch products from Mistral: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch products from Mistral", e);
        }
    }

    /**
     * Fetches a single product by code
     */
    public MistralProductDto fetchProductByCode(String code) {
        List<MistralProductDto> products = fetchProducts(code);
        return products.stream()
                .filter(p -> code.equals(p.getCode()))
                .findFirst()
                .orElse(null);
    }

    /**
     * Fetches products by iterating through a range of codes (parallel)
     */
    public List<MistralProductDto> fetchProductsByCodeRange(int startCode, int endCode) {
        List<MistralProductDto> allProducts = java.util.Collections.synchronizedList(new java.util.ArrayList<>());

        // Use parallel streams with limited concurrency
        java.util.concurrent.ExecutorService executor = java.util.concurrent.Executors.newFixedThreadPool(10);
        java.util.List<java.util.concurrent.Future<?>> futures = new java.util.ArrayList<>();

        for (int code = startCode; code <= endCode; code++) {
            final int currentCode = code;
            futures.add(executor.submit(() -> {
                try {
                    List<MistralProductDto> products = fetchProducts(String.valueOf(currentCode));
                    if (!products.isEmpty()) {
                        allProducts.addAll(products);
                        log.debug("Found {} products for code {}", products.size(), currentCode);
                    }
                } catch (Exception e) {
                    log.warn("Error fetching code {}: {}", currentCode, e.getMessage());
                }
            }));
        }

        // Wait for all to complete
        for (java.util.concurrent.Future<?> future : futures) {
            try {
                future.get();
            } catch (Exception e) {
                log.warn("Task failed: {}", e.getMessage());
            }
        }
        executor.shutdown();

        log.info("Fetched total of {} products from code range {}-{}",
                allProducts.size(), startCode, endCode);
        return allProducts;
    }
}
