package bg.papa.repository;

import bg.papa.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    Optional<Category> findByHandle(String handle);

    List<Category> findByParentIsNullOrderBySortOrderAsc();

    List<Category> findByParentIdOrderBySortOrderAsc(UUID parentId);

    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.children WHERE c.parent IS NULL ORDER BY c.sortOrder ASC")
    List<Category> findAllWithChildren();
}
