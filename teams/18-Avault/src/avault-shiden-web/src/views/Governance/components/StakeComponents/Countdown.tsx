import React from 'react';
import getTimePeriods from 'utils/getTimePeriods';
import { ILockAVATModalState, ILockedState } from 'views/Governance/state/governance/types';
import styled from 'styled-components';
import { Button } from '@my/ui';
import Timer from 'components/CountdownTimer/Timer';
import useNextEventCountdown from 'components/CountdownTimer/useNextEventCountdown';

interface IProps {
  nextEventTime: number;
  lockedState: ILockedState;
  onClickModal: any;
}

const Countdown: React.FC<IProps> = ({ nextEventTime, lockedState, onClickModal }: IProps) => {
  // 15000000000 s
  const secondsRemaining = useNextEventCountdown(nextEventTime);
  const { days, hours, minutes, seconds } = getTimePeriods(secondsRemaining);
  // console.log({ secondsRemaining, nextEventTime });
  return (
    <TimerComponentsStyled>
      {secondsRemaining ? (
        <Timer
          minutes={minutes} // We don't show seconds - so values from 0 - 59s should be shown as 1 min
          hours={hours}
          days={days}
          seconds={seconds}
        />
      ) : (
        <Timer
          minutes={0} // We don't show seconds - so values from 0 - 59s should be shown as 1 min
          hours={0}
          days={0}
          seconds={0}
        />
      )}
      <h3 className="TimerComponents_title">Remaining Locked time</h3>
      {lockedState !== ILockedState.init ? (
        <Button className="btn" onClick={() => onClickModal(ILockAVATModalState.CHANGELOCKTIME)}>
          Extend lock time
        </Button>
      ) : null}
    </TimerComponentsStyled>
  );
};
const TimerComponentsStyled = styled.div`
  border-radius: 20px;
  text-align: center;
  max-width: 300px;
  margin: 0 auto;

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 100%;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    border: 1px solid #2e2d5b;
    padding: 30px 60px;
  }
  .TimerComponents_title {
    padding-top: 24px;
    font-size: 15px;
    ${({ theme }) => theme.mediaQueries.lg} {
      padding-top: 25px;
      font-size: 20px;
    }
  }
  .btn {
    font-weight: 500;
    font-size: 12px;
    color: #cc64f2;
    margin-top: 16px;
    height: 30px;
    background: #25234c;
    border-radius: 12px;
  }
`;
export default Countdown;
