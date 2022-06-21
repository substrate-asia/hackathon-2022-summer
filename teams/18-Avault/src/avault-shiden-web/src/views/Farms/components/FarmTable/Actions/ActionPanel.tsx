import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from 'contexts/Localization';
import { LinkExternal } from '@my/ui';
import { getAddress } from 'utils/addressHelpers';
import { getBscScanLink } from 'utils';
// import { CommunityTag, CoreTag, DualTag } from 'components/Tags';

import HarvestAction from './HarvestAction';
import StakedAction from './StakedAction';
import { AprProps } from '../Apr';
import { MultiplierProps } from '../Multiplier';
import { LiquidityProps } from '../Liquidity';
import BigNumber from 'bignumber.js';
import { BIG_ZERO } from 'utils/bigNumber';
import { getBalanceAmount } from 'utils/formatBalance';
import { getDisplayApr } from 'views/Farms/Farms';
import { InfoContainer } from 'style/TableStyled';
import { FarmWithStakedValue } from '../FarmTable';
import { chainId } from 'config/constants/tokens';

export interface ActionPanelProps {
  apr: AprProps;
  multiplier: MultiplierProps;
  liquidity: LiquidityProps;
  details: FarmWithStakedValue;
  userDataReady: boolean;
  expanded: boolean;
}

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 500px;
  }
`;

const collapseAnimation = keyframes`
  from {
    max-height: 500px;
  }
  to {
    max-height: 0px;
  }
`;

const Container = styled.div<{ expanded }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: unset;
  display: flex;
  flex-direction: column;
  margin: -44px 16px 20px;
  // border-radius: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    overflow: hidden;
    margin: 0;
    background-color: ${({ theme }) => theme.colors.background02};
    // padding: 24px;
    padding: 24px 64px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`;

const StyledLinkExternal = styled(LinkExternal)`
  color: ${({ theme }) => theme.colors.primaryDark};
  font-weight: 600;
  font-size: 12px;
  svg {
    path {
      fill: ${({ theme }) => theme.colors.primaryDark};
    }
    width: 14px;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-flow: row wrap;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-flow: row nowrap;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
  }
`;

const DetailContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 8px 16px;
  margin-top: 12px;
  p {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${({ theme }) => theme.colors.textSubtle};
    font-size: 12px;
    font-weight: 600;
    padding: 6px 0;
  }
  i {
    font-style: normal;
    color: ${({ theme }) => theme.colors.text};
    &.green {
      font-size: 14px;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.success};
    }
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    display: none;
  }
`;

const ActionPanel: React.FunctionComponent<ActionPanelProps> = ({
  details,
  apr,
  multiplier,
  liquidity,
  userDataReady,
  expanded,
}) => {
  const farm = details;

  const { t } = useTranslation();
  const lpAddress = getAddress(farm.lpAddresses);

  const earningsBigNumber = new BigNumber(farm.userData.earnings);
  let earnings = BIG_ZERO;
  // let earningsBusd = 0;
  let displayBalance: string = userDataReady
    ? earnings.toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 })
    : '';

  // If user didn't connect wallet default balance will be 0
  if (!earningsBigNumber.isZero()) {
    earnings = getBalanceAmount(earningsBigNumber);
    // earningsBusd = earnings.multipliedBy(cakePrice).toNumber();
    displayBalance = Number(earnings.toFixed(8, BigNumber.ROUND_DOWN)).toLocaleString('en-US', {
      maximumFractionDigits: 8,
    });
  }
  return (
    <Container expanded={expanded}>
      <InfoContainer>
        <StyledLinkExternal href={getBscScanLink(lpAddress, 'address')}>{t('View Contract')}</StyledLinkExternal>
      </InfoContainer>
      <DetailContainer>
        <p>
          TVL
          <i>{farm?.liquidity ? Number(farm.liquidity).toLocaleString('en-US', { maximumFractionDigits: 2 }) : ''}</i>
        </p>
        <p>
          APR<i className="green">{farm?.apr ? getDisplayApr(farm.apr) + '%' : ''}</i>
        </p>
        <p>
          Rewards<i>{displayBalance}</i>
        </p>
      </DetailContainer>
      <ActionContainer style={{ justifyContent: 'end' }}>
        <HarvestAction
          {...farm}
          lpMasterChef={farm.lpMasterChefes[chainId]}
          displayBalance={displayBalance}
          earnings={earnings}
          userDataReady={userDataReady}
        />
        <div className="w20"></div>
        <StakedAction farm={farm} userDataReady={userDataReady} />
      </ActionContainer>
    </Container>
  );
};

export default ActionPanel;
