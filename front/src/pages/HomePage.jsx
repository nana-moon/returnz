import React from 'react';
import tw, { styled } from 'twin.macro';
import { Avatar } from '@material-tailwind/react';
// import TodayNews from '../components/main/TodayNews';
import TodayPrice from '../components/main/TodayPrice';
import TodayTopUser from '../components/main/TodayTopUser';
import TopButtons from '../components/main/TopButtons';
import TodayWord from '../components/main/TodayWord';

export default function HomePage() {
  return (
    <MainContainer>
      <PriceSection>
        <TodayPrice />
      </PriceSection>
      <ButtonsSection>
        <TopButtons />
      </ButtonsSection>
      <div className="grid grid-cols-4 grid-rows-6 gap-8">
        <TopUsersSection>
          <TodayTopUser />
        </TopUsersSection>
        <RecommendedSection>
          <TestBox>
            <Avatar size="lg" variant="circular" src="profile_pics/F.jpg" />
          </TestBox>
          <TestBox>
            <Avatar size="lg" variant="circular" src="profile_pics/F.jpg" />
          </TestBox>
          <TestBox>
            <Avatar size="lg" variant="circular" src="profile_pics/F.jpg" />
          </TestBox>
          <TestBox>
            <Avatar size="lg" variant="circular" src="profile_pics/F.jpg" />
          </TestBox>
        </RecommendedSection>
        {/* <InfoSection>
          <TodayNews />
        </InfoSection> */}
        <InfoSection>
          <TodayWord />
        </InfoSection>
      </div>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  ${tw`w-[75%] font-spoq`}
`;
const PriceSection = styled.div`
  height: 56px;
  ${tw`mt-4`}
`;

const ButtonsSection = styled.div`
  ${tw`my-10`}
`;
const RecommendedSection = styled.div`
  height: 56px;
  ${tw`col-span-1 mt-16`}
`;
const TestBox = styled.div`
  ${tw`bg-white border-2 border-negative rounded-lg`}
`;

const TopUsersSection = styled.div`
  ${tw`row-span-6 col-span-3`}
`;

const InfoSection = styled.div`
  ${tw`col-span-1`}
`;
