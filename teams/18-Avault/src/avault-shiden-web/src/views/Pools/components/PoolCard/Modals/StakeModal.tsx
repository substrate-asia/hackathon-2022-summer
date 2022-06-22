import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Text, Flex, Button, BalanceInput, AutoRenewIcon, Link } from '@my/ui';
import { useTranslation } from 'contexts/Localization';
import useToast from 'hooks/useToast';
import BigNumber from 'bignumber.js';
import { getFullDisplayBalance, getDecimalAmount } from 'utils/formatBalance';
import { Pool } from 'state/types';
import useStakePool from '../../../hooks/useStakePool';
import useUnstakePool from '../../../hooks/useUnstakePool';
import Modal from 'components/Modal/Modal';

interface StakeModalProps {
  isBnbPool: boolean;
  pool: Pool;
  stakingTokenBalance: BigNumber;
  stakingTokenPrice: number;
  isRemovingStake?: boolean;
  onDismiss?: () => void;
}
const StyledBorder = styled.div`
  background: #272e32;
  border-radius: 16px;
  padding: 20px;
`;
const StyledLink = styled(Link)`
  width: 100%;
  display: block;
  text-align: center;
  margin-top: 15px;
`;
const StyledBalanceInput = styled(BalanceInput)`
  background: transparent;
  padding: 0;
  border: none;
  border-radius: 0;
  box-shadow: none;
`;
const StyledRadio = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  background: #1476ff;
  border-radius: 50%;
`;
const StakeModal: React.FC<StakeModalProps> = ({
  isBnbPool,
  pool,
  stakingTokenBalance,
  stakingTokenPrice,
  isRemovingStake = false,
  onDismiss,
}) => {
  const { sousId, stakingToken, userData, stakingLimit, earningToken } = pool;
  const { t } = useTranslation();
  const { onStake } = useStakePool(sousId, isBnbPool);
  const { onUnstake } = useUnstakePool(sousId, pool.enableEmergencyWithdraw);
  const { toastSuccess, toastError } = useToast();
  const [pendingTx, setPendingTx] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [hasReachedStakeLimit, setHasReachedStakedLimit] = useState(false);
  const getCalculatedStakingLimit = () => {
    if (isRemovingStake) {
      return userData.stakedBalance;
    }
    return stakingLimit.gt(0) && stakingTokenBalance.gt(stakingLimit) ? stakingLimit : stakingTokenBalance;
  };

  useEffect(() => {
    if (stakingLimit.gt(0) && !isRemovingStake) {
      const fullDecimalStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), stakingToken.decimals);
      setHasReachedStakedLimit(fullDecimalStakeAmount.plus(userData.stakedBalance).gt(stakingLimit));
    }
  }, [stakeAmount, stakingLimit, userData, stakingToken, isRemovingStake, setHasReachedStakedLimit]);

  const handleStakeInputChange = (input: string) => {
    setStakeAmount(input);
  };

  const handleChangePercent = (sliderPercent: number) => {
    if (sliderPercent > 0) {
      const percentageOfStakingMax = getCalculatedStakingLimit().dividedBy(100).multipliedBy(sliderPercent);
      const amountToStake = getFullDisplayBalance(percentageOfStakingMax, stakingToken.decimals, stakingToken.decimals);
      setStakeAmount(amountToStake);
    } else {
      setStakeAmount('');
    }
  };

  const handleConfirmClick = async () => {
    setPendingTx(true);

    if (isRemovingStake) {
      // unstaking
      try {
        await onUnstake(stakeAmount, stakingToken.decimals);
        toastSuccess(
          `${t('Unstaked')}!`,
          t('Your %symbol% earnings have also been harvested to your wallet!', {
            symbol: earningToken.symbol,
          }),
        );
        setPendingTx(false);
        onDismiss();
      } catch (e) {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'));
        setPendingTx(false);
      }
    } else {
      try {
        // staking
        await onStake(stakeAmount, stakingToken.decimals);
        toastSuccess(
          `${t('Staked')}!`,
          t('Your %symbol% funds have been staked in the pool!', {
            symbol: stakingToken.symbol,
          }),
        );
        setPendingTx(false);
        onDismiss();
      } catch (e) {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'));
        setPendingTx(false);
      }
    }
  };

  return (
    <Modal
      title={
        isRemovingStake
          ? t('Unstake %symbol%', { symbol: stakingToken.symbol })
          : t('Stake %symbol%', { symbol: stakingToken.symbol })
      }
      onDismiss={onDismiss}
    >
      {stakingLimit.gt(0) && !isRemovingStake && (
        <Text color="secondary" bold mb="24px" style={{ textAlign: 'center' }} fontSize="16px">
          {t('Max stake for this pool: %amount% %token%', {
            amount: getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0),
            token: stakingToken.symbol,
          })}
        </Text>
      )}
      <StyledBorder>
        <Flex alignItems="center" justifyContent="space-between" mb="8px">
          <Text bold>{isRemovingStake ? t('Unstake') : t('Stake')}</Text>
          <Flex>
            <Text color="textSubtle" fontSize="12px" bold>
              {t('Balance: %balance%', {
                balance: getFullDisplayBalance(getCalculatedStakingLimit(), stakingToken.decimals),
              })}
            </Text>
            <Text bold color="primary" ml="12px" fontSize="12px" onClick={() => handleChangePercent(100)}>
              {t('Max')}
            </Text>
          </Flex>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <StyledRadio />
            <Text bold ml="20px" fontSize="16px">
              {stakingToken.symbol}
            </Text>
          </Flex>
          <StyledBalanceInput
            value={stakeAmount}
            onUserInput={handleStakeInputChange}
            // currencyValue={stakingTokenPrice !== 0 && `~${usdValueStaked || 0} USD`}
            isWarning={hasReachedStakeLimit}
            decimals={stakingToken.decimals}
            background="#272E32"
          />
        </Flex>
      </StyledBorder>
      {hasReachedStakeLimit && (
        <Text color="failure" fontSize="12px" style={{ textAlign: 'right' }} mt="4px">
          {t('Maximum total stake: %amount% %token%', {
            amount: getFullDisplayBalance(new BigNumber(stakingLimit), stakingToken.decimals, 0),
            token: stakingToken.symbol,
          })}
        </Text>
      )}
      <Flex alignItems="center" justifyContent="center" mb="8px" mt="30px">
        <Button minWidth="150px" variant="secondary" onClick={onDismiss} ml="8px" mr="8px">
          {t('Cancel')}
        </Button>
        <Button
          ml="10px"
          mr="10px"
          minWidth="150px"
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          onClick={handleConfirmClick}
          disabled={!stakeAmount || parseFloat(stakeAmount) === 0 || hasReachedStakeLimit}
        >
          {pendingTx ? t('Confirming') : t('Confirm')}
        </Button>
      </Flex>
      {!isRemovingStake && (
        <StyledLink external href="/swap">
          {t('To Buy %symbol%', { symbol: stakingToken.symbol })}
        </StyledLink>
      )}
    </Modal>
  );
};

export default StakeModal;
