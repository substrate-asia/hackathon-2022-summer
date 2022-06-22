import { Button } from '@my/ui';
import BigNumber from 'bignumber.js';
import Timer from 'components/CountdownTimer/Timer';
import useNextEventCountdown from 'components/CountdownTimer/useNextEventCountdown';
import InputBalance from 'components/InputBalance';
import { Dispatch, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { getFullDisplayBalance, getFullLocalDisplayBalance } from 'utils/formatBalance';
import getTimePeriods from 'utils/getTimePeriods';
import { IIdoStateEnum } from 'views/Ido/state/ido/types';
import { useIdoFun } from '../state/ido/hooks';
import { Web3Provider } from '@ethersproject/providers';
import ConnectWalletButton from 'components/ConnectWalletButton';
import { ToastSignature } from 'contexts/ToastsContext/types';
import { fetchIdoAsync } from '../state/ido/state';
interface IProps extends IPROCINGComponents {
  nextEventTime: number;
  maxASTRBalance: string;
  lpBalance: string;
  lpTotalBalance: string;
}
interface IPROCINGComponents {
  dispatch: Dispatch<any>;
  idoState: IIdoStateEnum;
  max?: string;
  account: string;
  library: Web3Provider;
  toastSuccess: ToastSignature;
  toastWarning: ToastSignature;
  toastError: ToastSignature;
  accountkey: string;
}
const Contribution = ({
  dispatch,
  account,
  nextEventTime,
  lpTotalBalance,
  idoState,
  maxASTRBalance,
  lpBalance,
  library,
  toastSuccess,
  toastWarning,
  toastError,
  accountkey,
}: IProps) => {
  return useMemo(() => {
    return (
      <ContributionStyled
        paddingBottom={idoState === IIdoStateEnum.END || idoState === IIdoStateEnum.WAITINGGETLP ? '100' : '180'}
      >
        <div className="inner">
          {idoState === IIdoStateEnum.END || idoState === IIdoStateEnum.WAITINGGETLP ? (
            <LpBalanceComponents lpTotalBalance={lpTotalBalance} />
          ) : (
            <ContributionComponents />
          )}
          {idoState === IIdoStateEnum.INIT ? <InitComponents nextEventTime={nextEventTime} /> : null}
          {idoState === IIdoStateEnum.PROCING ||
          idoState === IIdoStateEnum.END ||
          idoState === IIdoStateEnum.WAITINGGETLP ? (
            <PROCINGComponents
              accountkey={accountkey}
              dispatch={dispatch}
              max={idoState === IIdoStateEnum.PROCING ? maxASTRBalance : lpBalance}
              library={library}
              account={account}
              idoState={idoState}
              toastError={toastError}
              toastWarning={toastWarning}
              toastSuccess={toastSuccess}
            />
          ) : null}
        </div>
      </ContributionStyled>
    );
  }, [
    dispatch,
    accountkey,
    nextEventTime,
    library,
    idoState,
    maxASTRBalance,
    account,
    lpTotalBalance,
    lpBalance,
    toastError,
    toastWarning,
    toastSuccess,
  ]);
};
const LpBalanceComponents = ({ lpTotalBalance }) => {
  return useMemo(() => {
    return (
      <>
        <h2 className="h2_title">{lpTotalBalance}</h2>
        <h3 className="h3_title">AVAT-ASTR LP Balance </h3>
        <h4 className="banner_title">Once extracted, it can not be stored in the pool</h4>
        <div className="img_absoult">
          <img src="/images/ido/icon03.webp" alt="ASTR" />
          <img src="/images/ido/icon03.webp" alt="ASTR" />
        </div>
      </>
    );
  }, [lpTotalBalance]);
};
const ContributionComponents = () => {
  return useMemo(() => {
    return (
      <>
        <h2 className="h2">Contribution Your ASTR</h2>
        <div className="img">
          <img src="/images/ido/icon01.webp" alt="ASTR" />
          <img src="/images/ido/icon02.webp" alt="ASTR" />
        </div>
      </>
    );
  }, []);
};
const InitComponents = ({ nextEventTime }) => {
  // 15000000000 s
  const secondsRemaining = useNextEventCountdown(nextEventTime);
  const { days, hours, minutes, seconds } = getTimePeriods(secondsRemaining);
  return useMemo(() => {
    return (
      <div className="bottom">
        <h3 className="h3">Coming Soon</h3>
        <div className="timer_wrap">
          {secondsRemaining ? (
            <Timer
              minutes={minutes} // We don't show seconds - so values from 0 - 59s should be shown as 1 min
              hours={hours}
              days={days}
              seconds={seconds}
              bgColor="#030222"
            />
          ) : (
            <Timer
              minutes={0} // We don't show seconds - so values from 0 - 59s should be shown as 1 min
              hours={0}
              days={0}
              seconds={0}
              bgColor="#030222"
            />
          )}
        </div>
      </div>
    );
  }, [secondsRemaining, days, hours, minutes, seconds]);
};

const PROCINGComponents = ({
  idoState,
  max,
  dispatch,
  account,
  library,
  toastSuccess,
  toastError,
  toastWarning,
  accountkey,
}: IPROCINGComponents) => {
  const [val, setVal] = useState('');
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(new BigNumber(max), 18, 8);
  }, [max]);
  const fullLocalBalance = useMemo(() => {
    return getFullLocalDisplayBalance(new BigNumber(max), 18);
  }, [max]);

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);
  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'));
      }
    },
    [setVal],
  );
  const { title, btnTitle } = useMemo(() => {
    switch (idoState) {
      case IIdoStateEnum.PROCING:
        return {
          title: `Your Balance ${fullLocalBalance} ASTR`,
          btnTitle: 'Create LP',
        };
      case IIdoStateEnum.WAITINGGETLP:
        return {
          title: `AVAT-ASTR LP Balance: ${fullLocalBalance}`,
          btnTitle: 'Coming Soon',
        };
      case IIdoStateEnum.END:
        return {
          title: `AVAT-ASTR LP Balance: ${fullLocalBalance}`,
          btnTitle: 'Take LP',
        };
      default:
        return {
          title: '',
          btnTitle: '',
        };
    }
  }, [fullLocalBalance, idoState]);
  const { transfer, abort } = useIdoFun(account, library);
  const handlePresss = useCallback(async () => {
    if (idoState === IIdoStateEnum.END) {
      const res = await abort();
      if (typeof res === 'boolean') {
        toastSuccess('Congratulations!', 'Take LP Compounded!');
        setVal('');
        dispatch(
          fetchIdoAsync({
            account,
            library,
            accountkey,
          }),
        );
        return true;
      } else {
        toastError('Ops! Error', res);
        return false;
      }
    }
    if (idoState === IIdoStateEnum.PROCING) {
      if (!library || !account) {
        toastWarning('Warn', 'Some error happened!');
        return;
      }
      if (!val) {
        toastWarning('Warn', 'Please input amount!');
        return;
      }
      const res = await transfer(val);
      if (typeof res === 'boolean') {
        toastSuccess('Congratulations!', 'Create LP Compounded!');
        dispatch(
          fetchIdoAsync({
            account,
            library,
            accountkey,
          }),
        );
        return true;
      } else {
        toastError('Ops! Error', res);
        return false;
      }
    }
  }, [idoState, abort, transfer, val, toastError, toastSuccess, toastWarning, accountkey, account, dispatch, library]);
  return useMemo(() => {
    return (
      <div className="bottom">
        <h4 className="h4">{title}</h4>
        {idoState === IIdoStateEnum.PROCING ? (
          <div className="border">
            <InputBalance value={val} onSelectMax={handleSelectMax} onChange={handleChange} />
          </div>
        ) : null}
        {account ? (
          <Button
            className="btn"
            disabled={idoState === IIdoStateEnum.WAITINGGETLP ? true : false}
            onClick={handlePresss}
          >
            {btnTitle}
          </Button>
        ) : (
          <ConnectWalletButton className="btn" />
        )}
      </div>
    );
  }, [idoState, handleChange, handleSelectMax, handlePresss, val, title, btnTitle, account]);
};
const ContributionStyled = styled.div<{ paddingBottom: string }>`
  padding-bottom: ${({ paddingBottom }) => paddingBottom}px;
  position: relative;
  .inner {
    background-image: linear-gradient(140deg, #20d4a9 0%, #a428d0 79%);
    border-radius: 20px 20px 0 0;
    padding-bottom: 60px;
    ${({ theme }) => theme.mediaQueries.sm} {
      padding-bottom: 70px;
    }
    .h2_title {
      font-weight: 800;
      padding: 30px 30px 0;
      font-size: 48px;
      line-height: 60px;
      ${({ theme }) => theme.mediaQueries.md} {
        font-size: 80px;
        line-height: 90px;
        padding: 40px 36px 8px;
      }
    }
    .h3_title {
      font-size: 20px;
      font-weight: 800;
      line-height: 24px;
      padding: 30px 30px 24px;
      ${({ theme }) => theme.mediaQueries.md} {
        padding: 0 40px 24px;
      }
    }
    .img_absoult {
      position: absolute;
      bottom: 290px;
      right: 25px;
      ${({ theme }) => theme.mediaQueries.md} {
        top: 120px;
      }
      ${({ theme }) => theme.mediaQueries.md} {
        top: 180px;
      }
      img {
        float: right;
      }
      img:first-child {
        width: 30%;
        margin-right: 8%;
        opacity: 0.4;
        ${({ theme }) => theme.mediaQueries.md} {
          margin-right: 0;
          margin-top: 0;
        }
      }
      img:last-child {
        width: 58%;
        margin-top: 5px;
        margin-right: 30%;
        ${({ theme }) => theme.mediaQueries.md} {
          margin-top: 40px;
          margin-right: 20%;
        }
        ${({ theme }) => theme.mediaQueries.xl} {
          margin-top: 80px;
        }
      }
    }
    .banner_title {
      background-image: linear-gradient(90deg, #a428d0 0%, #20d4a9 100%);
      border-radius: 12px;
      font-size: 12px;
      line-height: 18px;
      padding: 16px 10% 13px 16px;
      width: 70%;
      margin-left: 30px;
      margin-bottom: 200px;
      position: relative;
      z-index: 9;
      ${({ theme }) => theme.mediaQueries.sm} {
        width: 50%;
        margin-bottom: 300px;
      }
      ${({ theme }) => theme.mediaQueries.md} {
        margin-bottom: 200px;
        margin-left: 40px;
      }
      ${({ theme }) => theme.mediaQueries.xl} {
        margin-bottom: 300px;
      }
    }
    .h2 {
      font-size: 36px;
      font-weight: 600;
      line-height: 40px;
      padding: 30px 30px 0;
      ${({ theme }) => theme.mediaQueries.md} {
        padding: 40px 40px 0;
        line-height: 52px;
        font-size: 38px;
      }
      ${({ theme }) => theme.mediaQueries.lg} {
        font-size: 48px;
      }
    }
    .h3 {
      font-size: 30px;
      font-weight: 600;
      text-align: center;
      padding-bottom: 20px;
      ${({ theme }) => theme.mediaQueries.md} {
        padding-bottom: 36px;
      }
    }
    .img {
      clear: both;
      overflow: hidden;
      padding-bottom: 20px;
      ${({ theme }) => theme.mediaQueries.sm} {
        padding-bottom: 60px;
      }
      ${({ theme }) => theme.mediaQueries.lg} {
        text-align: center;
        padding-top: 20px;
        padding-bottom: 120px;
      }
      img {
        display: inline-block;
        vertical-align: middle;
      }
      img:first-child {
        width: 55%;
        margin-left: 40%;
        margin-top: 20px;
        margin-right: 40px;
        ${({ theme }) => theme.mediaQueries.sm} {
          margin-top: 100px;
        }
        ${({ theme }) => theme.mediaQueries.lg} {
          margin-left: 0;
          width: 23%;
          margin-top: 170px;
          margin-right: 11%;
        }
      }
      img:last-child {
        width: 40%;
        padding-left: 10%;
        ${({ theme }) => theme.mediaQueries.lg} {
          width: 46%;
          padding-left: 0;
        }
      }
    }
    .bottom {
      width: 100%;
      left: 0;
      bottom: 0;
      position: absolute;
      padding: 30px 30px 40px;
      background-image: radial-gradient(circle at 50% 0%, #3e255b 0%, #181733 100%);
      box-shadow: 0 10px 20px 5px rgba(0, 0, 0, 0.03);
      border-radius: 20px;
      .timer_wrap {
        max-width: 402px;
        margin: 0 auto;
      }
      ${({ theme }) => theme.mediaQueries.lg} {
        padding: 40px 44px 44px;
      }
      .h4 {
        font-size: 14px;
        padding-bottom: 20px;
        text-align: center;
        ${({ theme }) => theme.mediaQueries.md} {
          font-size: 15px;
          padding-bottom: 27px;
        }
      }
      .border {
        border: 4px solid #2e2d5b;
        background-color: #030222;
        box-shadow: 0 10px 20px 5px rgba(0, 0, 0, 0.03);
        border-radius: 12px;
        padding: 0 20px;
        input {
          font-size: 20px;
          height: 70px;
          ${({ theme }) => theme.mediaQueries.md} {
            font-size: 30px;
            height: 72px;
          }
        }
        button {
          font-size: 16px;
        }
      }
      .btn {
        height: 60px;
        border-radius: 12px;
        margin-top: 20px;
        width: 100%;
        font-size: 16px;
        background-image: none;
        background-color: #1476ff;
        &:disabled,
        &.pancake-button--disabled {
          color: #fff;
          opacity: 0.6;
        }
        ${({ theme }) => theme.mediaQueries.md} {
          margin-top: 30px;
          font-size: 18px;
        }
      }
    }
  }
`;
export default Contribution;
