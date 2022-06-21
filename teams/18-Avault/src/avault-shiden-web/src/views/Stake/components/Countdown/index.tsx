import useNextEventCountdown from 'components/CountdownTimer/useNextEventCountdown';
import React from 'react';
import getTimePeriods from 'utils/getTimePeriods';
import Timer from './Timer';

interface CountdownProps {
  nextEventTime: number;
}

const Countdown: React.FC<CountdownProps> = ({ nextEventTime }) => {
  const secondsRemaining = useNextEventCountdown(nextEventTime);
  const { days, hours, minutes, seconds } = getTimePeriods(secondsRemaining);

  return (
    <>
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
    </>
  );
};

export default Countdown;
