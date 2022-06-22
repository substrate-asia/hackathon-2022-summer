import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useModal, Text, Flex, MinusBtnIcon, AddBtnIcon, useWalletModal } from '@my/ui';
import { useLocation } from 'react-router-dom';
import { BigNumber } from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { useFarmUser } from 'state/farms/hooks';
import { fetchFarmUserDataAsync } from 'state/farms';
import { useERC20, usePairContract, useSpecialMasterchef } from 'hooks/useContract';
import { BASE_ADD_LIQUIDITY_URL } from 'config';
import { useAppDispatch } from 'state';
import { getAddress } from 'utils/addressHelpers';
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts';
import { getBalanceAmount, getFullDisplayBalance } from 'utils/formatBalance';
import useUnstakeFarms from '../../../hooks/useUnstakeFarms';
import DepositModal from '../../DepositModal';
import WithdrawModal from '../../WithdrawModal';
import useStakeFarms from '../../../hooks/useStakeFarms';
import useApproveFarm from '../../../hooks/useApproveFarm';
import { HelfButton } from './styles';
import useAuth from 'hooks/useAuth';
import { ActionContainer } from 'style/TableStyled';
import { FarmWithStakedValue } from '../FarmTable';
import masterChef_aAVT from 'config/abi/masterchef_aavt_shiden.json';
import useTransactionDeadline from 'hooks/useTransactionDeadline';
import { ROUTER_ADDRESS } from 'config/constants';
import { chainId } from 'config/constants/tokens';
import { Contract, ethers } from 'ethers';
import { splitSignature } from 'ethers/lib/utils';
import useActiveWeb3React from 'hooks/useActiveWeb3React';

const IconButtonWrapper = styled.div`
  display: flex;
`;
const TextTop = styled.div`
  display: none;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`;
const FlexStyled = styled(Flex)`
  margin-top: 0;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 12px;
  }
`;
interface StackedActionProps {
  farm: FarmWithStakedValue;
  userDataReady: boolean;
}

const Staked: React.FunctionComponent<StackedActionProps> = ({ farm, userDataReady }) => {
  const { pid, lpSymbol, lpAddresses, quoteToken, lpMasterChefes, token } = farm;
  const { account } = useWeb3React();
  const [requestedApproval, setRequestedApproval] = useState(false);
  const { allowance, tokenBalance, stakedBalance } = useFarmUser(pid);
  const lpMasterChef = getAddress(lpMasterChefes);
  const { onStake } = useStakeFarms(masterChef_aAVT, lpMasterChef, pid);
  const { onUnstake } = useUnstakeFarms(masterChef_aAVT, lpMasterChef, pid);
  const location = useLocation();
  const isApproved = account && allowance && allowance.isGreaterThan(0);

  const lpAddress = getAddress(lpAddresses);
  const lpContract = useERC20(lpAddress);

  const { onApprove } = useApproveFarm(masterChef_aAVT, lpMasterChef, lpContract);
  const { login, logout } = useAuth();
  const { onPresentConnectModal } = useWalletModal(login, logout);

  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(
    null,
  );
  const deadline = useTransactionDeadline();
  const { library } = useActiveWeb3React();
  const masterChefContract = useSpecialMasterchef(masterChef_aAVT, lpMasterChef);
  const pairContract: Contract | null = usePairContract(lpAddress);

  const dispatch = useAppDispatch();

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
  });
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`;

  const handleStake = async (amount: string) => {
    await onStake(amount);
    // await onStake(amount, signatureData.deadline, signatureData.v, signatureData.r, signatureData.s);
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }));
  };

  const handleUnstake = async (amount: string) => {
    await onUnstake(amount);
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }));
  };
  const [onPresentWithdraw] = useModal(
    <WithdrawModal farm={farm} max={stakedBalance} onConfirm={handleUnstake} tokenName={lpSymbol} />,
  );

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(stakedBalance);
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0000001)) {
      return stakedBalanceBigNumber.toFixed(10, BigNumber.ROUND_DOWN);
    }
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0001)) {
      return getFullDisplayBalance(stakedBalance).toLocaleString();
    }
    return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN);
  }, [stakedBalance]);

  const [onPresentDeposit] = useModal(
    <DepositModal
      farm={farm}
      max={tokenBalance}
      onConfirm={handleStake}
      tokenName={lpSymbol}
      addLiquidityUrl={addLiquidityUrl}
    />,
  );

  if (isApproved && stakedBalance.gt(0)) {
    return (
      <ActionContainer smallBorder={true}>
        <FlexStyled>
          <div>
            <Text bold color="text" fontSize="12px" lineHeight="27px">
              {lpSymbol} Staked
            </Text>
            <Text marginTop="4px" color="primary" bold fontSize="18px" lineHeight="22px">
              {displayBalance()}
            </Text>
          </div>
          <IconButtonWrapper>
            <MinusBtnIcon cursor="pointer" width="36px" onClick={onPresentWithdraw} mr="8px" />
            <AddBtnIcon
              onClick={() => {
                if (['history', 'archived'].some((item) => location.pathname.includes(item))) {
                  return null;
                }
                onPresentDeposit();
              }}
              opacity={['history', 'archived'].some((item) => location.pathname.includes(item)) ? '0.8' : '1'}
              width="36px"
            />
          </IconButtonWrapper>
        </FlexStyled>
      </ActionContainer>
    );
  }

  // if (!isApproved && account && userDataReady) {
  // return (
  //   <ActionContainer smallBorder={false}>
  //     <TextTop>
  //       <Text bold color="text" fontSize="12px" lineHeight="27px">
  //         Approve {lpSymbol === 'AVAT' ? 'aAVAT' : 'AVAT'}
  //       </Text>
  //     </TextTop>
  //     <LongButton disabled={requestedApproval} onClick={handleApprove} variant="secondary">
  //       Approve
  //     </LongButton>
  //   </ActionContainer>
  // );
  // }
  // const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address);
  console.log({ deadline });
  async function onAttemptToApprove() {
    // try to gather a signature for permission
    if (!deadline) throw new Error('missing dependencies');
    console.log(pairContract.nonces);
    const nonce = await pairContract.nonces(account);
    // const nonce = await masterChefContract.nonces(account);
    console.log({ nonce });
    // const EIP712Domain = [
    //   { name: 'name', type: 'string' },
    //   { name: 'version', type: 'string' },
    //   { name: 'chainId', type: 'uint256' },
    //   { name: 'verifyingContract', type: 'address' },
    // ];
    // const domain = {
    //   name: 'Kaco LPs',
    //   version: '1',
    //   chainId,
    //   verifyingContract: lpMasterChef,
    // };
    // const Permit = [
    //   { name: 'owner', type: 'address' },
    //   { name: 'spender', type: 'address' },
    //   { name: 'value', type: 'uint256' },
    //   { name: 'nonce', type: 'uint256' },
    //   { name: 'deadline', type: 'uint256' },
    // ];
    // const message = {
    //   owner: account,
    //   spender: ROUTER_ADDRESS[chainId],
    //   value: ethers.constants.MaxUint256.toString(),
    //   nonce: nonce.toHexString(),
    //   deadline: deadline.toNumber(),
    // };
    // const data = JSON.stringify({
    //   types: {
    //     EIP712Domain,
    //     Permit,
    //   },
    //   domain,
    //   primaryType: 'Permit',
    //   message,
    // });
    // library
    //   .send('eth_signTypedData_v4', [account, data])
    //   .then(splitSignature)
    //   .then((signature) => {
    //     setSignatureData({
    //       v: signature.v,
    //       r: signature.r,
    //       s: signature.s,
    //       deadline: deadline.toNumber(),
    //     });
    //   })
    //   .catch((err) => {
    //     // console.log('sign err', err);
    //     // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
    //     if (err?.code !== 4001) {
    //       handleApprove();
    //     }
    //   });
  }
  const handleApprove = async () => {
    if (!account) {
      onPresentConnectModal();
      return;
    }
    try {
      setRequestedApproval(true);
      await onApprove();
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }));

      setRequestedApproval(false);
    } catch (e) {
      console.error(e);
    }
  };
  // console.log({ isApproved, userDataReady });
  return (
    <ActionContainer smallBorder={false}>
      <TextTop>
        <Text bold color="text" fontSize="12px" lineHeight="27px">
          Stake {lpSymbol}
        </Text>
      </TextTop>
      <Flex alignContent="center" justifyContent="space-between">
        <HelfButton
          disabled={requestedApproval || !userDataReady || !(!isApproved && account)}
          onClick={onAttemptToApprove}
          variant="secondary"
        >
          Approve
        </HelfButton>
        <HelfButton
          onClick={() => {
            if (account) {
              onPresentDeposit();
            } else {
              onPresentConnectModal();
            }
          }}
          disabled={
            (account && !isApproved) ||
            !userDataReady ||
            ['history', 'archived'].some((item) => location.pathname.includes(item))
          }
        >
          {account ? 'Stake' : 'Connect Wallet'}
        </HelfButton>
      </Flex>
    </ActionContainer>
  );
};

export default Staked;
