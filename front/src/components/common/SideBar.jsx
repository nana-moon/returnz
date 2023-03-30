/* eslint-disable no-empty */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import SockJs from 'sockjs-client';
import StompJs from 'stompjs';
import Cookies from 'js-cookie';
import styled from 'styled-components';
import tw from 'twin.macro';
import Stomp from 'webstomp-client';
import { useQuery } from 'react-query';
import { Input } from '@material-tailwind/react';
import { AiOutlineSearch } from 'react-icons/ai';
import FriendListItems from './Items/FriendListItems';
import UserProfile from './SideBar/UserProfile';
// import FriendSearchInput from './SideBar/FriendSearchInput';
import IncomingFriendRequests from './SideBar/IncomingFriendRequests';
import { getFriendRequests } from '../../apis/friendApi';

// import { stomp } from '../../apis/axiosConfig';

export default function SideBar() {
  const [friendList, setfriendList] = useState();
  const sock = new SockJs('http://j8c106.p.ssafy.io:8188/ws');

  const options = {
    debug: false,
    protocols: Stomp.VERSIONS.supportedProtocols(),
  };
  // client 객체 생성 및 서버주소 입력
  const stomp = StompJs.over(sock, options);
  // stomp로 감싸기
  const myToken = Cookies.get('access_token');
  const myMail = Cookies.get('email');
  const onChange = (e) => setfriendNickname(e.target.value);
  const [friendNickname, setfriendNickname] = useState('');
  // const { data: friendList } = useQuery({
  //   queryKey: ['friendRequests'],
  //   queryFn: () => getFriendRequests(),
  //   onError: (e) => {
  //     console.log(e);
  //   },
  //   staleTime: 1000000,
  // });
  const handleFriendRequest = () => {
    console.log(friendNickname);
    const res = JSON.stringify({
      type: 'FRIEND',
      messageBody: {
        username: `${friendNickname}`,
      },
    });
    return res;
  };

  useEffect(() => {
    const stompConnect = () => {
      try {
        stomp.debug = null;
        // console에 보여주는데 그것을 감추기 위한 debug
        console.log('Connected');
        stomp.connect(
          {
            // 여기에서 유효성 검증을 위해 header를 넣어줄 수 있음
            Authorization: `${myToken}`,
          },
          () => {
            stomp.subscribe(
              `/user/sub/side-bar`,
              (data) => {
                const newMessage = JSON.parse(data.body);
                const newFriend = newMessage.messageBody.friendList;
                console.log(newFriend);
                setfriendList(newFriend);
                // 데이터 파싱
              },
              {
                // 여기에서 유효성 검증을 위해 header를 넣어줄 수 있음
                Authorization: `${myToken}`,
              },
            );
            stomp.send(
              '/pub/side-bar',
              {
                // 여기에서 유효성 검증을 위해 header를 넣어줄 수 있음
                Authorization: `${myToken}`,
              },
              JSON.stringify({
                type: 'ENTER',
                messageBody: {
                  username: `${myMail}`,
                },
              }),
              handleFriendRequest(),
            );
          },
        );
      } catch (err) {
        console.log(err);
      }
    };
    stompConnect();
  }, []);

  // const { data: friendlist } = useQuery('friendlist', async () => {
  //   const response = await stompConnect();
  //   console.log(response, '리액트쿼리');
  //   return response;
  // });

  // const stompDisConnect = () => {
  //   console.log('222');
  //   try {
  //     stomp.debug = null;
  //     stomp.disconnect(
  //       () => {
  //         stomp.unsubscribe('sub-0');
  //       },
  //       {
  //         // 여기에서 유효성 검증을 위해 header를 넣어줄 수 있음
  //         Authorization:
  //           'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtb29uQG5hdmVyLmNvbSIsImF1dGgiOiJST0xFX1VTRVIiLCJ1c2VybmFtZSI6Im1vb25AbmF2ZXIuY29tIiwiaWQiOjgsIm5pY2tuYW1lIjoibW9vbiIsInByb2ZpbGVJY29uIjoiQSIsImV4cCI6MTY3OTc5NDMyMH0.CN8mcVj8BSqW49qHnwcbjMi8jZ8EMPBEvoIXxWai0M4',
  //       },
  //     );
  //   } catch (err) {}
  // };
  // const sendMessage = () => {
  //   stomp.send(
  //     '/pub/side-bar',
  //     JSON.stringify({
  //       type: 'FRINED',
  //       messageBody: {
  //         requestUsername: 'moon@naver.com',
  //         targetUsername: 'ssafy6@naver.com',
  //       },
  //     }),
  //     {
  //       // 여기에서 유효성 검증을 위해 header를 넣어줄 수 있음
  //       Authorization:
  //         'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtb29uQG5hdmVyLmNvbSIsImF1dGgiOiJST0xFX1VTRVIiLCJ1c2VybmFtZSI6Im1vb25AbmF2ZXIuY29tIiwiaWQiOjgsIm5pY2tuYW1lIjoibW9vbiIsInByb2ZpbGVJY29uIjoiQSIsImV4cCI6MTY3OTgxNTQwNn0.fKPM4dJ45QhnUkAy9eOh2nNnsDbyef8RXT5zkthArhM',
  //     },
  //   );
  // };
  // sendMessage();
  const { data: friendRequests } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: () => getFriendRequests(),
    onError: (e) => {
      console.log(e);
    },
    // staleTime: 1000000,
  });
  return (
    <SideBarContainer>
      <UserProfile />
      {friendRequests.length > 0 ? <IncomingFriendRequests /> : null}
      <FriendListContainer>
        {friendList?.map((friend) => {
          return <FriendListItems friend={friend} key={friend.username} />;
        })}
      </FriendListContainer>
      <FriendSearchContainer>
        <Input
          type="text"
          label="닉네임을 검색하세요"
          color="cyan"
          value={friendNickname}
          onChange={onChange}
          className="bg-input"
        />
        <SearchButton onClick={handleFriendRequest}>
          <AiOutlineSearch />
        </SearchButton>
      </FriendSearchContainer>
    </SideBarContainer>
  );
}

const SideBarContainer = styled.div`
  ${tw`bg-white border-l-2 border-negative w-1/5`}
`;

const FriendListContainer = styled.div`
  ${tw``}
`;
const FriendSearchContainer = styled.div`
  // position: fixed;
  ${tw`flex border-t-2 border-negative px-2 pt-2 gap-2`}
`;

const SearchButton = styled.button`
  ${tw`text-primary bg-white border-2 border-primary hover:bg-cyan-100 focus:border-dprimary font-bold font-spoq text-sm rounded-lg px-2 py-1 text-center`}
`;
