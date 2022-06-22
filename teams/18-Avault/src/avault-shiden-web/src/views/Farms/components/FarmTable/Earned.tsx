import React from 'react';
import styled from 'styled-components';
import { Skeleton } from '@my/ui';

export interface EarnedProps {
  earnings: number;
  pid: number;
}

interface EarnedPropsWithLoading extends EarnedProps {
  userDataReady: boolean;
}

const Amount = styled.span<{ earned: number }>`
  /* color: ${({ earned, theme }) => (earned ? theme.colors.text : theme.colors.textDisabled)}; */
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
`;

const Earned: React.FunctionComponent<EarnedPropsWithLoading> = ({ earnings, userDataReady }) => {
  if (userDataReady) {
    return <Amount earned={earnings}>{earnings.toLocaleString('en-US', { maximumFractionDigits: 2 })}</Amount>;
  }
  return (
    <Amount earned={0}>
      <Skeleton width={60} />
    </Amount>
  );
};

export default Earned;
