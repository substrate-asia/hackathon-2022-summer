import React, { FC } from 'react';
import styled from 'styled-components';
import { Flex } from '@my/ui';
import { GetDAppApr } from '../hooks/getApr';
import { IDappStakingInterface } from 'utils/types';
import { IDappPoolDataInterface } from '../hooks/getPoolUpdate';
const Header = styled.div`
  padding: 24px 22px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 24px 60px;
  }
`;
const HeaderUl = styled(Flex)`
  padding: 10px 0;
  justify-content: center;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 20px 5px rgba(0, 0, 0, 0.03);
  border-radius: 12px;
`;
const HeaderLi = styled.div`
  padding: 0 15px;
`;
const Title = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.cardBackground};
  font-weight: 600;
  font-size: 20px;
  padding-bottom: 12px;
`;
const HeaderTitleH3 = styled.h3`
  color: ${({ theme }) => theme.colors.cardBackground};
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
  }
`;

interface Iprops {
  contract: IDappStakingInterface;
  pool: IDappPoolDataInterface;
}
const StakeTableHeader: FC<Iprops> = ({ contract, pool }) => {
  const _apr = GetDAppApr(contract);
  return (
    <Header>
      <Title>1 AVAT=1.001256 aAVAT</Title>
      <HeaderUl>
        <HeaderLi>
          <HeaderTitleH3>APR: {_apr}%</HeaderTitleH3>
        </HeaderLi>
        <HeaderLi>
          <HeaderTitleH3>Staked: {pool.totalSupply} aAVAT</HeaderTitleH3>
        </HeaderLi>
      </HeaderUl>
    </Header>
  );
};
export default StakeTableHeader;
