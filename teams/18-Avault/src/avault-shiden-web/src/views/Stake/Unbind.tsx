import React, { useState, useCallback } from 'react';
import { Button } from '@my/ui';
import BigNumber from 'bignumber.js';
import useToast from 'hooks/useToast';
import { InputWrap, StyledTokenInputTop, StyledInput } from './style/DappstakeStyle';
import Balance from './components/StakeTableBalance';
import DappstakePage from './components/DappstakePage';
import PageLayout from 'components/Layout/Page';
import UnbindList from './components/UnbindList';
import { useDAppStackingContract } from 'hooks/useContract';
import { GetPoolUpdate, IDappPoolDataInterface } from './hooks/getPoolUpdate';
import useStakeWrap from './hooks/useStakeWrap';
import { UseUnbindDApp } from './hooks/useUnbindDApp';
import { UseStakeDApp } from './hooks/useStakeDApp';
import { GetUserList } from './hooks/getUserList';
import { IWithdrawRecordItem } from 'utils/types';
import TokenIconItem from './components/TokenIconItem';
import ArrowDown from './components/svg/arrow_down';
import { BgGlobalStyle } from 'style/Global';
import { PageContainerWrap } from 'style/SmallBorderPageLayout';
const Unbind = () => {
  const contract = useDAppStackingContract();
  const pool: IDappPoolDataInterface = GetPoolUpdate(contract);
  const {
    balance,
    isBalanceZero,
    decimals,
    fullBalance,
    account,
  }: {
    balance: BigNumber;
    isBalanceZero: boolean;
    decimals: number;
    fullBalance: string;
    pid: number;
    account: string;
  } = useStakeWrap();
  const list: IWithdrawRecordItem[] = GetUserList(contract, pool.recordsIndex, account);
  const { toastSuccess, toastError } = useToast();
  const [val, setVal] = useState('');
  const [pendingTx, setPendingTx] = useState(false);
  const lpTokensToStake = new BigNumber(val);
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

  return (
    <PageLayout>
      <BgGlobalStyle />
      <PageContainerWrap>
        <DappstakePage contract={contract} pool={pool}>
          <Balance
            balance={balance}
            decimals={decimals}
            symbol="aAVAT"
            isBalanceZero={isBalanceZero}
            handleSelectMax={handleSelectMax}
          />
          <InputWrap>
            <StyledTokenInputTop isWarning={isBalanceZero}>
              <TokenIconItem symbol="aAVAT" tokenAddress="aavat" />
              <StyledInput
                pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
                inputMode="decimal"
                step="any"
                min="0"
                onChange={handleChange}
                placeholder="0.00"
                value={val}
              />
            </StyledTokenInputTop>

            <StyledTokenInputTop isWarning={isBalanceZero}>
              <TokenIconItem symbol="AVAT" tokenAddress="0x0a3A21356793B49154Fd3BbE91CBc2A16c0457f5" />
              <StyledInput
                pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
                inputMode="decimal"
                step="any"
                min="0"
                onChange={handleChange}
                placeholder="0.00"
                value={val}
              />
            </StyledTokenInputTop>
            <ArrowDown />
          </InputWrap>
          <Button
            width="100%"
            padding="0"
            disabled={pendingTx || !lpTokensToStake.isFinite() || lpTokensToStake.eq(0) || lpTokensToStake.gt(balance)}
            onClick={async () => {
              setPendingTx(true);
              try {
                await UseUnbindDApp(contract, account, val);
                toastSuccess('Unstaked!', 'Your earnings have also been harvested to your wallet');
              } catch (e) {
                toastError(
                  'Error',
                  'Please try again. Confirm the transaction and make sure you are paying enough gas!',
                );
                console.error(e);
              } finally {
                setPendingTx(false);
              }
            }}
          >
            {pendingTx ? 'Confirming' : 'Confirm'}
          </Button>
        </DappstakePage>
        <UnbindList
          list={list}
          withdraw={async () => {
            await UseStakeDApp(contract, account);
            toastSuccess('Staked!', 'Your funds have been staked in the App');
          }}
        />
      </PageContainerWrap>
    </PageLayout>
  );
};

export default Unbind;
