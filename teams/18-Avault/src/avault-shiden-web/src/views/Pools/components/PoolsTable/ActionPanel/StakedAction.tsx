import React from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { Button, useModal, IconButton, Skeleton, useTooltip, Text } from '@my/ui';
import MinusIcon from './iocn_jianhao.png';
import AddIcon from './icon_jiahao.png';
import ConnectWalletButton from 'components/ConnectWalletButton';
import { useWeb3React } from '@web3-react/core';
import { useCakeVault } from 'state/pools/hooks';
import { Pool } from 'state/types';
import Balance from 'components/Balance';
import { useTranslation } from 'contexts/Localization';
import { getBalanceNumber } from 'utils/formatBalance';
import { PoolCategory } from 'config/constants/types';
import { BIG_ZERO } from 'utils/bigNumber';
import { getAddress } from 'utils/addressHelpers';
import { useERC20 } from 'hooks/useContract';
import { convertSharesToCake } from 'views/Pools/helpers';
import { ActionContainer, ActionTitles, ActionContent } from './styles';
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal';
import StakeModal from '../../PoolCard/Modals/StakeModal';
import VaultStakeModal from '../../CakeVaultCard/VaultStakeModal';
import { useCheckVaultApprovalStatus, useApprovePool, useVaultApprove } from '../../../hooks/useApprove';

const IconButtonWrapper = styled.div`
  display: flex;
`;
const StyledIconButton = styled(IconButton)`
  border: none;
`;

interface StackedActionProps {
  pool: Pool;
  userDataReady: boolean;
}

const Staked: React.FunctionComponent<StackedActionProps> = ({ pool, userDataReady }) => {
  const {
    sousId,
    stakingToken,
    earningToken,
    stakingLimit,
    isFinished,
    poolCategory,
    userData,
    stakingTokenPrice,
    isAutoVault,
  } = pool;
  const { t } = useTranslation();
  const { account } = useWeb3React();

  const stakingTokenContract = useERC20(stakingToken.address ? getAddress(stakingToken.address) : '');
  const { handleApprove: handlePoolApprove, requestedApproval: requestedPoolApproval } = useApprovePool(
    stakingTokenContract,
    sousId,
    earningToken.symbol,
  );

  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus();
  const { handleApprove: handleVaultApprove, requestedApproval: requestedVaultApproval } =
    useVaultApprove(setLastUpdated);

  const handleApprove = isAutoVault ? handleVaultApprove : handlePoolApprove;
  const requestedApproval = isAutoVault ? requestedVaultApproval : requestedPoolApproval;

  const isBnbPool = poolCategory === PoolCategory.BINANCE;
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO;
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO;
  const isNotVaultAndHasStake = !isAutoVault && stakedBalance.gt(0);

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO;

  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals);
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPrice),
    stakingToken.decimals,
  );

  const {
    userData: { userShares },
    pricePerFullShare,
  } = useCakeVault();

  const { cakeAsBigNumber, cakeAsNumberBalance } = convertSharesToCake(userShares, pricePerFullShare);
  const hasSharesStaked = userShares && userShares.gt(0);
  const isVaultWithShares = isAutoVault && hasSharesStaked;
  const stakedAutoDollarValue = getBalanceNumber(
    cakeAsBigNumber.multipliedBy(stakingTokenPrice),
    stakingToken.decimals,
  );

  const needsApproval = isAutoVault ? !isVaultApproved : !allowance.gt(0) && !isBnbPool;

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />);

  const [onPresentStake] = useModal(
    <StakeModal
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenBalance={stakingTokenBalance}
      stakingTokenPrice={stakingTokenPrice}
    />,
  );

  const [onPresentVaultStake] = useModal(<VaultStakeModal stakingMax={stakingTokenBalance} pool={pool} />);

  const [onPresentUnstake] = useModal(
    <StakeModal
      stakingTokenBalance={stakingTokenBalance}
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenPrice={stakingTokenPrice}
      isRemovingStake
    />,
  );

  const [onPresentVaultUnstake] = useModal(
    <VaultStakeModal stakingMax={cakeAsBigNumber} pool={pool} isRemovingStake />,
  );

  const onStake = () => {
    if (isAutoVault) {
      onPresentVaultStake();
    } else {
      onPresentStake();
    }
  };

  const onUnstake = () => {
    if (isAutoVault) {
      onPresentVaultUnstake();
    } else {
      onPresentUnstake();
    }
  };

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t("You've already staked the maximum amount you can stake in this pool!"),
    { placement: 'bottom' },
  );

  const reachStakingLimit = stakingLimit.gt(0) && userData.stakedBalance.gte(stakingLimit);

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ConnectWalletButton width="100%" />
        </ActionContent>
      </ActionContainer>
    );
  }

  if (!userDataReady) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    );
  }

  if (needsApproval) {
    return (
      // <ActionContainer>
      //   <ActionTitles>
      //     <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
      //       {t('Enable pool')}
      //     </Text>
      //   </ActionTitles>
      <ActionContent>
        <Button width="232px" disabled={requestedApproval} onClick={handleApprove} variant="secondary">
          {t('Enable')}
        </Button>
      </ActionContent>
      // </ActionContainer>
    );
  }

  // Wallet connected, user data loaded and approved
  if (isNotVaultAndHasStake || isVaultWithShares) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" fontWeight="bolder" color="primary" as="span" textTransform="uppercase">
            {stakingToken.symbol}{' '}
          </Text>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {isAutoVault ? t('Staked (vault)') : t('Staked')}
          </Text>
          <Balance
            mt="16px"
            mb="4px"
            lineHeight="1"
            bold
            fontSize="20px"
            decimals={5}
            value={isAutoVault ? cakeAsNumberBalance : stakedTokenBalance}
          />
          <Balance
            fontSize="12px"
            display="inline"
            color="textSubtle"
            decimals={2}
            value={isAutoVault ? stakedAutoDollarValue : stakedTokenDollarBalance}
            unit=" USD"
            prefix="~"
          />
        </ActionTitles>
        <ActionContent>
          <IconButtonWrapper>
            <StyledIconButton variant="secondary" onClick={onUnstake} mr="6px" minWidth="50px">
              <img src={MinusIcon} alt="MinusIcon" />
            </StyledIconButton>
            {reachStakingLimit ? (
              <span ref={targetRef}>
                <StyledIconButton variant="secondary" ml="12px" disabled minWidth="50px">
                  <img src={AddIcon} alt="add" />
                </StyledIconButton>
              </span>
            ) : (
              <StyledIconButton
                variant="secondary"
                minWidth="50px"
                ml="12px"
                onClick={stakingTokenBalance.gt(0) ? onStake : onPresentTokenRequired}
                disabled={isFinished}
              >
                <img src={AddIcon} alt="add" />
              </StyledIconButton>
            )}
          </IconButtonWrapper>
          {tooltipVisible && tooltip}
        </ActionContent>
      </ActionContainer>
    );
  }

  return (
    <ActionContent>
      <Button
        width="232px"
        onClick={stakingTokenBalance.gt(0) ? onStake : onPresentTokenRequired}
        variant="secondary"
        disabled={isFinished}
      >
        {t('Stake')}
      </Button>
    </ActionContent>
  );
};

export default Staked;
