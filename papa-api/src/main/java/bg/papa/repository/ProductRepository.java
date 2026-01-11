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

    Optional<Product> findBySku(String sku);

    Optional<Product> findBySupplierSku(String supplierSku);

    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    Page<Product> findByCategoryIdAndStatus(UUID categoryId, ProductStatus status, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.status = :status AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> searchProducts(@Param("search") String search,
                                 @Param("status") ProductStatus status,
                                 Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.manualEntry = false AND p.supplierSku IS NOT NULL")
    List<Product> findProductsForSync();

    List<Product> findBySupplierSkuIn(List<String> supplierSkus);
}
