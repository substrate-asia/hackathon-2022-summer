import React, { useCallback, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from 'contexts/Localization';
import { Flex, LinkExternal, useMatchBreakpoints, useModal, useWalletModal } from '@my/ui';
import { getAddress } from 'utils/addressHelpers';
import DepositAction from './DepositAction';
import WithdrawAction from './WithdrawAction';
import { AprProps } from '../Apr';
import { MultiplierProps } from '../Multiplier';
import BigNumber from 'bignumber.js';
import { BIG_ZERO } from 'utils/bigNumber';
import { getBalanceNumber, getFullLocalDisplayBalance } from 'utils/formatBalance';
import { useWeb3React } from '@web3-react/core';
import MobileAction from './MobileAction';
import { useERC20 } from 'hooks/useContract';
import { useAppDispatch } from 'state';
import { IVault } from 'state/vault/types';
import { useVault, useVaultFarmUser } from 'state/vault/hooks';
import useAuth from 'hooks/useAuth';
import { chainId } from 'config/constants/tokens';
import { changeLoading, fetchVaultFarmUserDataAsync } from 'state/vault';
import { useSpecialApproveFarm } from 'views/Vault/hooks/useApproveFarm';
import { getDisplayApy } from 'views/Farms/Farms';
import useToast from 'hooks/useToast';
import { InfoContainer } from 'style/TableStyled';
import { showDecimals } from 'views/Vault/utils';
import AddLiquidityModal from '../modal/AddLiquidityModal';
import RemoveLiquidityModal from '../modal/RemoveLiquidityModal';
import { getBscScanLink } from 'utils';
// import { registerToken } from 'utils/wallet';
export interface ActionPanelProps {
  apr: AprProps;
  multiplier: MultiplierProps;
  details: IVault;
  userDataReady: boolean;
  expanded: boolean;
  index: number;
}

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 500px;
  }
`;

const collapseAnimation = keyframes`
  from {
    max-height: 500px;
  }
  to {
    max-height: 0px;
  }
`;

const Container = styled.div<{ expanded }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: unset;
  display: flex;
  flex-direction: column;
  margin: -44px 16px 20px;
  // border-radius: 12px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    overflow: hidden;
    margin: 0;
    background-color: ${({ theme }) => theme.colors.background02};
    padding: 24px 64px;
  }
`;

const StyledLinkExternal = styled(LinkExternal)`
  color: ${({ theme }) => theme.colors.primaryDark};
  font-weight: 600;
  font-size: 12px;
  padding: 4px 10px 4px 0;
  white-space: nowrap;
  cursor: pointer;

  svg {
    width: 14px;
    path {
      fill: ${({ theme }) => theme.colors.primaryDark};
    }
  }
`;

const ActionContainer = styled.div`
  flex-direction: column;
  flex-flow: row wrap;
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
  }
`;
const InfoContainerSmall = styled(Flex)`
  margin-top: 10px;
  padding-top: 6px;
  justify-content: start;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  flex-wrap: wrap;
`;

const DetailContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 8px 16px;
  margin-top: 14px;
  p {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${({ theme }) => theme.colors.textSubtle};
    font-size: 12px;
    font-weight: 600;
    padding: 6px 0;
  }
  i {
    text-align: right;
    display: block;
    font-style: normal;
    font-size: 12px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.text};
    &.green {
      font-size: 15px;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.success};
      margin-bottom: 3px;
    }
    &.grey {
      color: ${({ theme }) => theme.colors.textSubtle};
    }
  }
  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`;

const ActionPanel: React.FunctionComponent<ActionPanelProps> = ({
  details,
  apr,
  multiplier,
  userDataReady,
  expanded,
  index,
}) => {
  const vault = details;
  const { isXl, isLg } = useMatchBreakpoints();
  const isMobile = !(isXl || isLg);
  const { t } = useTranslation();
  const lpAddress = getAddress(vault.farm.lpAddresses);
  const { account } = useWeb3React();
  const { avaultAddressBalance, allowance } = useVaultFarmUser(account, vault?.farm?.pid ?? 0);
  const isApproved = account && allowance && allowance.isGreaterThan(0);
  // const isMetaMaskInScope = !!window.ethereum?.isMetaMask;
  // const stakingBigNumber = new BigNumber(vault.farm?.userData?.stakingTokenBalance??"0");
  let earnings = BIG_ZERO;
  let displayEarningsBalance: string = '0';

  const userData = vault?.farm?.userData ?? {};
  const _userDataKey = `${account}-${chainId}`;
  const _userData = userData[_userDataKey] ?? {
    account: '',
    allowance: '0',
    stakingTokenBalance: '0',
    stakedBalance: '0',
    pendingReward: '0',
    avaultAddressBalance: '0',
    userVaultSupply: '0',
  };

  // If user didn't connect wallet default balance will be 0
  if (isApproved) {
    const _wantLockedTotal = new BigNumber(vault.vault.wantLockedTotal);
    const _totalSupply = new BigNumber(vault.vault.totalSupply);
    // _totalSupply： 282962782793973
    // avaultAddressBalance： 89962782593973
    // _wantLockedTotal： 284598115334499
    // console.log('earnings: ', _wantLockedTotal.toString(), _totalSupply.toString(), avaultAddressBalance.toString());
    if (avaultAddressBalance.toNumber() > 0 && _totalSupply.toNumber() > 0) {
      earnings = _wantLockedTotal.dividedBy(_totalSupply).times(avaultAddressBalance);
      // console.log('earnings: ', earnings);
      // earnings = getBalanceAmount(_value, vault.farm.lpAddressDecimals);
      // wantLockedTotal / totalSupply()*CLpAmount
      // earningsBusd = earnings.multipliedBy(cakePrice).toNumber();
      displayEarningsBalance = getFullLocalDisplayBalance(
        earnings,
        vault.farm.lpAddressDecimals,
        showDecimals(vault.lpDetail.symbol),
      );
    }
  }
  const [onAddLiquidity] = useModal(
    <AddLiquidityModal account={account} vault={vault} />,
    false,
    false,
    `onAddLiquidity${index}`,
  );
  const [onRemoveLiquidity] = useModal(
    <RemoveLiquidityModal account={account} vault={vault} />,
    false,
    false,
    `onRemoveLiquidity${index}`,
  );

  const lpContract = useERC20(lpAddress);
  const [requestedApproval, setRequestedApproval] = useState(false);
  const [requestedApprovalSuccess, setRequestedApprovalSuccess] = useState(true);
  // const { onApprove } = useSpecialApproveFarm(lpContract, vault.vault.masterChef);
  const { onApprove } = useSpecialApproveFarm(lpContract, vault.contractAddress[chainId]);
  const dispatch = useAppDispatch();
  const { data: vaults } = useVault();
  const { toastSuccess, toastError } = useToast();
  const { login, logout } = useAuth();
  const { onPresentConnectModal } = useWalletModal(login, logout);
  const handleApprove = useCallback(async () => {
    if (!account) {
      onPresentConnectModal();
      return;
    }
    // setRequestedApproval(true);
    // setTimeout(() => {
    //   setRequestedApproval(false);
    // }, 80000);
    try {
      setRequestedApproval(true);
      const result = await onApprove();
      if (typeof result === 'boolean' && result) {
        dispatch(changeLoading());
        // dispatch(changeVaultItemLoading({ index }));
        dispatch(fetchVaultFarmUserDataAsync({ account, vaults, index }));
        toastSuccess('Approve!', 'Your are Approved');
        setTimeout(() => {
          setRequestedApprovalSuccess(true);
        }, 10000);
      } else {
        const message = result ? result : 'Your approved failed';
        toastError('Approve!', message);
        setRequestedApprovalSuccess(false);
        setTimeout(() => {
          setRequestedApprovalSuccess(true);
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRequestedApproval(false);
    }
  }, [onApprove, dispatch, onPresentConnectModal, index, account, vaults, toastError, toastSuccess]);

  return (
    <Container expanded={expanded}>
      <InfoContainer>
        <StyledLinkExternal
          hideIcon={true}
          onClick={() => {
            if (!account) {
              onPresentConnectModal();
              return;
            }
            onAddLiquidity();
          }}
        >
          Add Liquidity
        </StyledLinkExternal>
        <StyledLinkExternal
          hideIcon={true}
          onClick={() => {
            if (!account) {
              onPresentConnectModal();
              return;
            }
            onRemoveLiquidity();
          }}
        >
          Remove Liquidity
        </StyledLinkExternal>
        <StyledLinkExternal href={`${getBscScanLink(vault.contractAddress[chainId], 'token')}`}>
          {t('View Contract')}
        </StyledLinkExternal>
        {/* 
        {account && isMetaMaskInScope && vault.farm.lpAddresses && (
          <StyledLinkExternal
            hideIcon={true}
            onClick={() => registerToken(vault.farm.lpAddresses, vault.farm.lpSymbol, vault.farm.lpAddressDecimals)}
          >
            Add LP to Metamask
          </StyledLinkExternal>
        )} */}
      </InfoContainer>
      <DetailContainer>
        <p>
          TVL
          <i>${vault?.vault?.liquidity ?? ''}</i>
        </p>
        <p>
          APY
          <em>
            <i className="green">{vault?.farm?.apy ? getDisplayApy(Number(vault.farm.apy)) + '%' : ''}</i>
            <i className="grey">Avault APR: 0.00%</i>
            <i className="grey">
              {vault.lpDetail.symbol} APY: &nbsp;
              {vault?.farm?.apy ? getDisplayApy(Number(vault.farm.apy)) + '%' : ''}
            </i>
          </em>
        </p>
        <p>
          wallet balance
          <em>
            <i>
              {getBalanceNumber(new BigNumber(_userData.avaultAddressBalance)).toLocaleString('en-US', {
                maximumFractionDigits: showDecimals(vault.lpDetail.symbol),
              })}{' '}
              {vault?.vault.symbol}
            </i>
            <i>
              {getFullLocalDisplayBalance(
                new BigNumber(_userData.stakingTokenBalance),
                vault.farm.lpAddressDecimals,
                showDecimals(vault.lpDetail.symbol),
              )}{' '}
              {vault.lpDetail.symbol}
            </i>
          </em>
        </p>
        <InfoContainerSmall>
          <StyledLinkExternal hideIcon={true} onClick={onAddLiquidity}>
            Add Liquidity
          </StyledLinkExternal>
          <StyledLinkExternal hideIcon={true} onClick={onRemoveLiquidity}>
            Remove Liquidity
          </StyledLinkExternal>
          <StyledLinkExternal href={`${getBscScanLink(vault.contractAddress[chainId], 'token')}`}>
            View Contract
          </StyledLinkExternal>
        </InfoContainerSmall>
      </DetailContainer>
      {isMobile ? (
        <MobileAction
          requestedApprovalSuccess={requestedApprovalSuccess}
          lpToCLpRate={vault.vault.lpToCLpRate}
          requestedApproval={requestedApproval}
          isApproved={isApproved}
          pid={vault.farm.pid}
          displayBalance={getFullLocalDisplayBalance(
            new BigNumber(_userData.stakingTokenBalance),
            vault.farm.lpAddressDecimals,
            showDecimals(vault.lpDetail.symbol),
          )}
          displayEarningsBalance={displayEarningsBalance}
          earnings={earnings}
          userDataReady={userDataReady}
          handleApprove={handleApprove}
          account={account}
          lpSymbol={vault.lpDetail.symbol}
          contractAddress={vault.contractAddress[chainId]}
          stakingTokenBalance={new BigNumber(_userData.stakingTokenBalance)}
          lpAddressDecimals={vault.farm.lpAddressDecimals}
          index={index}
        />
      ) : (
        <ActionContainer style={{ justifyContent: 'end' }}>
          <DepositAction
            contractAddress={vault.contractAddress[chainId]}
            lpAddressDecimals={vault.farm.lpAddressDecimals}
            requestedApproval={requestedApproval}
            requestedApprovalSuccess={requestedApprovalSuccess}
            isApproved={isApproved}
            displayBalance={getFullLocalDisplayBalance(
              new BigNumber(_userData.stakingTokenBalance),
              vault.farm.lpAddressDecimals,
              showDecimals(vault.lpDetail.symbol),
            )}
            displayEarningsBalance={displayEarningsBalance}
            earnings={earnings}
            handleApprove={handleApprove}
            userDataReady={userDataReady}
            pid={vault.farm.pid}
            name={vault.vault.name}
            lpSymbol={vault.lpDetail.symbol}
            index={index}
          />
          <div className="w20"></div>
          <WithdrawAction
            lpToCLpRate={vault.vault.lpToCLpRate}
            contractAddress={vault.contractAddress[chainId]}
            lpAddressDecimals={vault.farm.lpAddressDecimals}
            requestedApproval={requestedApproval}
            isApproved={isApproved}
            displayBalance={getFullLocalDisplayBalance(
              new BigNumber(_userData.stakingTokenBalance),
              vault.farm.lpAddressDecimals,
              showDecimals(vault.lpDetail.symbol),
            )}
            displayEarningsBalance={displayEarningsBalance}
            earnings={earnings}
            userDataReady={userDataReady}
            handleApprove={handleApprove}
            pid={vault.farm.pid}
            name={vault.vault.name}
            lpSymbol={vault.lpDetail.symbol}
            index={index}
          />
        </ActionContainer>
      )}
    </Container>
  );
};

export default ActionPanel;
