import React, { FC } from 'react';
import styled from 'styled-components';
import UserWidget from './UserWidget';
import Logo from './Logo';
import Nav from './Nav';
import { Flex } from '@my/ui';
import { useLocation } from 'react-router-dom';
const Header: FC<{ className?: string; setCollapsed: (collapsed: boolean) => void; collapsed: boolean }> = ({
  className,
  setCollapsed,
  collapsed,
}) => {
  const { pathname } = useLocation();
  const hasBorder = pathname.includes('governance');
  return (
    <header className={className}>
      <InnerStyled hasBorder={hasBorder}>
        <FlFlex>
          <Logo collapsed={collapsed} />
          <Nav collapsed={collapsed} />
        </FlFlex>
        <div className="right">
          <UserWidget />
        </div>
      </InnerStyled>
    </header>
  );
};
const FlFlex = styled(Flex)`
  align-items: center;
  justify-content: flex-start;
`;
const InnerStyled = styled.div<{ hasBorder: boolean }>`
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  // border-bottom: 1px solid ${({ theme, hasBorder }) =>
    hasBorder ? theme.colors.background : theme.colors.borderColor};
  ${({ theme }) => theme.mediaQueries.md} {
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
    height: 82px;
    padding-left: 0;
    padding-right: 0;
  }
  > img {
    width: 25px;
    height: 20px;
  }

  > .right {
    // background-color: ${({ theme }) => theme.colors.background};
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 40px;
    // display: flex;
    // align-items: center;
    ${({ theme }) => theme.mediaQueries.md} {
      background-color: ${({ theme }) => theme.colors.background};
      padding-top: 30px;
      padding-bottom: 30px;
    }
  }
`;

export default styled(Header)`
  // position: fixed;
  // top: 0px;
  // width: 100%;
  position: relative;
  z-index: 98;
  // background-color: ${({ theme }) => theme.colors.background};
`;
