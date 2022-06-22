import React, { useState } from 'react';
import { Text, Flex, Button, BalanceInput, AutoRenewIcon } from '@my/ui';
import { useTranslation } from 'contexts/Localization';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from 'state';
import { usePriceCakeBusd } from 'state/farms/hooks';
import { useCakeVault } from 'state/pools/hooks';
import { useCakeVaultContract } from 'hooks/useContract';
import useWithdrawalFeeTimer from 'views/Pools/hooks/useWithdrawalFeeTimer';
import BigNumber from 'bignumber.js';
import { getFullDisplayBalance, formatNumber, getDecimalAmount } from 'utils/formatBalance';
import useToast from 'hooks/useToast';
import { fetchCakeVaultUserData } from 'state/pools';
import { Pool } from 'state/types';
import Modal from 'components/Modal/Modal';
import { convertCakeToShares } from '../../helpers';
import FeeSummary from './FeeSummary';

interface VaultStakeModalProps {
  pool: Pool;
  stakingMax: BigNumber;
  isRemovingStake?: boolean;
  onDismiss?: () => void;
}

const callOptions = {
  gasLimit: 380000,
};

const VaultStakeModal: React.FC<VaultStakeModalProps> = ({ pool, stakingMax, isRemovingStake = false, onDismiss }) => {
  const dispatch = useAppDispatch();
  const { stakingToken } = pool;
  const { account } = useWeb3React();
  const cakeVaultContract = useCakeVaultContract();
  const {
    userData: { lastDepositedTime, userShares },
    pricePerFullShare,
  } = useCakeVault();
  const { t } = useTranslation();
  const { toastSuccess, toastError } = useToast();
  const [pendingTx, setPendingTx] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const { hasUnstakingFee } = useWithdrawalFeeTimer(parseInt(lastDepositedTime, 10), userShares);
  const cakePriceBusd = usePriceCakeBusd();
  const usdValueStaked =
    cakePriceBusd.gt(0) && stakeAmount ? formatNumber(new BigNumber(stakeAmount).times(cakePriceBusd).toNumber()) : '';

  const handleStakeInputChange = (input: string) => {
    setStakeAmount(input);
  };

  const handleChangePercent = (sliderPercent: number) => {
    if (sliderPercent > 0) {
      const percentageOfStakingMax = stakingMax.dividedBy(100).multipliedBy(sliderPercent);
      const amountToStake = getFullDisplayBalance(percentageOfStakingMax, stakingToken.decimals, stakingToken.decimals);
      setStakeAmount(amountToStake);
    } else {
      setStakeAmount('');
    }
  };

  const handleWithdrawal = async (convertedStakeAmount: BigNumber) => {
    setPendingTx(true);
    const shareStakeToWithdraw = convertCakeToShares(convertedStakeAmount, pricePerFullShare);
    // trigger withdrawAll function if the withdrawal will leave 0.000001 KAC or less
    const triggerWithdrawAllThreshold = new BigNumber(1000000000000);
    const sharesRemaining = userShares.minus(shareStakeToWithdraw.sharesAsBigNumber);
    const isWithdrawingAll = sharesRemaining.lte(triggerWithdrawAllThreshold);

    if (isWithdrawingAll) {
      try {
        const tx = await cakeVaultContract.withdrawAll(callOptions);
        const receipt = await tx.wait();
        if (receipt.status) {
          toastSuccess(t('Unstaked!'), t('Your earnings have also been harvested to your wallet'));
          setPendingTx(false);
          onDismiss();
          dispatch(fetchCakeVaultUserData({ account }));
        }
      } catch (error) {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'));
        setPendingTx(false);
      }
    } else {
      // .toString() being called to fix a BigNumber error in prod
      // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
      try {
        const tx = await cakeVaultContract.withdraw(shareStakeToWithdraw.sharesAsBigNumber.toString(), callOptions);
        const receipt = await tx.wait();
        if (receipt.status) {
          toastSuccess(t('Unstaked!'), t('Your earnings have also been harvested to your wallet'));
          setPendingTx(false);
          onDismiss();
          dispatch(fetchCakeVaultUserData({ account }));
        }
      } catch (error) {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'));
        setPendingTx(false);
      }
    }
  };

  const handleDeposit = async (convertedStakeAmount: BigNumber) => {
    setPendingTx(true);
    try {
      // .toString() being called to fix a BigNumber error in prod
      // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
      const tx = await cakeVaultContract.deposit(convertedStakeAmount.toString(), callOptions);
      const receipt = await tx.wait();
      if (receipt.status) {
        toastSuccess(t('Staked!'), t('Your funds have been staked in the pool'));
        setPendingTx(false);
        onDismiss();
        dispatch(fetchCakeVaultUserData({ account }));
      }
    } catch (error) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'));
      setPendingTx(false);
    }
  };

  const handleConfirmClick = async () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), stakingToken.decimals);
    if (isRemovingStake) {
      // unstaking
      handleWithdrawal(convertedStakeAmount);
    } else {
      // staking
      handleDeposit(convertedStakeAmount);
    }
  };

  return (
    <Modal title={isRemovingStake ? t('Unstake') : t('Stake in Pool')} onDismiss={onDismiss}>
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text bold>{isRemovingStake ? t('Unstake') : t('Stake')}</Text>
        <div>
          <Text mt="8px" ml="auto" color="textSubtle" fontSize="12px" mb="8px">
            {t('Balance: %balance%', { balance: getFullDisplayBalance(stakingMax, stakingToken.decimals) })}
          </Text>
          <Text color="#1476FF" onClick={() => handleChangePercent(100)}>
            {t('Max')}
          </Text>
        </div>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <div>
          <i className="radio"></i>
          <Text bold>{stakingToken.symbol}</Text>
        </div>
        <BalanceInput
          value={stakeAmount}
          onUserInput={handleStakeInputChange}
          currencyValue={cakePriceBusd.gt(0) && `~${usdValueStaked || 0} USD`}
          decimals={stakingToken.decimals}
        />
      </Flex>
      {isRemovingStake && hasUnstakingFee && (
        <FeeSummary stakingTokenSymbol={stakingToken.symbol} stakeAmount={stakeAmount} />
      )}
      <Button
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleConfirmClick}
        disabled={!stakeAmount || parseFloat(stakeAmount) === 0}
        mt="24px"
      >
        {pendingTx ? t('Confirming') : t('Confirm')}
      </Button>
      {!isRemovingStake && (
        <Button mt="8px" as="a" external href="/swap" variant="secondary">
          {t('Get %symbol%', { symbol: stakingToken.symbol })}
        </Button>
      )}
    </Modal>
  );
};

export default VaultStakeModal;
