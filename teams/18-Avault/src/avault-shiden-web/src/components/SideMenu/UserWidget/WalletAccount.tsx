import React from 'react';
import styled from 'styled-components';
import { Flex, useTooltip } from '@my/ui';
import ConnectWalletButton from '../../ConnectWalletButton';
import PolkadotAccounts from './WalletAccountInfo/PolkadotAccounts';
import BscAccountInfo from './WalletAccountInfo/BscAccountInfo';
import { useWeb3React } from '@web3-react/core';
import { chainKey } from 'config';
import useAuth from 'hooks/useAuth';
const WalletAccountInfo = () => {
  const { account } = useWeb3React();
  const { logout } = useAuth();
  const { tooltip: tooltip_P, tooltipVisible: tooltipVisible_P } = useTooltip(
    chainKey === 'SDN' ? PolkadotAccounts : BscAccountInfo,
    {
      trigger: 'click',
      placement: 'top-end',
      hideArrow: false,
      tooltipOffset: [20, 10],
    },
  );

  return (
    <>
      {tooltipVisible_P && tooltip_P}
      {account ? (
        <WalletAccount onClick={logout}>
          {account ? `${account.substring(0, 5)}...${account.substring(account.length - 4)}` : ''}
        </WalletAccount>
      ) : (
        <ConnectWalletButton scale="sm" />
      )}
    </>
  );
};
const WalletAccount = styled(Flex)`
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  height: 36px;
  width: 140px;
  background-image: linear-gradient(90deg, #a428d0 0%, #20d4a9 100%);
  border-radius: 8px;
  width: 140px;
  padding: 0 12px;
  cursor: pointer;
  .head_icon {
    display: block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 8px;
  }
`;
export default WalletAccountInfo;
