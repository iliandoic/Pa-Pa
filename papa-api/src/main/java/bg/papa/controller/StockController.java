package bg.papa.controller;

import bg.papa.service.MistralSyncService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Stock", description = "Real-time stock validation endpoints")
public class StockController {

    private final MistralSyncService mistralSyncService;

    @PostMapping("/check")
    @Operation(summary = "Check real-time stock for specific products")
    public ResponseEntity<Map<String, MistralSyncService.StockInfo>> checkStock(
            @RequestBody StockCheckRequest request) {

        var result = mistralSyncService.checkStockRealTime(request.supplierSkus());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/validate-cart")
    @Operation(summary = "Validate cart items - check if requested quantities are available")
    public ResponseEntity<MistralSyncService.CartValidationResult> validateCart(
            @RequestBody CartValidationRequest request) {

        List<MistralSyncService.CartItemCheck> items = request.items().stream()
                .map(item -> new MistralSyncService.CartItemCheck(item.supplierSku(), item.quantity()))
                .toList();

        var result = mistralSyncService.validateCart(items);
        return ResponseEntity.ok(result);
    }

    // Request DTOs
    public record StockCheckRequest(List<String> supplierSkus) {}

    public record CartValidationRequest(List<CartItem> items) {}

    public record CartItem(String supplierSku, int quantity) {}
}
