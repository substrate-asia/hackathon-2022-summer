import React from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { Text, useMatchBreakpoints } from '@my/ui';
import { useTranslation } from 'contexts/Localization';
import { useCakeVault } from 'state/pools/hooks';
import { Pool } from 'state/types';
import { BIG_ZERO } from 'utils/bigNumber';
import { TokenPairImage } from 'components/TokenImage';
import CakeVaultTokenPairImage from '../../CakeVaultCard/CakeVaultTokenPairImage';
import { CellContent } from './BaseCell';
import { chainId } from 'config/constants/tokens';

interface NameCellProps {
  pool: Pool;
}
const Container = styled.div`
  padding-left: 16px;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 40px;
  }

  > div {
    > .label {
      font-size: 16px;
      font-weight: bolder;
      color: #181733;
    }
    > .ratio {
      margin-top: 11px;
      font-size: 14px;
      color: #9da6a6;
    }
  }
`;

const TokenWrapper = styled.div`
  padding-right: 16px;
  width: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 60px;
  }
`;

const NameCell: React.FC<NameCellProps> = ({ pool }) => {
  const { t } = useTranslation();
  const { isXs, isSm } = useMatchBreakpoints();
  const { sousId, stakingToken, earningToken, userData, isFinished, isAutoVault } = pool;
  const {
    userData: { userShares },
  } = useCakeVault();
  const hasVaultShares = userShares && userShares.gt(0);

  const stakingTokenSymbol = stakingToken.symbol;
  const earningTokenSymbol = earningToken.symbol;

  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO;
  const isStaked = stakedBalance.gt(0);
  const isManualCakePool = sousId === 0;

  const showStakedTag = isAutoVault ? hasVaultShares : isStaked;

  let title = `${t('Earn')} ${earningTokenSymbol}`;
  let subtitle = `${t('Stake')} ${stakingTokenSymbol}`;
  const showSubtitle = sousId !== 0 || (sousId === 0 && !isXs && !isSm);

  if (isAutoVault) {
    title = t('Auto KAC');
    subtitle = t('Automatic restaking');
  } else if (isManualCakePool) {
    title = t('Earn KAC');
    subtitle = `${t('Stake').toLocaleLowerCase()} KAC ${t('Earn')} KAC`;
  }

  return (
    <Container>
      <TokenWrapper>
        {isAutoVault ? (
          <CakeVaultTokenPairImage width={60} height={60} />
        ) : (
          <TokenPairImage
            primaryToken={earningToken[chainId]}
            secondaryToken={stakingToken[chainId]}
            width={60}
            height={60}
          />
        )}
      </TokenWrapper>
      <CellContent>
        {showStakedTag && (
          <Text fontSize="12px" bold color={isFinished ? 'failure' : 'secondary'} textTransform="uppercase">
            {t('Staked')}
          </Text>
        )}
        <div className="label">{title}</div>
        {showSubtitle && <div className="ratio">{subtitle}</div>}
      </CellContent>
    </Container>
  );
};

export default NameCell;
