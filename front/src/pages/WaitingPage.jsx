/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import tw, { styled } from 'twin.macro';
import Cookies from 'js-cookie';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { startGameApi, gameDataApi } from '../apis/gameApi';
import { getWaiterList } from '../store/roominfo/WaitRoom.selector';
import Chatting from '../components/chatting/Chatting';
import ThemeSetting from '../components/waiting/ThemeSetting';
import UserSetting from '../components/waiting/UserSetting';
import WaitingListItem from '../components/waiting/WaitingListItem';
import { removeWaiterList, setWaiterList } from '../store/roominfo/WaitRoom.reducer';
import NullListItem from '../components/waiting/NullListItem';
import { setGamerId, setGameRoomId, setPlayerList, setRoomInfo } from '../store/roominfo/GameRoom.reducer';
import { getGamerId, getGameRoomId } from '../store/roominfo/GameRoom.selector';
import { handleGetGameData } from '../store/gamedata/GameData.reducer';

export default function WaitingPage() {
  // hooks
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // 대기자 state
  const waiterList = useSelector(getWaiterList);
  const gameRoomId = useSelector(getGameRoomId);
  const gamerId = useSelector(getGamerId);

  // 대기방 state
  const roomInfo = location.state;
  console.log(roomInfo, '웨이팅페이지에서 출력중');

  // 방장 state
  const myEmail = Cookies.get('email');
  const myProfile = Cookies.get('profileIcon');
  const myNickname = Cookies.get('nickname');
  const isHost = myEmail === roomInfo.captainName;
  const newWaiter = { id: 1, username: myEmail, nickname: myNickname, profile: myProfile, avgProfit: null };
  const [initialDispatch, setInitialDispatch] = useState(false);
  useEffect(() => {
    if (!initialDispatch) {
      dispatch(setWaiterList(newWaiter));
      setInitialDispatch(true);
    }
  }, [dispatch, initialDispatch]);

  // 게임 설정 state
  const initial = {
    theme: null,
    turnPerTime: 'NO',
    startTime: null,
    totalTurn: null,
    memberIdList: [1, 2, 3, 4],
  };
  const [setting, setSetting] = useState(initial);
  const [isUserSetting, setIsUserSetting] = useState(false); // 사용자 설정 확인
  const [isValidSetting, setIsValidSetting] = useState(false); // 설정 유효성 검사

  // 게임 설정 action
  const getIsUserSetting = () => {
    setIsUserSetting(!isUserSetting);
  };
  const getTheme = (data) => {
    const newData = { ...setting, theme: data };
    setSetting(newData);
  };
  const getUserSetting = (newData) => {
    setSetting(newData);
  };

  useEffect(() => {
    const isValid = () => {
      if (setting.theme === null) {
        return false;
      }
      if (setting.theme === 'USER') {
        if (setting.turnPerTime === 'NO' || setting.startTime === null || setting.totalTurn === null) {
          return false;
        }
        return true;
      }
      return true;
    };
    setIsValidSetting(isValid());
  }, [setting]);

  // useEffect(() => {}, [isValidSetting]);

  // 게임 시작 action
  const handleStart = async (e) => {
    if (isValidSetting) {
      const gameInit = await startGameApi(setting);
      dispatch(setPlayerList(gameInit.gamerList));
      dispatch(setGameRoomId(gameInit.roomId));
      const myGameInfo = gameInit.gamerList.find((gamer) => gamer.userName === 'ssafy');
      dispatch(setGamerId(myGameInfo.gamerId));
      const turnReq = {
        gamerId: myGameInfo.gamerId,
        roomId: gameInit.roomId,
      };
      const gameData = await gameDataApi(turnReq);
      console.log('gameData', gameData);
      dispatch(handleGetGameData(gameData.Stocks));
      navigate('/game');
    }
  };

  // 게임 나가기 action
  const handleBack = () => {
    dispatch(removeWaiterList());
  };
  return (
    <WaitingContainer>
      <WaitingListSection>
        {Array.from({ length: 4 }).map((_, i) => {
          if (i < waiterList.length) {
            console.log(i, waiterList[i]);
            return <WaitingListItem key={waiterList[i]} waiter={waiterList[i]} />;
          }
          // eslint-disable-next-line react/no-array-index-key
          return <NullListItem key={i} />;
        })}
      </WaitingListSection>
      <SettingSection>
        {!isUserSetting && <ThemeSetting getIsUserSetting={getIsUserSetting} getTheme={getTheme} />}
        {isUserSetting && (
          <UserSetting setting={setting} getIsUserSetting={getIsUserSetting} getUserSetting={getUserSetting} />
        )}
        <ChatSection>
          <Chatting />
          <BtnBox>
            {isHost && (
              <StartButton onClick={handleStart} disabled={!isValidSetting}>
                시작하기
              </StartButton>
            )}
            <BackButton to="/" onClick={handleBack} className="bg-[#E19999] hover:bg-[#976161]">
              나가기
            </BackButton>
          </BtnBox>
        </ChatSection>
      </SettingSection>
    </WaitingContainer>
  );
}

const WaitingContainer = styled.div`
  ${tw`w-[75%]`}
`;
const WaitingListSection = styled.section`
  ${tw`flex gap-5 mt-10 min-h-[250px]`}
`;
const SettingSection = styled.section`
  ${tw`flex gap-5 mt-10 min-h-[250px]`}
`;
const ChatSection = styled.section`
  ${tw`w-[50%] `}
`;
const BtnBox = styled.div`
  ${tw`flex gap-5 mt-5`}
`;
const StartButton = styled.button`
  ${tw`border rounded-xl w-[50%] min-h-[50px] flex justify-center items-center text-white text-xl font-bold transition-colors`}
  ${({ disabled }) => (disabled ? tw`bg-primary hover:bg-none` : tw`bg-primary hover:bg-dprimary`)}
`;
const BackButton = styled(Link)`
  ${tw`border rounded-xl w-[50%] min-h-[50px] flex justify-center items-center text-white text-xl font-bold transition-colors`}
`;
