package bg.papa.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledSyncService {

    private final MistralSyncService mistralSyncService;

    private static final ZoneId BULGARIA_ZONE = ZoneId.of("Europe/Sofia");

    @Value("${app.sync.scheduled.enabled:true}")
    private boolean scheduledSyncEnabled;

    /**
     * Sync stock every 3 hours
     * Runs at minute 0 of every 3rd hour (e.g., 00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00)
     */
    @Scheduled(cron = "0 0 */3 * * *")
    public void syncStockEvery3Hours() {
        if (!scheduledSyncEnabled) {
            log.debug("Scheduled sync is disabled, skipping stock sync");
            return;
        }

        LocalDateTime now = LocalDateTime.now(BULGARIA_ZONE);
        log.info("Starting scheduled stock sync at {} (Bulgaria time)", now);

        try {
            var result = mistralSyncService.syncStockBatch();
            log.info("Stock sync completed: {} updated, {} errors",
                    result.updated(), result.errors());
        } catch (Exception e) {
            log.error("Stock sync failed: {}", e.getMessage(), e);
        }
    }

    /**
     * Sync prices daily at 12:00 AM (midnight) Bulgaria time
     * This does a full product sync to update prices, stock, and any new products
     */
    @Scheduled(cron = "0 0 0 * * *", zone = "Europe/Sofia")
    public void syncPricesDaily() {
        if (!scheduledSyncEnabled) {
            log.debug("Scheduled sync is disabled, skipping daily price sync");
            return;
        }

        LocalDateTime now = LocalDateTime.now(BULGARIA_ZONE);
        log.info("Starting scheduled daily price sync at {} (Bulgaria time)", now);

        try {
            // Full sync to update prices and add new products
            // Process in batches of 1000 to avoid memory issues
            int totalCreated = 0;
            int totalUpdated = 0;
            int totalErrors = 0;
            int batchSize = 1000;

            for (int fromRow = 1; fromRow <= 20000; fromRow += batchSize) {
                try {
                    var result = mistralSyncService.syncProductsByRowRange(fromRow, fromRow + batchSize - 1);
                    totalCreated += result.created();
                    totalUpdated += result.updated();
                    totalErrors += result.errors();

                    log.info("Price sync progress: rows {}-{}, created={}, updated={}, errors={}",
                            fromRow, fromRow + batchSize - 1, result.created(), result.updated(), result.errors());

                    // If we got no products, we've reached the end
                    if (result.total() == 0) {
                        log.info("No more products found, ending price sync");
                        break;
                    }
                } catch (Exception e) {
                    log.error("Error syncing rows {}-{}: {}", fromRow, fromRow + batchSize - 1, e.getMessage());
                    totalErrors++;
                }
            }

            log.info("Daily price sync completed: {} created, {} updated, {} errors",
                    totalCreated, totalUpdated, totalErrors);
        } catch (Exception e) {
            log.error("Daily price sync failed: {}", e.getMessage(), e);
        }
    }

    /**
     * Log next scheduled sync times (for debugging)
     * Runs once at startup and then every 6 hours
     */
    @Scheduled(fixedRate = 6 * 60 * 60 * 1000, initialDelay = 5000)
    public void logScheduleInfo() {
        LocalDateTime now = LocalDateTime.now(BULGARIA_ZONE);
        log.info("=== Scheduled Sync Status ===");
        log.info("Enabled: {}", scheduledSyncEnabled);
        log.info("Current time (Bulgaria): {}", now);
        log.info("Stock sync: Every 3 hours (00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00)");
        log.info("Price sync: Daily at 12:00 AM (midnight) Bulgaria time");
        log.info("=============================");
    }
}
