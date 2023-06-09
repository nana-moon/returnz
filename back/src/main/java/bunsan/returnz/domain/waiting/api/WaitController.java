package bunsan.returnz.domain.waiting.api;

import java.util.Map;

import javax.validation.constraints.NotBlank;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import bunsan.returnz.domain.waiting.dto.SettingDto;
import bunsan.returnz.domain.waiting.dto.WaitMessageDto;
import bunsan.returnz.domain.waiting.service.WaitService;
import bunsan.returnz.global.advice.exception.BadRequestException;
import bunsan.returnz.persist.entity.WaitRoom;
import lombok.RequiredArgsConstructor;

// TODO: 2023-03-29 프론트 서버에 맞게 CrossOrigin 변경

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class WaitController {
	private final WaitService waitService;

	//----------------------------------대기방 만드는 요청------------------------------------
	@PostMapping("/api/wait-room")
	public ResponseEntity<WaitRoom> createWaitRoom(@RequestHeader(value = "Authorization") String bearerToken) {
		String token = bearerToken.substring(7);
		WaitRoom waitRoom = waitService.createWaitRoom(token);
		return ResponseEntity.ok().body(waitRoom);
	}

	//------------------------------------대기방 송신 요청-------------------------------------
	@MessageMapping("/wait-room")
	public void sendToWaitRoom(WaitMessageDto waitRequest, @Header("Authorization") String bearerToken) {
		String token = bearerToken.substring(7);
		if (waitRequest.getType().equals(WaitMessageDto.MessageType.CHAT)) {
			waitService.sendChatMessage(waitRequest, token);
		} else if (waitRequest.getType().equals(WaitMessageDto.MessageType.SETTING)) {
			ObjectMapper mapper = new ObjectMapper();
			SettingDto settingDto = mapper.convertValue(waitRequest.getMessageBody(), SettingDto.class);
			waitService.sendGameSetting(settingDto);
		} else if (waitRequest.getType().equals(WaitMessageDto.MessageType.GAME_INFO)) {
			waitService.sendGameInfo(waitRequest);
		} else { // 예외 처리 메세지 소켓으로 send?
			throw new BadRequestException("메세지 타입이 올바르지 않습니다.");
		}
	}

	//----------------------------------대기방 인원 조정------------------------------------
	@DeleteMapping("/api/wait-room/waiter")
	public ResponseEntity deleteWaiter(@RequestHeader(value = "Authorization") String bearerToken,
		@RequestParam @NotBlank String roomId) {
		String token = bearerToken.substring(7);
		waitService.deleteWaiter(token, roomId);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@PostMapping("/api/wait-room/waiter")
	public ResponseEntity createWaiter(@RequestHeader(value = "Authorization") String bearerToken,
		@RequestParam @NotBlank String roomId) {
		String token = bearerToken.substring(7);
		WaitRoom waitRoom = waitService.createWaiter(token, roomId);
		return ResponseEntity.ok().body(waitRoom);
	}
}
