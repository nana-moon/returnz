import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar } from '@material-tailwind/react';
import tw, { styled } from 'twin.macro';
import Cookies from 'js-cookie';
import { handleModalState } from '../../store/profileeditmodal/ProfileEdit.reducer';
import { getPossibleProfile } from '../../apis/userApi';

export default function ProfileEditModal() {
  const dispatch = useDispatch();
  const myPic = Cookies.get('profileIcon');
  const myNick = Cookies.get('nickname');
  const picPath = `profile_pics/${myPic}.jpg`;
  const [possibleProfiles, setPossibleProfiles] = useState([]);
  const handleModal = () => {
    dispatch(handleModalState(false));
  };
  useEffect(() => {
    async function fetchData() {
      const res = await getPossibleProfile();
      console.log(res, '프사리스트');
      setPossibleProfiles(res);
    }
    fetchData();
  }, []);
  return (
    <ProfileEditContainer>
      <BackgroundContainer>gg</BackgroundContainer>
      <ModalSection>
        <MyInfoSection>
          <Avatar size="xxl" variant="circular" src={picPath} className=" border-2 border-negative" />
        </MyInfoSection>
        <UserNameContainer>{myNick}</UserNameContainer>
        <EncourageMessage>총 12개의 프로필 사진을 해금해보세요</EncourageMessage>
        <PicturesContainer>
          {possibleProfiles.map((pic) => {
            return (
              <Avatar
                size="xl"
                variant="circular"
                className="border-2 border-negative"
                src={`profile_pics/${pic}.jpg`}
              />
            );
          })}
        </PicturesContainer>
        <ButtonsSection>
          <CompleteButton>저장하기</CompleteButton>
          <BackButton onClick={handleModal}>나가기</BackButton>
        </ButtonsSection>
      </ModalSection>
    </ProfileEditContainer>
  );
}

const ProfileEditContainer = styled.div`
  ${tw`font-spoq relative w-[100%]`}
`;

const BackgroundContainer = styled.div`
  position: fixed;
  z-index: 3;
  ${tw`bg-black opacity-20 font-spoq h-screen w-[100%]`}
`;

const ModalSection = styled.div`
  position: fixed;
  top: 10%;
  left: 20%;
  z-index: 4;
  ${tw`bg-white h-[75%] w-[50%] rounded-xl border-2 border-negative p-10`}
`;
const MyInfoSection = styled.div`
  ${tw`flex justify-center mb-2`}
`;
const EncourageMessage = styled.div`
  ${tw`text-center font-bold mb-4 mt-6`}
`;
const UserNameContainer = styled.div`
  ${tw`text-xl text-center`}
`;

const PicturesContainer = styled.div`
  ${tw`grid grid-cols-6 grid-rows-2 gap-4`}
`;

const ButtonsSection = styled.div`
  ${tw`flex justify-center gap-20 mt-10`}
`;
const CompleteButton = styled.div`
  ${tw`text-white bg-primary border-4 border-primary hover:bg-dprimary focus:border-dprimary font-bold text-xl rounded-lg px-6 py-3.5 text-center`}
`;
const BackButton = styled.button`
  ${tw`text-primary bg-white border-4 border-primary hover:bg-cyan-100 focus:border-dprimary font-bold text-xl rounded-lg px-8 py-3.5 text-center`}
`;
