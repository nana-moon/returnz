package bunsan.returnz.persist.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import bunsan.returnz.persist.entity.FinancialNews;
import io.lettuce.core.dynamic.annotation.Param;

public interface FinancialNewsRepository extends JpaRepository<FinancialNews, Long> {
	@Query(value = "SELECT DISTINCT fn.date FROM FinancialNews fn "
		+ "WHERE fn.date >= :startDate AND fn.code IN :companyCodes"
		+ " ORDER BY fn.date ASC")
	List<LocalDateTime> findDistinctDatesAfter(@Param("startDate") LocalDateTime startDate, Pageable pageable,
		@Param("companyCodes") List<String> companyCodes);

	@Query(value = "SELECT "
		+ "DISTINCT fn.date, fn"
		+ " FROM FinancialNews fn "
		+ "WHERE fn.date between :startDate And :endDate "
		+ "AND fn.code IN :companyCodes"
		+ " ORDER BY fn.date ASC")
	List<Object[]> findAllByDateAndCompanyCodes(@Param("startDate") LocalDateTime startDate,
		@Param("endDate") LocalDateTime endDate,
		@Param("companyCodes") List<String> companyCodes);

}
