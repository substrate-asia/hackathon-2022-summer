import React from 'react';
import { Button, Text, useModal, Flex, TooltipText, useTooltip, Skeleton, Heading } from '@my/ui';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { getCakeVaultEarnings } from 'views/Pools/helpers';
import { PoolCategory } from 'config/constants/types';
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance';
import { useTranslation } from 'contexts/Localization';
import Balance from 'components/Balance';
import { useCakeVault } from 'state/pools/hooks';
import { BIG_ZERO } from 'utils/bigNumber';
import { Pool } from 'state/types';

import { ActionContainer, ActionTitles, ActionContent } from './styles';
import CollectModal from '../../PoolCard/Modals/CollectModal';
import UnstakingFeeCountdownRow from '../../CakeVaultCard/UnstakingFeeCountdownRow';

interface HarvestActionProps extends Pool {
  userDataReady: boolean;
}

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({
  sousId,
  poolCategory,
  earningToken,
  userData,
  userDataReady,
  isAutoVault,
  earningTokenPrice,
}) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();

  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO;
  // These will be reassigned later if its Auto KAC vault
  let earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals);
  let earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals);
  let hasEarnings = earnings.gt(0);
  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals);
  const formattedBalance = formatNumber(earningTokenBalance, 3, 3);
  const isCompoundPool = sousId === 0;
  const isBnbPool = poolCategory === PoolCategory.BINANCE;

  // Auto KAC vault calculations
  const {
    userData: { cakeAtLastUserAction, userShares },
    pricePerFullShare,
    fees: { performanceFee },
  } = useCakeVault();
  const { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
    account,
    cakeAtLastUserAction,
    userShares,
    pricePerFullShare,
    earningTokenPrice,
  );

  earningTokenBalance = isAutoVault ? autoCakeToDisplay : earningTokenBalance;
  hasEarnings = isAutoVault ? hasAutoEarnings : hasEarnings;
  earningTokenDollarBalance = isAutoVault ? autoUsdToDisplay : earningTokenDollarBalance;

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      earningToken={earningToken}
      earningsDollarValue={earningTokenDollarBalance}
      sousId={sousId}
      isBnbPool={isBnbPool}
      isCompoundPool={isCompoundPool}
    />,
  );

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Subtracted automatically from each yield harvest and burned.'),
    { placement: 'bottom-start' },
  );

  const actionTitle = isAutoVault ? (
    <Text fontSize="12px" fontWeight="600" color="secondary" as="span" textTransform="uppercase">
      {t('Recent KAC profit')}
    </Text>
  ) : (
    <>
      <Text fontSize="12px" fontWeight="bolder" color="primary" as="span" textTransform="uppercase">
        {earningToken.symbol}{' '}
      </Text>
      <Text fontSize="12px" fontWeight="600" color="textSubtle" as="span" textTransform="uppercase">
        {t('Earned')}
      </Text>
    </>
  );

  if (!account) {
    return (
      <ActionContainer style={{ maxWidth: '380px' }}>
        <ActionTitles>
          {actionTitle}
          <Heading style={{ marginTop: '4px' }}>0</Heading>
        </ActionTitles>

        <ActionContent>
          <Button disabled>{isCompoundPool ? t('Collect') : t('Harvest')}</Button>
        </ActionContent>
      </ActionContainer>
    );
  }

  if (!userDataReady) {
    return (
      <ActionContainer style={{ maxWidth: '380px' }}>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    );
  }

  return (
    <ActionContainer style={{ maxWidth: '380px' }}>
      <ActionTitles>
        <div>{actionTitle}</div>
        <>
          {hasEarnings ? (
            <>
              <Balance
                mt="16px"
                mb="4px"
                lineHeight="1"
                bold
                fontSize="20px"
                decimals={5}
                value={earningTokenBalance}
              />
              {earningTokenPrice > 0 && (
                <Balance
                  display="inline"
                  fontSize="12px"
                  color="textSubtle"
                  decimals={2}
                  prefix="~"
                  value={earningTokenDollarBalance}
                  unit=" USD"
                />
              )}
            </>
          ) : (
            <>
              <Heading mt="16px" mb="4px" color="textDisabled">
                0
              </Heading>
              <Text fontSize="12px" color="textDisabled">
                ~0 USD
              </Text>
            </>
          )}
        </>
      </ActionTitles>
      <ActionContent>
        {isAutoVault ? (
          <Flex flex="1.3" flexDirection="column" alignSelf="flex-start" alignItems="flex-start">
            <UnstakingFeeCountdownRow isTableVariant />
            <Flex mb="2px" justifyContent="space-between" alignItems="center">
              {tooltipVisible && tooltip}
              <TooltipText ref={targetRef} small>
                {t('Performance Fee')}
              </TooltipText>
              <Flex alignItems="center">
                <Text ml="4px" small>
                  {performanceFee / 100}%
                </Text>
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <Button disabled={!hasEarnings} onClick={onPresentCollect}>
            {isCompoundPool ? t('Collect') : t('Harvest')}
          </Button>
        )}
      </ActionContent>
    </ActionContainer>
  );
};

export default HarvestAction;
