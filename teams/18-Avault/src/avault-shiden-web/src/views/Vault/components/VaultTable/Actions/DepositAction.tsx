import React, { useCallback, useMemo, useState } from 'react';
import { AutoRenewIcon, Flex, Text } from '@my/ui';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { BIG_ZERO } from 'utils/bigNumber';
import { useAppDispatch } from 'state';
import useToast from 'hooks/useToast';
import { LongButton } from './styles';
import styled from 'styled-components';
import { getFullDisplayBalance } from 'utils/formatBalance';
import { useVault, useVaultFarmUser } from 'state/vault/hooks';
import useVaultDeposit from 'views/Vault/hooks/useVaultDeposit';
import { changeLoading, changeVaultItemLoading, fetchVaultFarmUserDataAsync } from 'state/vault';
import { ActionContainerBg, ActionContainerSize } from 'style/TableStyled';
import { showDecimals } from 'views/Vault/utils';
import InputBalance from 'components/InputBalance';

interface HarvestActionProps {
  userDataReady: boolean;
  displayBalance: string | JSX.Element;
  earnings: BigNumber;
  isApproved: boolean;
  handleApprove: any;
  requestedApproval: boolean;
  requestedApprovalSuccess: boolean;
  pid: number;
  name: string;
  displayEarningsBalance?: string;
  lpSymbol: string;
  contractAddress: string;
  lpAddressDecimals: number;
  index: number;
}
const FlexStyled = styled(Flex)`
  margin-top: 0;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`;

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({
  pid,
  earnings,
  userDataReady,
  isApproved,
  handleApprove,
  requestedApproval,
  lpSymbol,
  displayBalance,
  contractAddress,
  lpAddressDecimals,
  requestedApprovalSuccess,
  index,
}) => {
  const { toastSuccess, toastError } = useToast();
  const { data: vaults } = useVault();
  const [pendingTx, setPendingTx] = useState(false);
  const { account } = useWeb3React();
  const { onDeposit } = useVaultDeposit(account, contractAddress, lpAddressDecimals);
  const dispatch = useAppDispatch();
  const [val, setVal] = useState('');
  const { stakingTokenBalance } = useVaultFarmUser(account, pid ?? 0);

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(stakingTokenBalance, lpAddressDecimals, showDecimals(lpSymbol));
  }, [stakingTokenBalance, lpAddressDecimals, lpSymbol]);
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
  const valNumber = new BigNumber(val);

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
      // toastError('Error', `Your ${lpSymbol} deposit failed!`);
    } finally {
      setVal('');
      setPendingTx(false);
    }
  }, [val, account, vaults, index, dispatch, lpSymbol, onDeposit, toastError, toastSuccess]);
  const disabled =
    requestedApproval ||
    stakingTokenBalance.eq(BIG_ZERO) ||
    pendingTx ||
    !userDataReady ||
    !valNumber.isFinite() ||
    valNumber.eq(0) ||
    valNumber.gt(fullBalanceNumber);
  return (
    <ActionContainerSize smallBorder={disabled ? false : true}>
      <Text textAlign="right" fontSize="12px" marginBottom="8px" fontWeight="500">
        {/* {lpSymbol ?? ''} */}
        LP Balance: {displayBalance}
      </Text>
      <ActionContainerBg smallBorder={disabled ? false : true}>
        <FlexStyled>
          <InputBalance value={val} onSelectMax={handleSelectMax} onChange={handleChange} />
          {!isApproved ? (
            <LongButton
              disabled={requestedApproval || !userDataReady}
              isLoading={requestedApproval}
              endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}
              onClick={handleApprove}
              variant="secondary"
            >
              {account ? 'Approve' : 'Connect Wallet'}
            </LongButton>
          ) : (
            <LongButton
              variant="primary"
              className={pendingTx ? 'loading' : ''}
              endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
              disabled={disabled}
              onClick={handleDeposit}
            >
              Deposit
            </LongButton>
          )}
        </FlexStyled>
      </ActionContainerBg>
    </ActionContainerSize>
  );
};

export default HarvestAction;
