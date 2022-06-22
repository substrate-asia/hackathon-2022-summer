import { AutoRenewIcon, Button, Modal } from '@my/ui';
import BigNumber from 'bignumber.js';
import { AVAT, chainId, main_tokens } from 'config/constants/tokens';
import useToast from 'hooks/useToast';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { getTimeStamp, getWeekTimeStamp, timestampToDate } from 'utils';
import { getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance';
import { veAVAT, WEEKTimeStamp } from 'views/Governance/constants/constants';
import { useGovernanceData, useLockAVATModalState } from 'views/Governance/state/governance/hooks';
import { ILockAVATModalState } from 'views/Governance/state/governance/types';
import { ITokenType } from 'views/Zap/utils/types';
import BalanceInput from './components/BalanceInput';
import LockInfo from './components/LockInfo';
import WeeksInput from './components/WeeksInput';

interface IProps {
  account: string;
  max: string;
  onDismiss?: () => void;
  isUserLoaded: boolean;
  handleCreateLock: any;
  handleIncreaseLockAmount: any;
  handleIncreaseUnlockTime: any;
  handleWithdraw: any;
}
const LockAVATModal = ({
  account,
  max,
  isUserLoaded,
  onDismiss,
  handleCreateLock,
  handleIncreaseLockAmount,
  handleIncreaseUnlockTime,
  handleWithdraw,
}: IProps) => {
  const lockAVATModalState: ILockAVATModalState = useLockAVATModalState();
  const [balanceVal, setBalanceVal] = useState('');
  const [weekVal, setWeekVal] = useState('');
  const [weekLiVal, setWeekLiVal] = useState('52');
  const [pendingTx, setPendingTx] = useState(false);
  const { userData: _userData = {} } = useGovernanceData();

  const { veAVATBalance, AVATLocked, withdrawalDate, _withdrawalDateDisplay } = useMemo(() => {
    const _userDataKey = `${account}-${chainId}`;
    const userData = _userData[_userDataKey];
    const { veAVATBalance = '0', AVATLocked = '0', withdrawalDate = '0', withdrawalDateDisplay = '0' } = userData || {};
    return {
      veAVATBalance,
      AVATLocked,
      withdrawalDate,
      _withdrawalDateDisplay: withdrawalDateDisplay,
    };
  }, [account, _userData]);

  const { veAVATBalanceDisplay, AVATLockedDisplay, withdrawalDateDisplay } = useMemo(() => {
    const veAVATBalanceDisplay = getFullDisplayBalance(new BigNumber(veAVATBalance), veAVAT.decimals, 4);

    const balanceBigVal = getDecimalAmount(balanceVal || '0');
    const __AVATBalance = balanceVal ? new BigNumber(AVATLocked).plus(balanceBigVal) : new BigNumber(AVATLocked);
    const AVATLockedDisplay = getFullDisplayBalance(__AVATBalance, AVAT.decimals, 4);

    const weekValue = Number(weekVal || weekLiVal);
    const timestamp = WEEKTimeStamp * weekValue;
    const nowTimestamp =
      lockAVATModalState === ILockAVATModalState.INIT ? getWeekTimeStamp(getTimeStamp()) : withdrawalDate;
    const withdrawalDateDisplay =
      lockAVATModalState === ILockAVATModalState.INIT || lockAVATModalState === ILockAVATModalState.CHANGELOCKTIME
        ? timestampToDate(new BigNumber(nowTimestamp).plus(timestamp).times(1000).toNumber())
        : _withdrawalDateDisplay;
    return {
      veAVATBalanceDisplay,
      AVATLockedDisplay,
      withdrawalDateDisplay,
    };
  }, [
    veAVATBalance,
    AVATLocked,
    withdrawalDate,
    balanceVal,
    weekLiVal,
    weekVal,
    _withdrawalDateDisplay,
    lockAVATModalState,
  ]);
  const { toastWarning } = useToast();

  const handleBalanceChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setBalanceVal(e.currentTarget.value.replace(/,/g, '.'));
      }
    },
    [setBalanceVal],
  );
  const handleWeekChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setWeekVal(e.currentTarget.value.replace(/,/g, '.'));
      }
    },
    [setWeekVal],
  );
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(new BigNumber(max), AVAT.decimals, 8);
  }, [max]);
  const handleSelectMax = useCallback(() => {
    setBalanceVal(fullBalance);
  }, [fullBalance, setBalanceVal]);
  const aimTimestampCallback = useCallback(() => {
    const weekValue = Number(weekVal || weekLiVal);
    if (weekValue <= 0 || weekValue > 156) {
      toastWarning('Warn', 'Select between 1 to 156 weeks');
      return;
    }

    // 24*60*60  1day/s
    const timestamp = WEEKTimeStamp * weekValue;
    const nowTimestamp =
      lockAVATModalState === ILockAVATModalState.INIT ? getWeekTimeStamp(getTimeStamp()) : Number(withdrawalDate);
    const aimTimestamp = timestamp + nowTimestamp;
    // if (aimTimestamp < Number(withdrawalDate)) {
    //   toastWarning('Warn', `Time lower than ${withdrawalDateDisplay} cannot be filled in`);
    //   return;
    // }
    return aimTimestamp;
  }, [toastWarning, weekLiVal, weekVal, withdrawalDate, lockAVATModalState]);
  const balanceValueCallback = useCallback(() => {
    if (!balanceVal) {
      toastWarning('Warn', 'Please input amount!');
      return;
    }
    const balanceValue = getDecimalAmount(new BigNumber(balanceVal)).toNumber();
    const maxBalance = Number(max);
    if (balanceValue <= 0 || balanceValue > maxBalance) {
      toastWarning('Warn', 'Insufficient allowance');
      return;
    }
    return balanceValue;
  }, [balanceVal, max, toastWarning]);
  const onPressHandle = useCallback(async () => {
    if (lockAVATModalState === ILockAVATModalState.INIT) {
      const balanceValue = balanceValueCallback();
      if (!balanceValue) {
        return;
      }
      const aimTimestamp = aimTimestampCallback();
      if (!aimTimestamp) {
        return;
      }
      setPendingTx(true);
      await handleCreateLock({
        amount: `${balanceValue}`,
        unlockTime: `${aimTimestamp}`,
      });
    } else if (lockAVATModalState === ILockAVATModalState.ADDAMOUNT) {
      const balanceValue = balanceValueCallback();
      if (!balanceValue) {
        return;
      }
      setPendingTx(true);
      await handleIncreaseLockAmount({
        amount: `${balanceValue}`,
      });
    } else if (lockAVATModalState === ILockAVATModalState.CHANGELOCKTIME) {
      const aimTimestamp = aimTimestampCallback();
      if (!aimTimestamp) {
        return;
      }
      setPendingTx(true);
      await handleIncreaseUnlockTime({
        newUnlockTime: `${aimTimestamp}`,
      });
    } else if (lockAVATModalState === ILockAVATModalState.WITHDRAW) {
      setPendingTx(true);
      await handleWithdraw();
    }

    setPendingTx(false);
    onDismiss();
    // console.log('aimTimestamp: ', aimTimestamp);
  }, [
    handleCreateLock,
    handleIncreaseLockAmount,
    handleIncreaseUnlockTime,
    handleWithdraw,
    lockAVATModalState,
    aimTimestampCallback,
    balanceValueCallback,
    onDismiss,
  ]);

  const title = useCallback(() => {
    switch (lockAVATModalState) {
      case ILockAVATModalState.INIT:
        return 'Lock AVAT';
      case ILockAVATModalState.ADDAMOUNT:
        return 'Add Lock AVAT';
      case ILockAVATModalState.CHANGELOCKTIME:
        return 'Extend Lock Time';
      case ILockAVATModalState.WITHDRAW:
        return 'Withdraw';
      default:
        return 'Lock AVAT';
    }
  }, [lockAVATModalState]);
  return useMemo(() => {
    return (
      <LockAVATModalStyled title={title()} onDismiss={onDismiss} bodyPadding="0" headerPadding="12px 5% 0">
        <div className="inner">
          {lockAVATModalState !== ILockAVATModalState.CHANGELOCKTIME ? (
            <BalanceInput
              isUserLoaded={isUserLoaded}
              account={account}
              balance={fullBalance}
              handleSelectMax={handleSelectMax}
              val={balanceVal}
              handleChange={handleBalanceChange}
              decimals={2}
              token={{
                type: ITokenType.TOKEN,
                symbol: AVAT.symbol,
                address: main_tokens.avat.address,
                decimals: AVAT.decimals,
              }}
            />
          ) : null}

          {lockAVATModalState !== ILockAVATModalState.ADDAMOUNT &&
          lockAVATModalState !== ILockAVATModalState.WITHDRAW ? (
            <WeeksInput
              lockAVATModalState={lockAVATModalState}
              val={weekVal}
              setWeekVal={setWeekVal}
              handleChange={handleWeekChange}
              weekLiVal={weekLiVal}
              setWeekLiVal={setWeekLiVal}
              withdrawalDate={withdrawalDate}
            />
          ) : null}
          {lockAVATModalState !== ILockAVATModalState.WITHDRAW ? (
            <LockInfo
              veAVATBalanceDisplay={veAVATBalanceDisplay}
              AVATLockedDisplay={AVATLockedDisplay}
              withdrawalDateDisplay={withdrawalDateDisplay}
            />
          ) : null}
          <ButtonStyled
            isLoading={pendingTx}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
            onClick={onPressHandle}
          >
            Confirm
          </ButtonStyled>
        </div>
      </LockAVATModalStyled>
    );
  }, [
    fullBalance,
    withdrawalDate,
    account,
    balanceVal,
    handleBalanceChange,
    handleSelectMax,
    handleWeekChange,
    isUserLoaded,
    lockAVATModalState,
    onDismiss,
    onPressHandle,
    title,
    weekLiVal,
    weekVal,
    pendingTx,
    AVATLockedDisplay,
    veAVATBalanceDisplay,
    withdrawalDateDisplay,
  ]);
};
const LockAVATModalStyled = styled(Modal)`
  width: 80%;
  padding-bottom: 100px;
  position: relative;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 520px;
  }
  .inner {
    width: 90%;
    margin: 0 auto;
    max-height: 400px;
    overflow-y: auto;
    ${({ theme }) => theme.mediaQueries.md} {
      max-height: 55vh;
    }
  }
`;
const ButtonStyled = styled(Button)`
  // height: 48px;
  // display: block;
  width: 90%;
  position: absolute;
  bottom: 30px;
  left: 5%;
`;
export default LockAVATModal;
