import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Flex } from '@my/ui';

export interface TimerProps {
  showMonths?: boolean;
  months?: number;
  minutes?: number;
  hours?: number;
  days?: number;
  seconds?: number;
  bgColor?: string;
}

const StyledTimerText = styled.div<{ bgColor: string }>`
  width: 23%;
  padding: 20px 0;
  background-image: ${({ bgColor }) =>
    bgColor ? 'none' : 'radial-gradient(circle at 50% 0%, #3e255b 0%, #181733 100%)'};
  background-color: ${({ bgColor }) => (bgColor ? bgColor : 'transparent')};
  border: 4px solid #2e2d5b;
  box-shadow: 0 10px 20px 5px rgba(0, 0, 0, 0.03);
  border-radius: 20px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 20px 0 18px;
    margin: 0 5px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 30px 0 27px;
  }
  h2 {
    font-size: 24px;
    padding-bottom: 8px;
    font-weight: 600;
    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 30px;
    }
    ${({ theme }) => theme.mediaQueries.lg} {
      font-size: 36px;
      padding-bottom: 20px;
    }
  }
  h4 {
    font-size: 12px;
    color: #6a6991;
    ${({ theme }) => theme.mediaQueries.lg} {
      font-size: 15px;
    }
  }
`;
const FlexStyled = styled(Flex)`
  text-align: center;
  align-items: center;
  justify-content: space-between;
`;

const Timer: React.FC<TimerProps> = ({ minutes, hours, days, seconds, bgColor }) => {
  return useMemo(() => {
    return (
      <FlexStyled>
        {/* <MonthsComp showMonths={showMonths} months={months} bgColor={bgColor} /> */}
        <DaysComp days={days} bgColor={bgColor} />
        <HoursComp hours={hours} bgColor={bgColor} />
        <MinComp minutes={minutes} bgColor={bgColor} />
        <SecComp seconds={seconds} bgColor={bgColor} />
      </FlexStyled>
    );
  }, [days, hours, minutes, seconds, bgColor]);
};
// const MonthsComp = ({ showMonths, months, bgColor }) => {
//   return useMemo(() => {
//     return showMonths ? (
//       <StyledTimerText bgColor={bgColor}>
//         <h2>{months >= 10 ? months : `0${months}`}</h2>
//         <h4>Months</h4>
//       </StyledTimerText>
//     ) : null;
//   }, [showMonths, months, bgColor]);
// };
const DaysComp = ({ days, bgColor }) => {
  return useMemo(() => {
    return (
      <StyledTimerText bgColor={bgColor}>
        <h2>{days >= 10 ? days : `0${days}`}</h2>
        <h4>Days</h4>
      </StyledTimerText>
    );
  }, [days, bgColor]);
};
const HoursComp = ({ hours, bgColor }) => {
  return useMemo(() => {
    return (
      <StyledTimerText bgColor={bgColor}>
        <h2>{hours >= 10 ? hours : `0${hours}`}</h2>
        <h4>Hours</h4>
      </StyledTimerText>
    );
  }, [hours, bgColor]);
};
const MinComp = ({ minutes, bgColor }) => {
  return useMemo(() => {
    return (
      <StyledTimerText bgColor={bgColor}>
        <h2>{minutes >= 10 ? minutes : `0${minutes}`}</h2>
        <h4>Min</h4>
      </StyledTimerText>
    );
  }, [minutes, bgColor]);
};
const SecComp = ({ seconds, bgColor }) => {
  return useMemo(() => {
    return (
      <StyledTimerText bgColor={bgColor}>
        <h2>{seconds >= 10 ? seconds : `0${seconds}`}</h2>
        <h4>Sec</h4>
      </StyledTimerText>
    );
  }, [seconds, bgColor]);
};
export default Timer;
