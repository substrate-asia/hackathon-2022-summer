import React, { FC } from 'react';
import styled from 'styled-components';
import { Button, Heading, Text } from '@my/ui';
import NoList from './NoList';
import Countdown from './Countdown';
import { IWithdrawRecordItem } from 'utils/types';
import useBlockNumber from 'state/application/hooks';
interface Iprops {
  withdraw: any;
  list: IWithdrawRecordItem[];
}
const UnbindList: FC<Iprops> = ({ list, withdraw }) => {
  const lastBlockNumber = useBlockNumber();
  console.log(withdraw);
  return (
    <UnbindListStyled>
      <Heading padding="0px 10px">Unbinding Rules</Heading>
      <Text padding="0px 10px" fontSize="12px" color="#F1842C" lineHeight="20px" fontWeight="600" mt="20px">
        Due to the rules of SDN dappstake it will take 2 days to unbind. When the time is up, you can claim it at any
        time
      </Text>
      <UlStyled>
        {list && list.length
          ? list
              .sort((a, b) => Number(b.era.toString()) - Number(a.era.toString()))
              .map((v, index) => {
                return (
                  <li key={index}>
                    <Text fontSize="12px" fontWeight="700">
                      {v.amount || '-'}
                    </Text>
                    <StatusWrap>
                      {v.status === 0 ? (
                        <Text fontSize="12px" color="#9DA6A6" bold>
                          Withdrawed
                        </Text>
                      ) : null}
                      {v.status === 1 && v.unbonding <= lastBlockNumber ? (
                        <ButtonStyled variant="secondary" onClick={withdraw}>
                          Withdrawed
                        </ButtonStyled>
                      ) : null}
                      {v.status === 1 && v.unbonding > lastBlockNumber ? (
                        <Countdown nextEventTime={(v.unbonding - lastBlockNumber) * 12} />
                      ) : null}
                      {/* {v.status === 2 ? <Countdown nextEventTime={v.time} /> : null} */}
                    </StatusWrap>
                  </li>
                );
              })
          : null}
      </UlStyled>
      {list.length === 0 ? <NoList /> : null}
    </UnbindListStyled>
  );
};
const StatusWrap = styled.div`
  text-align: center;
  width: 100px;
`;
const ButtonStyled = styled(Button)`
  border-radius: 12px;
  font-size: 10px;
  height: 28px;
  border-width: 1px;
  padding: 0;
  width: 100%;
`;
const UlStyled = styled.ul`
  margin-top: 20px;
  list-style: none;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    line-height: 20px;
    background: #1f252a;
    border: 1px solid #272e32;
    border-radius: 12px;
    padding: 12px 20px;
    margin-top: 8px;
  }
`;
const UnbindListStyled = styled.div`
  margin-left: 0;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 23px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  box-shadow: 2px 4px 7px 1px rgba(9, 2, 18, 0.3);
  margin-top: 12px;
  width: 600px;
  padding: 30px;
  @media screen and (min-width: 1200px) {
    margin-left: 12px;
    margin-top: 0;
    max-width: 320px;
  }
`;
export default UnbindList;
