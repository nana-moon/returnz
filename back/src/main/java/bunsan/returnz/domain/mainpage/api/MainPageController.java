package bunsan.returnz.domain.mainpage.api;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import bunsan.returnz.domain.mainpage.dto.StockDto;
import bunsan.returnz.domain.mainpage.dto.TodayWordDto;
import bunsan.returnz.domain.mainpage.service.readonly.MainPageService;
import bunsan.returnz.global.advice.exception.BadRequestException;
import bunsan.returnz.persist.entity.Ranking;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// TODO: 2023-03-29 프론트 서버에 맞게 CrossOrigin 변경

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api")
@Slf4j
public class MainPageController {
	public final MainPageService mainPageService;

	@GetMapping("/today-words")
	public ResponseEntity<Map> getWordList() {
		List<TodayWordDto> requestDtoList = mainPageService.getWordList();
		return ResponseEntity.ok(Map.of("todayWordList", requestDtoList));
	}

	@GetMapping("/user-ranks")
	public ResponseEntity<Map> getUserRanks() {
		List<Ranking> requestDtoList = mainPageService.getUserRanks();
		return ResponseEntity.ok(Map.of("userRank", requestDtoList));
	}

	@GetMapping("/recommend-stock")
	public ResponseEntity<?> getRecommendStock() {
		List<StockDto> stockDtos = mainPageService.recomandStockList();
		return ResponseEntity.ok().body(stockDtos);
	}

	@GetMapping("/recommend-stock/{stockCode}")
	public ResponseEntity<?> getDetailStock(@PathVariable String stockCode) {
		// KS 로끝난ㄴ다면
		if (!stockCode.substring(stockCode.length() - 2).equals("KS")
			|| (!stockCode.equals(stockCode.toUpperCase()))) {
			throw new BadRequestException("잘못된 주식양식입니다.");
		}
		Map<?, ?> detail = mainPageService.getDetail(stockCode);
		return ResponseEntity.ok().body(detail);
	}

}
