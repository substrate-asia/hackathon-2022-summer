import React, { FC } from 'react';
import styled from 'styled-components';
const HomeLogo: FC<{ collapsed: boolean }> = ({ collapsed }) => {
  return (
    <LogoStyle href="/">
      <img src={collapsed ? '/images/logo_small_beta.svg' : '/images/logo_beta.svg'} alt="" />
    </LogoStyle>
  );
};
const LogoStyle = styled.a`
  display: block;
  margin-right: 0;
  margin-top: 0;
  height: 34px;
  ${({ theme }) => theme.mediaQueries.md} {
    height: 50px;
    margin-top: 0;
    margin-right: 48px;
  }
  img {
    display: block;
    margin-top: 0;
    height: 34px;
    width: 34px;
    ${({ theme }) => theme.mediaQueries.md} {
      // margin-top: -4px;
      width: 164px;
      height: 50px;
    }
  }
`;
export default HomeLogo;
