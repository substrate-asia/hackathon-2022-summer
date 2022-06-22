import { Flex, useModal } from '@my/ui';
import Page from 'components/Layout/Page';
import { chainId } from 'config/constants/tokens';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { delay } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useAppDispatch } from 'state';
import { ILockAVATModalState } from 'views/Governance/state/governance/types';
import styled from 'styled-components';
import LockAVATModal from './components/Modal/LockAVATModal';
import Rewards from './components/Rewards';
import Stake from './components/Stake';
import StakeingInfo from './components/StakeingInfo';
import { changeLockAVATModalState, fetchUserDataApproveAsync, fetchUserDataAsync } from './state/governance';
import { useGovernanceData, useInit, useVeAVATFun } from './state/governance/hooks';
import useToast from 'hooks/useToast';
import { Dispatch } from 'react';

const Governance = () => {
  const { account } = useActiveWeb3React();
  const dispatch: Dispatch<any> = useAppDispatch();
  const {
    lockedState,
    apy,
    avarageLockTime,
    totalAVATLocked,
    userData: _userData = {},
    isUserLoaded,
    grassHouseList,
  } = useGovernanceData();
  const { approve, createLock, increaseLockAmount, increaseUnlockTime, withdraw } = useVeAVATFun();
  useInit(account, dispatch, grassHouseList);
  const userData = useMemo(() => {
    const _userDataKey = `${account}-${chainId}`;
    return _userData[_userDataKey];
  }, [_userData, account]);
  const { AVATBalance = '0' } = userData || {};

  const [requestedApprovalPendingTx, setRequestedApprovalPendingTx] = useState(false);
  const { toastSuccess, toastError } = useToast();
  const handleApprove = useCallback(async () => {
    if (!account) {
      return;
    }
    setRequestedApprovalPendingTx(true);
    const res = await approve();
    if (typeof res === 'boolean') {
      toastSuccess('Congratulations!', 'Approve Compounded!');
      dispatch(fetchUserDataApproveAsync({ account, userData }));
    } else {
      toastError('Ops! Error', res);
    }
    setRequestedApprovalPendingTx(false);
  }, [approve, userData, account, dispatch, toastError, toastSuccess]);
  const handleCreateLock = useCallback(
    async ({ amount, unlockTime }: { amount: string; unlockTime: string }) => {
      if (!account) {
        return;
      }
      const res = await createLock({ amount, unlockTime });
      if (typeof res === 'boolean') {
        toastSuccess('Congratulations!', 'Create Lock Compounded!');
        dispatch(fetchUserDataAsync({ account }));
        return true;
      } else {
        toastError('Ops! Error', res);
        return false;
      }
    },
    [account, createLock, dispatch, toastError, toastSuccess],
  );
  const handleIncreaseLockAmount = useCallback(
    async ({ amount }: { amount: string }) => {
      if (!account) {
        return;
      }
      const res = await increaseLockAmount({ amount });
      if (typeof res === 'boolean') {
        toastSuccess('Congratulations!', 'Increase lock amount Compounded!');
        dispatch(fetchUserDataAsync({ account }));
        return true;
      } else {
        toastError('Ops! Error', res);
        return false;
      }
    },
    [account, dispatch, increaseLockAmount, toastError, toastSuccess],
  );
  const handleIncreaseUnlockTime = useCallback(
    async ({ newUnlockTime }: { newUnlockTime: string }) => {
      if (!account) {
        return;
      }
      const res = await increaseUnlockTime({ newUnlockTime });
      if (typeof res === 'boolean') {
        toastSuccess('Congratulations!', 'Increase lock time Compounded!');
        dispatch(fetchUserDataAsync({ account }));
        return true;
      } else {
        toastError('Ops! Error', res);
        return false;
      }
    },
    [account, dispatch, increaseUnlockTime, toastError, toastSuccess],
  );
  const handleWithdraw = useCallback(async () => {
    if (!account) {
      return;
    }
    const res = await withdraw();
    if (typeof res === 'boolean') {
      toastSuccess('Congratulations!', 'Withdraw Compounded!');
      dispatch(fetchUserDataAsync({ account }));
      return true;
    } else {
      toastError('Ops! Error', res);
      return false;
    }
  }, [account, dispatch, withdraw, toastError, toastSuccess]);

  const [onPresentLockAVATModal] = useModal(
    <LockAVATModal
      account={account}
      max={AVATBalance}
      isUserLoaded={isUserLoaded}
      handleCreateLock={handleCreateLock}
      handleIncreaseLockAmount={handleIncreaseLockAmount}
      handleIncreaseUnlockTime={handleIncreaseUnlockTime}
      handleWithdraw={handleWithdraw}
    />,
  );
  const onClickModal = useCallback(
    (state: ILockAVATModalState) => {
      dispatch(changeLockAVATModalState({ lockAVATModalState: state }));
      delay(onPresentLockAVATModal, 100);
    },
    [onPresentLockAVATModal, dispatch],
  );
  return (
    <PageStyled>
      <PageWrapFlex>
        <StakeingInfo apy={apy} totalAVATLocked={totalAVATLocked} avarageLockTime={avarageLockTime} />
        <Stake
          lockedState={lockedState}
          handleApprove={handleApprove}
          userData={userData}
          account={account}
          onClickModal={onClickModal}
          requestedApprovalPendingTx={requestedApprovalPendingTx}
        />
        <Rewards
          grassHouseList={grassHouseList}
          account={account}
          toastSuccess={toastSuccess}
          toastError={toastError}
          dispatch={dispatch}
        />
      </PageWrapFlex>
    </PageStyled>
  );
};
const PageStyled = styled(Page)`
  // padding-top: 20px;
  background-image: url('./images/stake/bg_element.svg');
  background-size: 420px;
  background-repeat: no-repeat;
  background-position: 60px 30px;
  padding-bottom: 120px;
  // ${({ theme }) => theme.mediaQueries.sm} {
  //   padding-top: 60px;
  // }
  // ${({ theme }) => theme.mediaQueries.md} {
  //   padding-top: 100px;
  // }
`;
const PageWrapFlex = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-top: 10px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 0;
  }
  & > div {
    background-color: #181733;
    border: 1px solid #2e2d5b;
    box-shadow: 0 10px 20px 5px rgba(0, 0, 0, 0.03);
    border-radius: 20px;

    &:nth-child(1) {
      height: 420px;
    }
    &:nth-child(2) {
      height: 460px;
    }
    &:nth-child(1),
    &:nth-child(2) {
      width: 100%;
      margin-bottom: 20px;
      ${({ theme }) => theme.mediaQueries.sm} {
        height: 500px;
      }
      ${({ theme }) => theme.mediaQueries.md} {
        margin-bottom: 0;
        width: 49%;
        max-width: 585px;
      }
      ${({ theme }) => theme.mediaQueries.lg} {
        height: 638px;
      }
    }
    // &:nth-child(2) {
    //   margin-left: 2%;
    // }
    &:nth-child(3) {
      width: 100%;
      margin-bottom: 20px;
      border: none;
      background-color: transparent;
      ${({ theme }) => theme.mediaQueries.md} {
        background-color: #181733;
        border: 1px solid #2e2d5b;
        margin-top: 40px;
        margin-bottom: 0;
      }
    }
  }
`;
export default Governance;
