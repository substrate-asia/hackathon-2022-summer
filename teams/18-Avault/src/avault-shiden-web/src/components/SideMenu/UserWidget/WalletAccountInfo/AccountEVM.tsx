import React, { FC } from 'react';
import styled from 'styled-components';
import useAuth from 'hooks/useAuth';
import { Flex, Heading, Text } from '@my/ui';
import { useAccountInfo } from '../hooks/useAccountInfo';
const AccountEVM: FC<{ className?: string }> = ({ className }) => {
  const { logout } = useAuth();
  const [accountSort, karsierNft] = useAccountInfo();
  return (
    <div className={className}>
      <Flex justifyContent="space-between" alignItems="center" className="account_header">
        <HeadIcon src={karsierNft} alt="header_default" />
        <Mid>
          <Heading color="primary">{accountSort} </Heading>
          <Text fontSize="12px" color="textSubtle">
            Metamask
          </Text>
        </Mid>

        <Btn onClick={logout}>Disconnect</Btn>
      </Flex>
    </div>
  );
};
const Btn = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  font-size: 12px;
  padding: 6px 13px;
  ont-weight: 600;
  border-radius: 12px;
  cursor: pointer;
`;
const Mid = styled.div`
  width: 150px;
`;
const HeadIcon = styled.img`
  display: block;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
`;
export default AccountEVM;
