import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
  HelpIcon,
  Link,
  LinkExternal,
  Skeleton,
  Text,
  TimerIcon,
  useTooltip,
  MetamaskIcon,
  Flex,
  Button,
} from '@my/ui';
import { BASE_BSC_SCAN_URL } from 'config';
import { getBscScanLink } from 'utils';
import { useBlock } from 'state/block/hooks';
import { useCakeVault } from 'state/pools/hooks';
import BigNumber from 'bignumber.js';
import { Pool } from 'state/types';
import { useTranslation } from 'contexts/Localization';
import Balance from 'components/Balance';
import { getAddress, getCakeVaultAddress } from 'utils/addressHelpers';
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance';
import { getPoolBlockInfo } from 'views/Pools/helpers';
import HarvestAction from './HarvestAction';
import StakedAction from './StakedAction';
import { registerToken } from 'utils/wallet';
import Apr from '../Apr';
import { InfoContainer } from 'style/TableStyled';

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 700px;
  }
`;

const collapseAnimation = keyframes`
  from {
    max-height: 700px;
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
  overflow: hidden;
  /* background: ${({ theme }) => theme.colors.background}; */
  background: #122124;
  display: flex;
  width: 100%;
  flex-direction: column-reverse;
  padding: 24px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 29px 39px;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
  }
`;

// add
const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`;

// const InfoContainer = styled.div`
//   min-width: 240px;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-around;
// `;
const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0px;
`;
const ValueContainer = styled.div`
  display: block;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: none;
  }
`;
const StakeContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  align-items: center;
  display: flex;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
  }
`;
const ReferenceElement = styled.div`
  display: inline-block;
  padding-left: 5px;
`;
type MediaBreakpoints = {
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
};

interface ActionPanelProps {
  account: string;
  pool: Pool;
  userDataReady: boolean;
  actionPanelExpanded: boolean;
  breakpoints: MediaBreakpoints;
}

const ActionPanel: React.FC<ActionPanelProps> = ({
  account,
  pool,
  userDataReady,
  actionPanelExpanded,
  breakpoints,
}) => {
  const {
    sousId,
    stakingToken,
    earningToken,
    totalStaked,
    startBlock,
    endBlock,
    stakingLimit,
    contractAddress,
    isAutoVault,
  } = pool;
  const { t } = useTranslation();
  const poolContractAddress = getAddress(contractAddress);
  const cakeVaultContractAddress = getCakeVaultAddress();
  const { currentBlock } = useBlock();
  const { isXs, isSm } = breakpoints;
  const showSubtitle = (isXs || isSm) && sousId === 0;

  const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
    getPoolBlockInfo(pool, currentBlock);

  const {
    totalCakeInVault,
    fees: { performanceFee },
  } = useCakeVault();

  const performanceFeeAsDecimal = performanceFee && performanceFee / 100;
  const isManualCakePool = sousId === 0;

  const getTotalStakedBalance = () => {
    if (isAutoVault) {
      return getBalanceNumber(totalCakeInVault, stakingToken.decimals);
    }
    if (isManualCakePool) {
      const manualCakeTotalMinusAutoVault = new BigNumber(totalStaked);
      return getBalanceNumber(manualCakeTotalMinusAutoVault, stakingToken.decimals);
    }
    return getBalanceNumber(totalStaked, stakingToken.decimals);
  };

  const {
    targetRef: totalStakedTargetRef,
    tooltip: totalStakedTooltip,
    tooltipVisible: totalStakedTooltipVisible,
  } = useTooltip(t('Total amount of %symbol% staked in this pool', { symbol: stakingToken.symbol }), {
    placement: 'bottom',
  });
  const isMetaMaskInScope = !!window.ethereum?.isMetaMask;
  const tokenAddress = earningToken.address ? getAddress(earningToken.address) : '';

  const blocksRow =
    blocksRemaining || blocksUntilStart ? (
      <>
        <Text>{hasPoolStarted ? t('Ends in') : t('Starts in')}:</Text>
        <Link external href={getBscScanLink(hasPoolStarted ? endBlock : startBlock, 'countdown')}>
          <Balance fontSize="16px" value={blocksToDisplay} decimals={0} color="primary" />
          <Text ml="4px" color="primary" textTransform="lowercase">
            {t('Blocks')}
          </Text>
          <TimerIcon ml="4px" color="primary" />
        </Link>
      </>
    ) : (
      <Skeleton width="56px" height="16px" />
    );
  return (
    <Container expanded={actionPanelExpanded}>
      <InfoContainer>
        {/* <StakeContainer>
          <StyledLinkExternal href={`https://pancakeswap.info/token/${getAddress(earningToken.address)}`}>
            {t('See Token Info')}
          </StyledLinkExternal>
        </StakeContainer> */}
        <StakeContainer>
          <StyledLinkExternal href={earningToken.projectLink}> {t('View Project Site')}</StyledLinkExternal>
        </StakeContainer>
        {poolContractAddress && (
          <StakeContainer>
            <StyledLinkExternal
              href={`${BASE_BSC_SCAN_URL}/address/${isAutoVault ? cakeVaultContractAddress : poolContractAddress}`}
            >
              {t('View Contract')}
            </StyledLinkExternal>
          </StakeContainer>
        )}
        {account && isMetaMaskInScope && tokenAddress && (
          <StakeContainer>
            {account && isMetaMaskInScope && tokenAddress && (
              <Flex mb="8px" justifyContent={['flex-end', 'flex-end', 'flex-start']}>
                <Button
                  variant="text"
                  p="0"
                  height="auto"
                  onClick={() => registerToken(tokenAddress, earningToken.symbol, earningToken.decimals)}
                >
                  <Text color="primary">{t('Add to Metamask')}</Text>
                  <MetamaskIcon ml="4px" />
                </Button>
              </Flex>
            )}
          </StakeContainer>
        )}
        {/* <Flex mb="8px" justifyContent={['flex-end', 'flex-end', 'flex-start']}>
          {isAutoVault ? <VaultPoolTag /> : <ManualPoolTag />}
          {tagTooltipVisible && tagTooltip}
          <ReferenceElement ref={tagTargetRef}>
            <HelpIcon color="textSubtle" />
          </ReferenceElement>
        </Flex> */}
      </InfoContainer>
      <ValueContainer>
        <ValueWrapper>
          <Text>{isAutoVault ? t('APY') : t('APR')}</Text>
          <Apr pool={pool} showIcon performanceFee={isAutoVault ? performanceFeeAsDecimal : 0} />
        </ValueWrapper>
        <ValueWrapper>
          <Text>{t('Max. stake per user')}</Text>
          <Text>{`${getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0)} ${stakingToken.symbol}`}</Text>
        </ValueWrapper>
        <ValueWrapper>
          <Text>{t('Total staked')}</Text>
          {totalStaked && totalStaked.gte(0) ? (
            <>
              <Balance fontSize="16px" value={getTotalStakedBalance()} decimals={0} unit={` ${stakingToken.symbol}`} />
              <ReferenceElement ref={totalStakedTargetRef}>
                <HelpIcon color="textSubtle" width="20px" ml="4px" />
              </ReferenceElement>
            </>
          ) : (
            <Skeleton width="56px" height="16px" />
          )}
          {totalStakedTooltipVisible && totalStakedTooltip}
        </ValueWrapper>
        <ValueWrapper>{shouldShowBlockCountdown && blocksRow}</ValueWrapper>
      </ValueContainer>
      <ActionContainer style={{ justifyContent: 'space-between' }}>
        {showSubtitle && (
          <Text mt="4px" mb="16px" color="textSubtle">
            {isAutoVault ? t('Automatic restaking') : `${t('Earn')} KAC ${t('Stake').toLocaleLowerCase()} KAC`}
          </Text>
        )}
        <HarvestAction {...pool} userDataReady={userDataReady} />
        <StakedAction pool={pool} userDataReady={userDataReady} />
      </ActionContainer>
    </Container>
  );
};

export default ActionPanel;
