package bg.papa.repository;

import bg.papa.entity.Product;
import bg.papa.entity.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    Optional<Product> findByHandle(String handle);

    Optional<Product> findBySupplierSku(String supplierSku);

    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    Page<Product> findByCategoryIdAndStatus(UUID categoryId, ProductStatus status, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.status = :status AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> searchProducts(@Param("search") String search,
                                 @Param("status") ProductStatus status,
                                 Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.supplierSku) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "ORDER BY CASE WHEN LOWER(p.supplierSku) LIKE LOWER(CONCAT('%', :search, '%')) THEN 0 ELSE 1 END, p.createdAt DESC")
    Page<Product> searchAllFields(@Param("search") String search, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.status = :status AND (" +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.supplierSku) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY CASE WHEN LOWER(p.supplierSku) LIKE LOWER(CONCAT('%', :search, '%')) THEN 0 ELSE 1 END, p.createdAt DESC")
    Page<Product> searchAllFieldsWithStatus(@Param("search") String search,
                                            @Param("status") ProductStatus status,
                                            Pageable pageable);


    @Query("SELECT p FROM Product p WHERE p.supplierSku IS NOT NULL")
    List<Product> findProductsForSync();

    List<Product> findBySupplierSkuIn(List<String> supplierSkus);

    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE Product p SET p.status = :newStatus WHERE p.status = :oldStatus")
    int updateStatusByStatus(@Param("newStatus") ProductStatus newStatus,
                             @Param("oldStatus") ProductStatus oldStatus);

    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE Product p SET p.stock = :stock WHERE p.supplierSku = :supplierSku")
    int updateStockBySupplierSku(@Param("supplierSku") String supplierSku, @Param("stock") Integer stock);

    @Query("SELECT p.supplierSku FROM Product p WHERE p.supplierSku IS NOT NULL")
    List<String> findAllSupplierSkus();

    long countByBarcodesIsNotNull();

    @org.springframework.data.jpa.repository.Modifying
    @Query("DELETE FROM Product p WHERE p.barcodes IS NULL")
    int deleteByBarcodesIsNull();

    // Enrichment queries
    Page<Product> findByEnrichmentMatchScoreIsNullAndStatusOrderByCreatedAtAsc(ProductStatus status, Pageable pageable);

    Page<Product> findByEnrichmentMatchScoreIsNotNullAndStatusOrderByEnrichmentMatchScoreDesc(ProductStatus status, Pageable pageable);

    long countByEnrichmentMatchScoreIsNull();

    long countByEnrichmentMatchScoreIsNotNull();

    long countByEnrichmentMatchScoreGreaterThanEqual(Double score);

    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE Product p SET p.status = :newStatus WHERE p.enrichmentMatchScore >= :minScore AND p.status = :currentStatus")
    int bulkApproveHighConfidence(@Param("minScore") Double minScore,
                                  @Param("currentStatus") ProductStatus currentStatus,
                                  @Param("newStatus") ProductStatus newStatus);
}
