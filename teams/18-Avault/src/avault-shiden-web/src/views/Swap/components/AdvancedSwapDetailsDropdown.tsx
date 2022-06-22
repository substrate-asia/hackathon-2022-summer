import React from 'react';
import styled from 'styled-components';
import useLastTruthy from 'hooks/useLast';
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails';

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  margin-top: ${({ show }) => (show ? '16px' : 0)};

  width: 100%;
  /* background-color: ${({ theme }) => theme.colors.invertedContrast}; */

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;

  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;

  padding: 12px;
  font-size: 12px;
  color: #9da6a6;
`;

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade);

  return (
    <AdvancedDetailsFooter show={Boolean(trade)}>
      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </AdvancedDetailsFooter>
  );
}
