import React, { FC } from 'react';
import styled from 'styled-components';
import DisconnectedPng from './imgs/disconnected.png';
import NoLiquidityPng from './imgs/no-liquidity.png';

const Body = styled.div`
  background: #12171a;
  border: 2px dashed #272e32;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 21px 0px 29px 0px;

  > img {
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
  }
  > div {
    color: #9da6a6;
  }
`;

const Status: FC<{ status: 'not-connected' | 'no-liquidity'; span: string }> = ({ status, span }) => {
  return (
    <Body>
      <img src={status === 'not-connected' ? DisconnectedPng : NoLiquidityPng} alt="" />
      <div>{span}</div>
    </Body>
  );
};

export default Status;
