import BigNumber from 'bignumber.js';
import React, { useCallback, useMemo, useState } from 'react';
import { AutoRenewIcon, Button, Modal, Text, useMatchBreakpoints } from '@my/ui';
import { getFullDisplayBalance } from 'utils/formatBalance';
import styled from 'styled-components';
import { changeLoading, changeVaultItemLoading, fetchVaultFarmUserDataAsync } from 'state/vault';
import { useAppDispatch } from 'state';
import { useWeb3React } from '@web3-react/core';
import { useVault } from 'state/vault/hooks';
import useToast from 'hooks/useToast';
import useVaultDeposit from 'views/Vault/hooks/useVaultDeposit';
import { showDecimals } from 'views/Vault/utils';
import InputBalance from 'components/InputBalance';

interface DepositModalProps {
  lpSymbol?: string;
  max: BigNumber;
  displayBalance: string;
  lpAddressDecimals: number;
  onDismiss?: () => void;
  contractAddress: string;
  index: number;
}
const ModalInputStyled = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 12px 16px 16px;
  margin-top: 8px;
`;
const ButtonStyled = styled(Button)<{ isLoading: boolean; isMobile: boolean }>`
  margin-top: 8px;
  width: 100%;
  // isLoading={pendingTx}
  height: ${({ isMobile }) => (isMobile ? '38px' : '48px')};
`;
const DepositModal: React.FC<DepositModalProps> = ({
  lpAddressDecimals,
  max,
  onDismiss,
  displayBalance,
  lpSymbol,
  contractAddress,
  index,
}) => {
  const [val, setVal] = useState('');
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, lpAddressDecimals, showDecimals(lpSymbol));
  }, [max, lpAddressDecimals, lpSymbol]);

  // eslint-disable-next-line
  const valNumber = new BigNumber(val);
  // eslint-disable-next-line
  const fullBalanceNumber = new BigNumber(fullBalance);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'));
      }
    },
    [setVal],
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);
  const { isMd, isXl, isLg } = useMatchBreakpoints();
  const isMobile = !(isMd || isXl || isLg);
  const [pendingTx, setPendingTx] = useState(false);
  const { account } = useWeb3React();
  const { data: vaults } = useVault();
  const { toastSuccess, toastError } = useToast();
  const dispatch = useAppDispatch();
  const { onDeposit } = useVaultDeposit(account, contractAddress, lpAddressDecimals);
  const handleDeposit = useCallback(async () => {
    setPendingTx(true);
    let result = null;
    try {
      result = await onDeposit(val);
      if (typeof result === 'boolean' && result) {
        dispatch(changeLoading());
        dispatch(changeVaultItemLoading({ index }));
        dispatch(fetchVaultFarmUserDataAsync({ account, vaults, index }));
        toastSuccess(`Deposit!`, `Your ${lpSymbol} deposit!`);
      } else {
        const message = result ? result : `Your ${lpSymbol} deposit failed!`;
        toastError('Error', message);
      }
    } catch (e: any) {
      toastError('Error', e.message ? e.message : `Your ${lpSymbol} deposit failed!`);
    } finally {
      setVal('');
      setPendingTx(false);
    }
  }, [val, account, vaults, index, dispatch, lpSymbol, onDeposit, toastError, toastSuccess]);

  return (
    <Modal title={'Deposit'} minWidth={isMobile ? '343px' : '520px'} bodyPadding="0 16px 20px" onDismiss={onDismiss}>
      <Text fontSize="12px" fontWeight="500" textAlign="right">
        {/* {lpSymbol ?? ''} */}
        LP Balance: {displayBalance}
      </Text>
      <ModalInputStyled>
        <InputBalance value={val} autoFocus={true} onSelectMax={handleSelectMax} onChange={handleChange} />
        <ButtonStyled
          variant="tertiary"
          height={isMobile ? '38px' : '48px'}
          isLoading={pendingTx}
          isMobile={isMobile}
          disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
          onClick={handleDeposit}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        >
          Deposit
        </ButtonStyled>
      </ModalInputStyled>
    </Modal>
  );
};

export default DepositModal;
