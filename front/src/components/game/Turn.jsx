import React, { useEffect, useState } from 'react';
import { keyframes } from 'styled-components';
import tw, { styled } from 'twin.macro';
import { useSelector } from 'react-redux';
import { Popover, PopoverHandler, PopoverContent, Button } from '@material-tailwind/react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import imgpath from './assets/turnHelp.png';
import { gameTurn } from '../../store/gamedata/GameData.selector';

export default function Turn() {
  const [time, setTime] = useState(60);
  const turn = useSelector(gameTurn);
  const [animationClass, setAnimationClass] = useState('animate');
  // console.log('현재 턴은:', turn);

  useEffect(() => {
    setAnimationClass(''); // 애니메이션 클래스를 제거합니다.
    setTimeout(() => {
      setAnimationClass('animate'); // 애니메이션 클래스를 다시 추가합니다.
    }, 10);
  }, [turn]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     const copy = time;
  //     if (copy > 0) {
  //       setTime(copy - 1);
  //     }
  //   }, 1000);
  //   return () => {
  //     setTime(60);
  //   };
  // }, [turn]);

  useEffect(() => {
    setTime(60);
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [turn]);

  const Icon = [];

  for (let i = 0; i < turn.maxTurn; i += 1) {
    Icon.push(<TurnIcon index={i} num={turn.nowTurn} />);
  }
  return (
    <TurnContanier>
      <CountSection>
        {Icon}
        <div className="absolute top-1 right-4">
          <Popover
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 25 },
            }}
            placement="left-start"
          >
            <PopoverHandler>
              <Button variant="gradient" color="white" size="sm" className="border border-negative">
                ?
              </Button>
            </PopoverHandler>
            <PopoverContent className="z-20 w-[40%] border-gray-400 shadow-xl shadow-gray-600">
              <img src={imgpath} alt="" />
            </PopoverContent>
          </Popover>
        </div>
      </CountSection>
      <BarSection turn={turn} key={turn.nowTurn} className={`bar ${animationClass}`}>
        {' '}
      </BarSection>
      {time > 0 && <TimeSection> 🕒 {time} </TimeSection>}
      {/* <Progress label="남은시간" value={88} color="cyan" /> */}
    </TurnContanier>
  );
}

const shake = keyframes`
  0% {
    transform: translateY(0px);
  }
  25% {
    transform: translateY(-4px);
  }
  50% {
    transform: translateY(0px);
  }
  75% {
    transform: translateY(-4px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const BarTimer = keyframes`
  0% {
    ${tw`w-[100%] bg-primary`}
  }
  79.9%{
    ${tw`bg-primary`}
  }
  80% {
    ${tw`bg-gain`}
  }
  100% {
    ${tw`w-[0%] bg-gain`}
  }
`;

const BarTimerText = keyframes`
  0% {
    ${tw`text-black`}
  }
  79.9%{
    ${tw`text-black`}
  }
  80% {
    ${tw`text-gain`}
  }
  100% {
    ${tw`text-gain`}
  }
`;

const BarSection = styled.div`
  animation: ${BarTimer} 60s, ${shake} 0.3s 40 48s;
  animation-fill-mode: forwards;
  animation-timing-function: linear;
  ${tw`w-[100%] bg-primary rounded-full absolute bottom-0 text-center h-6`}
`;

const TurnContanier = styled.div`
  ${tw`border bg-white rounded-xl h-[8%] relative`}
`;

const CountSection = styled.div`
  ${tw`flex w-[90%] items-center h-[70%] mx-10 justify-center`}
`;

const TimeSection = styled.div`
  animation: ${BarTimerText} 60s, ${shake} 0.3s 40 48s;
  animation-fill-mode: none;
  animation-timing-function: linear;
  ${tw`absolute bottom-0 text-center w-[100%] bg-transparent`}
`;

const TurnIcon = styled(AiOutlineCheckCircle)`
  color: ${(props) => (props.index < props.num ? 'green' : 'black')};
  font-size: ${(props) => (props.index === props.num ? '32px' : '20px')};
  ${tw`mx-1`};
`;
