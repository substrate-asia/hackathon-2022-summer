import React from 'react';
import styled from 'styled-components';
// import ApyButton from 'views/Farms/components/FarmCard/ApyButton';
import { Address } from 'config/constants/types';
import BigNumber from 'bignumber.js';
// import { BASE_ADD_LIQUIDITY_URL } from 'config';
// import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts';
import { Skeleton } from '@my/ui';

export interface AprProps {
  apr: string;
  apy: string;
  multiplier: string;
  lpLabel: string;
  tokenAddress?: Address;
  quoteTokenAddress?: Address;
  cakePrice: BigNumber;
  originalValue: number;
  hideButton?: boolean;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};

  button {
    width: 20px;
    height: 20px;

    svg {
      path {
        fill: ${({ theme }) => theme.colors.textSubtle};
      }
    }
  }
`;

const AprWrapper = styled.div`
  min-width: 60px;
  text-align: left;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 600;
`;

const Apr: React.FC<AprProps> = ({ apr, originalValue }) => {
  // const tooltipContent = <div>APR: {apr}%</div>;
  // const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
  //   placement: 'top-end',
  //   tooltipOffset: [20, 10],
  // });
  // const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAddress, tokenAddress });
  // const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`;
  return originalValue !== 0 ? (
    <Container>
      {originalValue ? (
        <>
          <AprWrapper>{apr}%</AprWrapper>
          {/* <ReferenceElement ref={targetRef}>
            <HelpIcon color="textSubtle" />
          </ReferenceElement>
          {tooltipVisible && tooltip} */}
          {/* {!hideButton && (
            <ApyButton
              lpLabel={lpLabel}
              cakePrice={cakePrice}
              apr={originalValue}
              displayApr={value}
              addLiquidityUrl={addLiquidityUrl}
            />
          )} */}
        </>
      ) : (
        <AprWrapper>
          <Skeleton width={60} />
        </AprWrapper>
      )}
    </Container>
  ) : (
    <Container>
      <AprWrapper>{originalValue}%</AprWrapper>
      {/* <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement> */}
      {/* {tooltipVisible && tooltip} */}
    </Container>
  );
};

export default Apr;
