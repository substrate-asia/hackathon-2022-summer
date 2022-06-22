import React from 'react';
import styled from 'styled-components';
// import ApyButton from 'views/Farms/components/FarmCard/ApyButton';
import BigNumber from 'bignumber.js';
// import { BASE_ADD_LIQUIDITY_URL } from 'config';
// import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts';
import { HelpIcon, Skeleton, useTooltip } from '@my/ui';
import { IFarmProject } from 'state/vault/types';

export interface AprProps {
  apr: string;
  apy: string;
  multiplier: string;
  lpLabel: string;
  token0Address?: string;
  token1Address?: string;
  cakePrice: BigNumber;
  originalValue: number;
  hideButton?: boolean;
  vaultSymbol: string;
  fromSource?: IFarmProject;
}

const Container = styled.div`
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
const ReferenceElement = styled.div`
  display: inline-block;
  padding-left: 5px;
`;

const AprWrapper = styled.div`
  min-width: 60px;
  text-align: left;
  color: ${({ theme }) => theme.colors.success};
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 3px;
`;
const PStyled = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
`;
const Apr: React.FC<AprProps> = ({ apy, originalValue, fromSource, vaultSymbol, lpLabel }) => {
  const tooltipContent = <div>APY: {apy}%</div>;
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  });
  // const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAddress, tokenAddress });
  // const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`;
  return originalValue !== 0 ? (
    <Container>
      {originalValue ? (
        <>
          <AprWrapper>{apy}%</AprWrapper>
          <PStyled>
            {/* {vaultSymbol} */}
            Avault APR: 0.00%
          </PStyled>
          <PStyled>
            {fromSource} APY: {apy}%
          </PStyled>
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
          <Skeleton width={40} height={16} />
          <Skeleton width={60} height={13} marginTop="6px" />
          <Skeleton width={60} height={13} marginTop="3px" />
        </AprWrapper>
      )}
    </Container>
  ) : (
    <Container>
      <AprWrapper>{originalValue}%</AprWrapper>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </Container>
  );
};

export default Apr;
