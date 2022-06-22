import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { ButtonMenu, ButtonMenuItem } from '@my/ui';
import useTheme from 'hooks/useTheme';

const StyledNav = styled.nav`
  margin-bottom: 16px;
  display: flex;
  justify-content: center;

  > div {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const getActiveIndex = (pathname: string): number => {
  if (pathname.includes('/stake')) {
    return 0;
  }
  return 1;
};

const DappstakeSubNav = () => {
  const location = useLocation();
  const activeIndex = getActiveIndex(location.pathname);
  const { theme } = useTheme();
  return (
    <StyledNav>
      <ButtonMenu py="6px" activeIndex={activeIndex} scale="sm" variant="subtle">
        <ButtonMenuItem
          style={
            activeIndex === 0
              ? { color: theme.colors.text, background: theme.colors.cardBackground }
              : { color: theme.colors.textSubtle }
          }
          width="120px"
          height="32px"
          id="Stake-nav-link"
          to="/stake"
          as={Link}
        >
          Stake
        </ButtonMenuItem>
        <ButtonMenuItem
          style={
            activeIndex === 1
              ? { color: theme.colors.text, background: theme.colors.cardBackground }
              : { color: theme.colors.textSubtle }
          }
          width="120px"
          height="32px"
          id="Unstake-nav-link"
          to="/unstake"
          as={Link}
        >
          Unstake
        </ButtonMenuItem>
        {/* <ButtonMenuItem
          style={
            activeIndex === 1
              ? { color: theme.colors.text, background: theme.colors.cardBackground }
              : { color: theme.colors.textSubtle }
          }
          width="120px"
          height="32px"
          id="Unstake-nav-link"
          to="/unbind"
          as={Link}
        >
          Unbind
        </ButtonMenuItem> */}
      </ButtonMenu>
    </StyledNav>
  );
};

export default DappstakeSubNav;
