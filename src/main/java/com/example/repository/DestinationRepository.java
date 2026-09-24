package com.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.model.Destination;

@Repository
public interface DestinationRepository
        extends JpaRepository<Destination, Integer> {

    // =====================================================
    // SEARCH — by name, category, or season (keyword)
    // =====================================================

    @Query("SELECT d FROM Destination d WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           " LOWER(d.name)     LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(d.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(d.season)   LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(d.location) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Destination> searchByKeyword(@Param("keyword") String keyword);

    // =====================================================
    // FILTER — combined: keyword + category + season + budget range
    // =====================================================

    @Query("SELECT d FROM Destination d WHERE " +
           "(:keyword  IS NULL OR :keyword  = '' OR " +
           "  LOWER(d.name)     LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "  LOWER(d.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "  LOWER(d.season)   LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "  LOWER(d.location) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:category IS NULL OR :category = '' OR LOWER(d.category) = LOWER(:category)) AND " +
           "(:season   IS NULL OR :season   = '' OR LOWER(d.season)   = LOWER(:season))   AND " +
           "(:minBudget IS NULL OR d.budget >= :minBudget) AND " +
           "(:maxBudget IS NULL OR d.budget <= :maxBudget) " +
           "ORDER BY d.rating DESC NULLS LAST")
    List<Destination> searchWithFilters(
            @Param("keyword")   String keyword,
            @Param("category")  String category,
            @Param("season")    String season,
            @Param("minBudget") Double minBudget,
            @Param("maxBudget") Double maxBudget
    );
}