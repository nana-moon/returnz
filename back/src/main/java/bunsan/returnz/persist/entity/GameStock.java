package bunsan.returnz.persist.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import bunsan.returnz.domain.game.dto.GameStockDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GameStock {
	@Id
	@Column(name = "COMPANY_CODE")
	private String companyCode;
	private String stockName;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "GAME_ROOM_ID")
	private GameRoom gameRoom;

	public GameStockDto toDto(GameStock gameStock) {
		return GameStockDto.builder()
			.companyCode(gameStock.companyCode)
			.stockName(gameStock.stockName)
			.gameRoomId(gameStock.gameRoom.getRoomId())
			.build();
	}
}
