package bunsan.returnz.domain.sidebar.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import bunsan.returnz.domain.friend.dto.FriendInfo;
import bunsan.returnz.domain.friend.service.FriendService;
import bunsan.returnz.domain.member.enums.MemberState;
import bunsan.returnz.domain.sidebar.dto.SideMessageDto;
import bunsan.returnz.global.advice.exception.BadRequestException;
import bunsan.returnz.global.advice.exception.ConflictException;
import bunsan.returnz.global.advice.exception.NotFoundException;
import bunsan.returnz.global.auth.service.JwtTokenProvider;
import bunsan.returnz.infra.redis.service.RedisPublisher;
import bunsan.returnz.persist.entity.FriendRequest;
import bunsan.returnz.persist.entity.Member;
import bunsan.returnz.persist.repository.FriendRequestRepository;
import bunsan.returnz.persist.repository.MemberRepository;
import bunsan.returnz.persist.repository.RedisSideBarRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class SideBarService {
	private final JwtTokenProvider jwtTokenProvider;
	private final MemberRepository memberRepository;
	private final RedisPublisher redisPublisher;
	private final RedisSideBarRepository redisSideBarRepository;

	// @Transactional
	// public void sendFriendRequest(SideMessageDto sideRequest, String token) {
	// 	Map<String, Object> requestBody = sideRequest.getMessageBody();
	//
	// 	// token에 저장된 Member > 요청한 사람
	// 	Member requester = jwtTokenProvider.getMember(token);
	// 	if (requester.getFriends().size() >= 20) {
	// 		throw new BadRequestException("친구는 20명을 넘을 수 없습니다.");
	// 	}
	// 	String requestUsername = requester.getUsername();
	// 	String targetUsername = (String)requestBody.get("username");
	//
	// 	checkValidRequest(requestUsername, targetUsername);
	//
	// 	// 친구 요청 존재 여부 확인
	// 	SideMessageDto sideMessageDto = friendService.checkPresentFriendRequest(requester, targetUsername);
	//
	//
	// 	log.info(sideMessageDto.toString());
	//
	// 	redisPublisher.publishSideBar(redisSideBarRepository.getTopic("side-bar"), sideMessageDto);
	// }

	@Transactional
	public void sendInviteMessage(SideMessageDto sideRequest, String token) {
		// token에 저장된 Member > 요청한 사람
		Map<String, Object> requestBody = sideRequest.getMessageBody();
		Member requester = jwtTokenProvider.getMember(token);
		if (requestBody.get("username") == null) {
			throw new BadRequestException("초대 상대가 존재하지 않습니다.");
		}
		// 새로운 사이드 메세지 생성
		Map<String, Object> messageBody = new HashMap<>();
		messageBody.put("roomId", requestBody.get("roomId"));
		messageBody.put("username", requestBody.get("username"));
		messageBody.put("nickname", requester.getNickname());
		messageBody.put("profileIcon", requester.getProfileIcon());

		SideMessageDto sideMessageDto = SideMessageDto.builder()
			.type(SideMessageDto.MessageType.INVITE)
			.messageBody(messageBody)
			.build();

		redisPublisher.publishSideBar(redisSideBarRepository.getTopic("side-bar"), sideMessageDto);
	}

	public void checkValidRequest(String requestUsername, String targetUsername) {
		// 우선 확인 사항
		// Member 반환
		Member requestMember = memberRepository.findByUsername(requestUsername)
			.orElseThrow(() -> new BadRequestException("요청 유저가 존재하지 않습니다."));
		Member targetMember = memberRepository.findByUsername(targetUsername)
			.orElseThrow(() -> new BadRequestException("대상 유저가 존재하지 않습니다."));
		if (requestMember.equals(targetMember)) {
			throw new BadRequestException("자신과 친구를 할 수 없습니다.");
		}
		// 둘이 친구인지 확인
		if (requestMember.isFriend(targetMember)) {
			throw new ConflictException("이미 친구인 유저와 친구를 할 수 없습니다.");
		}
	}

	@Transactional
	public void sendEnterMessage(String username) {
		// member 조회 후 online으로 바꿔주기
		Member member = memberRepository.findByUsername(username)
			.orElseThrow(() -> new NotFoundException("요청 맴버를 찾을 수 없습니다."));

		// 온라인인지 상태 확인 후 변경
		checkState(member, MemberState.ONLINE);

		// 친구 조회 후 상태 전부 리턴
		List<FriendInfo> friendInfoList = new ArrayList<>();
		for (Member friend : member.getFriends()) {
			friendInfoList.add(new FriendInfo(friend));
		}

		Map<String, Object> messageBody = new HashMap<>();
		messageBody.put("friendList", friendInfoList);
		messageBody.put("username", username);

		SideMessageDto sideMessageDto = SideMessageDto.builder()
			.type(SideMessageDto.MessageType.ENTER)
			.messageBody(messageBody)
			.build();

		redisPublisher.publishSideBar(redisSideBarRepository.getTopic("side-bar"), sideMessageDto);
	}

	public void checkState(Member member, MemberState state) {
		if (!member.getState().equals(state)) {
			member.changeState(state);
			memberRepository.save(member);
			// 친구들에게 전송
			for (Member friend : member.getFriends()) {
				Map<String, Object> messageBody = new HashMap<>();
				messageBody.put("state", state);
				messageBody.put("friendName", member.getUsername());
				messageBody.put("username", friend.getUsername());

				SideMessageDto sideMessageDto = SideMessageDto.builder()
					.type(SideMessageDto.MessageType.STATE)
					.messageBody(messageBody)
					.build();

				redisPublisher.publishSideBar(redisSideBarRepository.getTopic("side-bar"), sideMessageDto);
			}
		}
	}
}
