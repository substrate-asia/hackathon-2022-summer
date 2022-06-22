import BigNumber from 'bignumber.js';
import React, { useCallback, useMemo, useState } from 'react';
import { AutoRenewIcon, Button, Modal, Text, useMatchBreakpoints } from '@my/ui';
import { getFullDisplayBalance } from 'utils/formatBalance';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { useVault } from 'state/vault/hooks';
import useToast from 'hooks/useToast';
import { useAppDispatch } from 'state';
import useVaultWithdraw from 'views/Vault/hooks/useVaultWithdraw';
import { changeLoading, changeVaultItemLoading, fetchVaultFarmUserDataAsync } from 'state/vault';
import { showDecimals } from 'views/Vault/utils';
import InputBalance from 'components/InputBalance';

interface WithdrawModalProps {
  displayEarningsBalance: string;
  max: BigNumber;
  lpSymbol: string;
  lpAddressDecimals: number;
  onDismiss?: () => void;
  contractAddress: string;
  lpToCLpRate: string;
  index: number;
}
const ModalInputStyled = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 10px 16px 16px;
  margin-top: 8px;
`;
const WithdrawModal: React.FC<WithdrawModalProps> = ({
  onDismiss,
  max,
  displayEarningsBalance,
  lpSymbol,
  lpAddressDecimals,
  contractAddress,
  lpToCLpRate,
  index,
}) => {
  const [val, setVal] = useState('');
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, lpAddressDecimals, showDecimals(lpSymbol));
  }, [max, lpAddressDecimals, lpSymbol]);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'));
      }
    },
    [setVal],
  );

  const [pendingTx, setPendingTx] = useState(false);
  const { account } = useWeb3React();
  const { data: vaults } = useVault();
  const { toastSuccess, toastError } = useToast();
  const dispatch = useAppDispatch();
  const { onWithdraw } = useVaultWithdraw(account, contractAddress, lpAddressDecimals);

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);
  const handleWithdraw = useCallback(async () => {
    setPendingTx(true);
    let result = null;
    try {
      // let _amount = new BigNumber(val).div(new BigNumber(lpToCLpRate)).times(_rate).times(0.99999).toString();
      const _amount = new BigNumber(val).div(new BigNumber(lpToCLpRate)).times(0.99).toString();
      result = await onWithdraw(_amount);
      if (typeof result === 'boolean' && result) {
        dispatch(changeLoading());
        dispatch(changeVaultItemLoading({ index }));
        dispatch(fetchVaultFarmUserDataAsync({ account, vaults, index }));
        toastSuccess(`Withdraw!`, `'Your ${lpSymbol} earnings have been sent to your wallet!'`);
      } else {
        const message = result ? result : `Your ${lpSymbol} withdraw failed!`;
        toastError('Error', message);
      }
    } catch (e: any) {
      toastError('Error', e.message ? e.message : `Your ${lpSymbol} withdraw failed! `);
    } finally {
      setVal('');
      setPendingTx(false);
    }
  }, [val, lpToCLpRate, account, index, vaults, dispatch, lpSymbol, onWithdraw, toastError, toastSuccess]);

  const { isMd, isXl, isLg } = useMatchBreakpoints();
  const isMobile = !(isMd || isXl || isLg);
  const valNumber = new BigNumber(val);
  const fullBalanceNumber = new BigNumber(fullBalance);

  return (
    <Modal title="Withdraw" minWidth={isMobile ? '343px' : '520px'} bodyPadding="0 16px 20px" onDismiss={onDismiss}>
      <Text fontSize="12px" fontWeight="500" textAlign="right">
        LP Withdrawable: {displayEarningsBalance}
        {lpSymbol ? ` ${lpSymbol}` : ''}
      </Text>
      <ModalInputStyled>
        <InputBalance autoFocus={true} onSelectMax={handleSelectMax} onChange={handleChange} value={val} />
        <Button
          variant="tertiary"
          disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
          height={isMobile ? '38px' : '48px'}
          isLoading={pendingTx}
          onClick={handleWithdraw}
          width="100%"
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        >
          Withdraw
        </Button>
      </ModalInputStyled>
    </Modal>
  );
};

export default WithdrawModal;
