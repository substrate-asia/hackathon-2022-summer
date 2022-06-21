import React from 'react';
import styled from 'styled-components';
import { Text, Skeleton } from '@my/ui';
// import { useTranslation } from 'contexts/Localization';

// const ReferenceElement = styled.div`
//   display: inline-block;
// `;

export interface LiquidityProps {
  liquidity: string;
  userDataReady: boolean;
}

const LiquidityWrapper = styled.div`
  font-weight: 600;
`;

const Container = styled.div`
  display: flex;
`;

const Liquidity: React.FunctionComponent<LiquidityProps> = ({ liquidity, userDataReady }) => {
  const displayLiquidity = userDataReady ? (
    `$${Number(liquidity ? (liquidity === 'NaN' ? '0' : liquidity) : '0').toLocaleString('en-US', {
      maximumFractionDigits: 8,
    })}`
  ) : (
    <Skeleton width={60} />
  );
  return (
    <Container>
      <LiquidityWrapper>
        <Text color="text" fontSize="16px" fontWeight="bold">
          {displayLiquidity}
        </Text>
      </LiquidityWrapper>
    </Container>
  );
};

export default Liquidity;
