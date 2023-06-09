import { Avatar } from '@material-tailwind/react';
import { React, useState } from 'react';
import { useDispatch } from 'react-redux';
import tw, { styled } from 'twin.macro';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { acceptInviteRequestApi } from '../../../apis/friendApi';
import { setCaptainName, setWaitRoomId, setMemberCount, setWaiterList } from '../../../store/roominfo/WaitRoom.reducer';

export default function IncomingInviteRequest({ friendInv, handleDelete }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(true);

  const acceptInvRequest = async () => {
    const res = await acceptInviteRequestApi(friendInv.roomId);
    if (res && res.status === 200) {
      setIsVisible(false);
      console.log('roomInfo in IncomingInv', res);
      setIsVisible(false);
      dispatch(setWaitRoomId(res.data.roomId));
      dispatch(setCaptainName(res.data.captainName));
      dispatch(setMemberCount(res.data.memberCount));
      dispatch(setWaiterList(res.data.waiterList));
      Swal.fire({
        title: `방에 입장하였습니다.`,
        timer: 1000,
        showConfirmButton: false,
      });
      setTimeout(() => {
        navigate('/waiting');
      }, 100);
    }
  };
  const declineRequest = () => {
    setIsVisible(false);
    handleDelete(false);
  };
  return (
    isVisible && (
      <RequestContainer>
        <Avatar
          size="md"
          variant="circular"
          src={`profile_pics/${friendInv.profileIcon}.jpg`}
          className="my-auto border-2 border-negative "
        />
        <RequestBox>
          <RequestNickname>{friendInv.nickname}</RequestNickname>
          <ButtonsContainer>
            <AcceptButton onClick={acceptInvRequest}>수락</AcceptButton>
            <DeclineButton onClick={declineRequest}>거절</DeclineButton>
          </ButtonsContainer>
        </RequestBox>
      </RequestContainer>
    )
  );
}

const RequestContainer = styled.div`
  ${tw`flex py-2 pl-2 `}
`;

const RequestBox = styled.div`
  ${tw`w-[100%]`}
`;

const RequestNickname = styled.div`
  ${tw`text-lg my-auto ml-3`}
`;

const ButtonsContainer = styled.div`
  ${tw`flex ml-5 gap-4 mt-1`}
`;

const AcceptButton = styled.button`
  ${tw`text-white bg-primary hover:bg-dprimary focus:ring-4 focus:outline-none focus:ring-cyan-100 font-bold rounded-lg px-2 py-1 text-center my-auto`}
`;

const DeclineButton = styled.button`
  ${tw`text-white bg-negative hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-100 font-bold rounded-lg px-2 py-1 text-center my-auto`}
`;
