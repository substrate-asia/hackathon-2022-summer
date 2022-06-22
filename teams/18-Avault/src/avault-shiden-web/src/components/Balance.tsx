import React, { useEffect, useRef } from 'react';
import CountUp from 'react-countup';
import { Text, TextProps } from '@my/ui';

interface BalanceProps extends TextProps {
  value: number;
  decimals?: number;
  unit?: string;
  isDisabled?: boolean;
  prefix?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const Balance: React.FC<BalanceProps> = ({
  value,
  color = 'text',
  decimals = 3,
  isDisabled = false,
  unit,
  prefix,
  onClick,
  ...props
}) => {
  const previousValue = useRef(0);

  useEffect(() => {
    previousValue.current = value;
  }, [value]);
  return (
    <Text color={isDisabled ? 'textDisabled' : color} onClick={onClick} {...props}>
      <CountUp
        useEasing={true}
        // formattingFn={(d: number) =>
        //   `${Number(
        //     `${new BigNumber(`${previousValue.current}`).toFixed(decimals, BigNumber.ROUND_DOWN)}`,
        //   ).toLocaleString('en-US', {
        //     maximumFractionDigits: decimals,
        //   })}`
        // }
        start={previousValue.current}
        end={value === null ? 0 : value}
        prefix={prefix}
        suffix={unit}
        decimals={decimals}
        duration={2}
        separator=","
      />
    </Text>
  );
};

export default Balance;
