package bg.papa.service.enrichment;

import bg.papa.entity.Product;
import bg.papa.entity.ProductStatus;
import bg.papa.repository.ProductRepository;
import bg.papa.service.ImageUploadService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnrichmentService {

    private final ProductRepository productRepository;
    private final ImageUploadService imageUploadService;
    private final ObjectMapper objectMapper;

    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    /**
     * Enrich a single product by searching Bulgarian e-commerce sites
     */
    @Transactional
    public EnrichmentResult enrichProduct(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        return enrichProduct(product);
    }

    /**
     * Enrich a product using its supplier title and/or barcode
     */
    @Transactional
    public EnrichmentResult enrichProduct(Product product) {
        log.info("Enriching product: {} ({})", product.getSupplierSku(), product.getSupplierTitle());

        EnrichmentResult result = new EnrichmentResult();
        result.setProductId(product.getId());
        result.setSupplierSku(product.getSupplierSku());

        try {
            // Try to find product info from various sources
            ScrapedProductData bestMatch = null;
            double bestScore = 0;

            // 1. Try searching by barcode first (most accurate)
            if (product.getBarcodes() != null && !product.getBarcodes().isEmpty()) {
                List<String> barcodes = parseBarcodes(product.getBarcodes());
                for (String barcode : barcodes) {
                    ScrapedProductData data = searchByBarcode(barcode);
                    if (data != null && data.getMatchScore() > bestScore) {
                        bestMatch = data;
                        bestScore = data.getMatchScore();
                    }
                    if (bestScore >= 0.95) break; // Good enough match
                }
            }

            // 2. If no good barcode match, search by product name
            String searchName = product.getSupplierTitle() != null ? product.getSupplierTitle() : product.getTitle();
            if (bestScore < 0.8 && searchName != null && !searchName.isEmpty()) {
                ScrapedProductData data = searchByName(searchName);
                if (data != null && data.getMatchScore() > bestScore) {
                    bestMatch = data;
                    bestScore = data.getMatchScore();
                }
            }

            if (bestMatch != null && bestScore >= 0.1) {
                // Apply enrichment data
                applyEnrichmentData(product, bestMatch);

                result.setSuccess(true);
                result.setMatchScore(bestScore);
                result.setSource(bestMatch.getSource());
                result.setEnrichedTitle(bestMatch.getTitle());
                result.setMessage("Product enriched successfully from " + bestMatch.getSource());

                productRepository.save(product);
            } else {
                result.setSuccess(false);
                result.setMessage("No suitable match found");
            }

        } catch (Exception e) {
            log.error("Error enriching product {}: {}", product.getSupplierSku(), e.getMessage());
            result.setSuccess(false);
            result.setMessage("Error: " + e.getMessage());
        }

        return result;
    }

    /**
     * Search for product by barcode on Bulgarian e-commerce sites
     * Barcode matches are high confidence (0.95) since barcodes are unique identifiers
     */
    private ScrapedProductData searchByBarcode(String barcode) {
        log.debug("Searching by barcode: {}", barcode);

        // Try eMag.bg
        ScrapedProductData result = searchEmagByBarcode(barcode);
        if (result != null && result.getTitle() != null) {
            result.setMatchScore(0.95); // Barcode match = high confidence
            return result;
        }

        // Try Gladen.bg
        result = searchGladenByBarcode(barcode);
        if (result != null && result.getTitle() != null) {
            result.setMatchScore(0.95); // Barcode match = high confidence
            return result;
        }

        return null;
    }

    /**
     * Search for product by name on Bulgarian e-commerce sites
     */
    private ScrapedProductData searchByName(String productName) {
        log.debug("Searching by name: {}", productName);

        // Clean up the product name for better search
        String searchQuery = cleanSearchQuery(productName);

        // Try eMag.bg
        ScrapedProductData result = searchEmagByName(searchQuery);
        if (result != null && result.getMatchScore() >= 0.7) return result;

        // Try Gladen.bg
        ScrapedProductData gladenResult = searchGladenByName(searchQuery);
        if (gladenResult != null) {
            if (result == null || gladenResult.getMatchScore() > result.getMatchScore()) {
                result = gladenResult;
            }
        }

        return result;
    }

    /**
     * Search eMag.bg by barcode
     */
    private ScrapedProductData searchEmagByBarcode(String barcode) {
        try {
            String url = "https://www.emag.bg/search/" + URLEncoder.encode(barcode, StandardCharsets.UTF_8);
            Document doc = Jsoup.connect(url)
                    .userAgent(USER_AGENT)
                    .timeout(10000)
                    .get();

            // Check if we got a direct product page or search results
            Element productCard = doc.selectFirst(".card-v2-wrapper");
            if (productCard != null) {
                return scrapeEmagProduct(productCard, barcode);
            }

        } catch (IOException e) {
            log.debug("eMag search failed for barcode {}: {}", barcode, e.getMessage());
        }
        return null;
    }

    /**
     * Search eMag.bg by product name
     */
    private ScrapedProductData searchEmagByName(String query) {
        try {
            String url = "https://www.emag.bg/search/" + URLEncoder.encode(query, StandardCharsets.UTF_8);
            log.debug("Searching eMag: {}", url);
            Document doc = Jsoup.connect(url)
                    .userAgent(USER_AGENT)
                    .timeout(10000)
                    .get();

            Element productCard = doc.selectFirst(".card-v2-wrapper");
            if (productCard != null) {
                ScrapedProductData result = scrapeEmagProduct(productCard, query);
                log.info("eMag found: '{}' with score {}", result.getTitle(), result.getMatchScore());
                return result;
            } else {
                log.debug("eMag: No product card found for query: {}", query);
            }

        } catch (IOException e) {
            log.debug("eMag search failed for query {}: {}", query, e.getMessage());
        }
        return null;
    }

    /**
     * Scrape product data from eMag product card
     */
    private ScrapedProductData scrapeEmagProduct(Element card, String searchTerm) {
        ScrapedProductData data = new ScrapedProductData();
        data.setSource("emag.bg");

        // Get product link and title
        Element titleLink = card.selectFirst("a.card-v2-title");
        if (titleLink != null) {
            data.setTitle(titleLink.text().trim());
            String href = titleLink.attr("href");
            if (href.startsWith("http")) {
                data.setSourceUrl(href);
            } else {
                data.setSourceUrl("https://www.emag.bg" + href);
            }
        }

        // Get image
        Element img = card.selectFirst(".card-v2-thumb img");
        if (img != null) {
            String imgSrc = img.attr("src");
            if (imgSrc.isEmpty()) imgSrc = img.attr("data-src");
            data.setImageUrl(imgSrc);
        }

        // Calculate match score based on title similarity
        if (data.getTitle() != null) {
            data.setMatchScore(calculateSimilarity(searchTerm, data.getTitle()));
        }

        // Try to get more details from the product page
        if (data.getSourceUrl() != null) {
            try {
                enrichFromEmagProductPage(data);
            } catch (Exception e) {
                log.debug("Could not fetch eMag product page: {}", e.getMessage());
            }
        }

        return data;
    }

    /**
     * Fetch additional details from eMag product page
     */
    private void enrichFromEmagProductPage(ScrapedProductData data) throws IOException {
        Document doc = Jsoup.connect(data.getSourceUrl())
                .userAgent(USER_AGENT)
                .timeout(10000)
                .get();

        // Get description
        Element descEl = doc.selectFirst(".product-page-description-text");
        if (descEl != null) {
            data.setDescription(descEl.text().trim());
        }

        // Get brand
        Element brandEl = doc.selectFirst("[class*=brand] a");
        if (brandEl != null) {
            data.setBrand(brandEl.text().trim());
        }

        // Get all images
        Elements imgEls = doc.select(".product-gallery img");
        List<String> images = new ArrayList<>();
        for (Element img : imgEls) {
            String src = img.attr("src");
            if (src.isEmpty()) src = img.attr("data-src");
            if (!src.isEmpty() && !images.contains(src)) {
                images.add(src);
            }
        }
        if (!images.isEmpty()) {
            data.setImageUrls(images);
        }

        // Get specifications for baby products
        Elements specRows = doc.select(".specifications-table tr");
        for (Element row : specRows) {
            String label = row.selectFirst("td:first-child") != null ?
                    row.selectFirst("td:first-child").text().toLowerCase() : "";
            String value = row.selectFirst("td:last-child") != null ?
                    row.selectFirst("td:last-child").text() : "";

            if (label.contains("възраст") || label.contains("age")) {
                data.setAgeRange(value);
            } else if (label.contains("съставки") || label.contains("ingredient")) {
                data.setIngredients(value);
            }
        }
    }

    /**
     * Search Gladen.bg by barcode
     */
    private ScrapedProductData searchGladenByBarcode(String barcode) {
        try {
            String url = "https://shop.gladen.bg/search?q=" + URLEncoder.encode(barcode, StandardCharsets.UTF_8);
            Document doc = Jsoup.connect(url)
                    .userAgent(USER_AGENT)
                    .timeout(10000)
                    .get();

            Element productCard = doc.selectFirst(".product-card, .product-item");
            if (productCard != null) {
                return scrapeGladenProduct(productCard, barcode);
            }

        } catch (IOException e) {
            log.debug("Gladen search failed for barcode {}: {}", barcode, e.getMessage());
        }
        return null;
    }

    /**
     * Search Gladen.bg by product name
     */
    private ScrapedProductData searchGladenByName(String query) {
        try {
            String url = "https://shop.gladen.bg/search?q=" + URLEncoder.encode(query, StandardCharsets.UTF_8);
            Document doc = Jsoup.connect(url)
                    .userAgent(USER_AGENT)
                    .timeout(10000)
                    .get();

            Element productCard = doc.selectFirst(".product-card, .product-item");
            if (productCard != null) {
                return scrapeGladenProduct(productCard, query);
            }

        } catch (IOException e) {
            log.debug("Gladen search failed for query {}: {}", query, e.getMessage());
        }
        return null;
    }

    /**
     * Scrape product data from Gladen.bg product card
     */
    private ScrapedProductData scrapeGladenProduct(Element card, String searchTerm) {
        ScrapedProductData data = new ScrapedProductData();
        data.setSource("gladen.bg");

        // Get product title
        Element titleEl = card.selectFirst(".product-title, .product-name, h3 a, h4 a");
        if (titleEl != null) {
            data.setTitle(titleEl.text().trim());
            if (titleEl.hasAttr("href")) {
                String href = titleEl.attr("href");
                if (!href.startsWith("http")) {
                    href = "https://shop.gladen.bg" + href;
                }
                data.setSourceUrl(href);
            }
        }

        // Get image
        Element img = card.selectFirst("img");
        if (img != null) {
            String imgSrc = img.attr("src");
            if (imgSrc.isEmpty()) imgSrc = img.attr("data-src");
            data.setImageUrl(imgSrc);
        }

        // Calculate match score
        if (data.getTitle() != null) {
            data.setMatchScore(calculateSimilarity(searchTerm, data.getTitle()));
        }

        return data;
    }

    /**
     * Apply scraped data to product
     */
    private void applyEnrichmentData(Product product, ScrapedProductData data) {
        // Update title if we have a better one
        if (data.getTitle() != null && !data.getTitle().isEmpty()) {
            product.setTitle(data.getTitle());
        }

        // Update description
        if (data.getDescription() != null && !data.getDescription().isEmpty()) {
            product.setDescription(data.getDescription());
        }

        // Update brand
        if (data.getBrand() != null && !data.getBrand().isEmpty()) {
            product.setBrand(data.getBrand());
        }

        // Update age range
        if (data.getAgeRange() != null && !data.getAgeRange().isEmpty()) {
            product.setAgeRange(data.getAgeRange());
        }

        // Update ingredients
        if (data.getIngredients() != null && !data.getIngredients().isEmpty()) {
            product.setIngredients(data.getIngredients());
        }

        // Download and upload images
        List<String> uploadedImageUrls = new ArrayList<>();
        List<String> sourceImages = data.getImageUrls() != null ? data.getImageUrls() :
                (data.getImageUrl() != null ? List.of(data.getImageUrl()) : List.of());

        for (String imageUrl : sourceImages) {
            try {
                String uploadedUrl = downloadAndUploadImage(imageUrl, product.getSupplierSku());
                if (uploadedUrl != null) {
                    uploadedImageUrls.add(uploadedUrl);
                }
            } catch (Exception e) {
                log.warn("Failed to download image {}: {}", imageUrl, e.getMessage());
            }
        }

        if (!uploadedImageUrls.isEmpty()) {
            try {
                product.setImages(objectMapper.writeValueAsString(uploadedImageUrls));
            } catch (Exception e) {
                log.error("Failed to serialize images: {}", e.getMessage());
            }
        }

        // Set enrichment metadata
        product.setEnrichmentMatchScore(data.getMatchScore());
        product.setEnrichmentSource(data.getSource());
    }

    /**
     * Download image from URL and upload to R2
     */
    private String downloadAndUploadImage(String imageUrl, String productSku) {
        try {
            // Validate image URL
            if (imageUrl == null || imageUrl.isEmpty() || !imageUrl.startsWith("http")) {
                log.warn("Invalid image URL: {}", imageUrl);
                return null;
            }

            // Download image bytes
            byte[] imageBytes = Jsoup.connect(imageUrl)
                    .userAgent(USER_AGENT)
                    .ignoreContentType(true)
                    .timeout(15000)
                    .execute()
                    .bodyAsBytes();

            // Upload to R2 via ImageUploadService
            String skuPart = (productSku != null && !productSku.isEmpty()) ? productSku : "product";
            String filename = skuPart + "-" + UUID.randomUUID().toString().substring(0, 8) + ".jpg";
            return imageUploadService.uploadImageBytes(imageBytes, filename);

        } catch (Exception e) {
            log.warn("Failed to download/upload image from {}: {}", imageUrl, e.getMessage());
            return null;
        }
    }

    /**
     * Calculate string similarity (Jaccard similarity on words)
     */
    private double calculateSimilarity(String s1, String s2) {
        if (s1 == null || s2 == null) return 0;

        Set<String> words1 = new HashSet<>(Arrays.asList(s1.toLowerCase().split("\\s+")));
        Set<String> words2 = new HashSet<>(Arrays.asList(s2.toLowerCase().split("\\s+")));

        Set<String> intersection = new HashSet<>(words1);
        intersection.retainAll(words2);

        Set<String> union = new HashSet<>(words1);
        union.addAll(words2);

        return union.isEmpty() ? 0 : (double) intersection.size() / union.size();
    }

    /**
     * Clean up search query for better results
     */
    private String cleanSearchQuery(String query) {
        if (query == null) return "";

        // Remove product codes like "080/26", "0526.001"
        String cleaned = query
                .replaceAll("\\d{3,}/\\d+", "")  // Remove codes like 080/26
                .replaceAll("\\d{4}\\.\\d+", "") // Remove codes like 0526.001
                .replaceAll("\\d+\\s*(бр|мл|гр|кг|л|м)\\.*", "") // Remove quantities
                .replaceAll(",\\s*$", "") // Remove trailing commas
                .replaceAll("\\s+", " ")
                .trim();

        // Extract brand and product type for better search
        // "Авент 080/26 Залъгалки Ultra Air" -> "Avent Залъгалки Ultra Air"
        cleaned = cleaned.replace("Авент", "Philips Avent").replace("авент", "Philips Avent");

        log.debug("Cleaned search query: '{}' -> '{}'", query, cleaned);
        return cleaned;
    }

    /**
     * Parse barcodes JSON array
     */
    private List<String> parseBarcodes(String barcodesJson) {
        if (barcodesJson == null || barcodesJson.isEmpty()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(barcodesJson,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
        } catch (Exception e) {
            return List.of();
        }
    }

    /**
     * Bulk enrich products
     * Note: No @Transactional here - each product is enriched in its own transaction
     * to avoid holding DB connections during rate-limiting delays
     */
    public List<EnrichmentResult> enrichProducts(List<UUID> productIds) {
        List<EnrichmentResult> results = new ArrayList<>();
        for (UUID id : productIds) {
            results.add(enrichProduct(id));

            // Small delay to avoid rate limiting
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
        return results;
    }

    /**
     * Get products needing enrichment
     */
    public List<Product> getProductsNeedingEnrichment(int limit) {
        return productRepository.findByEnrichmentMatchScoreIsNullAndStatusOrderByCreatedAtAsc(
                ProductStatus.DRAFT,
                org.springframework.data.domain.PageRequest.of(0, limit)
        ).getContent();
    }
}
