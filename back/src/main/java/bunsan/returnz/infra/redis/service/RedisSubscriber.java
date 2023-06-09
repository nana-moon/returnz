package bunsan.returnz.infra.redis.service;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import bunsan.returnz.domain.game.dto.RoomMessageDto;
import bunsan.returnz.domain.sidebar.dto.SideMessageDto;
import bunsan.returnz.domain.waiting.dto.WaitMessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class RedisSubscriber implements MessageListener {
	private final ObjectMapper objectMapper;
	private final RedisTemplate redisTemplate;
	private final SimpMessageSendingOperations messagingTemplate;

	@Override
	public void onMessage(Message message, byte[] pattern) {
		try {
			String topic = (String)redisTemplate.getStringSerializer().deserialize(message.getChannel());
			String publishMessage = (String)redisTemplate.getStringSerializer().deserialize(message.getBody());

			if (topic.equals("side-bar")) {
				log.info("side-bar");
				SideMessageDto sideMessageDto = objectMapper.readValue(publishMessage, SideMessageDto.class);
				messagingTemplate.convertAndSendToUser((String)sideMessageDto.getMessageBody().get("username"),
					"/sub/side-bar", sideMessageDto);
			} else if (topic.equals("game-room")) {
				RoomMessageDto roomMessageDto = objectMapper.readValue(publishMessage, RoomMessageDto.class);
				messagingTemplate.convertAndSend("/sub/game-room/" + roomMessageDto.getRoomId(), roomMessageDto);
			} else if (topic.equals("wait-room")) {
				WaitMessageDto waitMessageDto = objectMapper.readValue(publishMessage, WaitMessageDto.class);
				String roomId = (String)waitMessageDto.getMessageBody().get("roomId");
				messagingTemplate.convertAndSend("/sub/wait-room/" + roomId, waitMessageDto);
			} else {
				RoomMessageDto roomMessageDto = objectMapper.readValue(publishMessage, RoomMessageDto.class);
				messagingTemplate.convertAndSend("/sub/result-room/" + roomMessageDto.getRoomId(), roomMessageDto);
			}

		} catch (Exception e) {
			log.error(e.getMessage());
		}
	}
}
