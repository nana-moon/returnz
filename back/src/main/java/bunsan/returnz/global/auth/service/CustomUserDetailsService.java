package bunsan.returnz.global.auth.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import bunsan.returnz.persist.entity.Member;
import bunsan.returnz.persist.repository.MemberRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
	private final MemberRepository memberRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		return memberRepository.findByUsername(username)
			.map(this::createUserDetails)
			.orElseThrow(() -> new UsernameNotFoundException("해당하는 유저를 찾을 수 없습니다."));

	}

	private UserDetails createUserDetails(Member member) {
		return User.builder()
			.username(member.getUsername())
			.password(member.getPassword())
			.roles(member.getRoles().toArray(new String[0]))
			.build();
	}
}
