import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { ButtonMenu, ButtonMenuItem } from '@my/ui';
import useTheme from 'hooks/useTheme';

const StyledNav = styled.nav`
  margin-bottom: 40px;
  display: flex;
  justify-content: center;

  > div {
    background-color: ${({ theme }) => theme.colors.cardBackground};
  }
`;

const getActiveIndex = (pathname: string): number => {
  if (pathname.includes('/burn')) {
    return 1;
  }
  return 0;
};

const Nav = () => {
  const location = useLocation();
  const activeIndex = getActiveIndex(location.pathname);
  const { theme } = useTheme();

  return (
    <StyledNav>
      <ButtonMenu py="6px" activeIndex={activeIndex} scale="sm" variant="subtle">
        <ButtonMenuItem
          style={
            activeIndex === 0
              ? { color: theme.colors.primary, background: theme.colors.cardBackground }
              : { color: 'white' }
          }
          width="112px"
          height="44px"
          id="swap-nav-link"
          to="/nft/wallet/mint"
          as={Link}
        >
          NFT
        </ButtonMenuItem>
        <ButtonMenuItem
          style={
            activeIndex === 1
              ? { color: theme.colors.primary, background: theme.colors.cardBackground }
              : { color: 'white' }
          }
          height="44px"
          width="112px"
          id="pool-nav-link"
          to="/nft/wallet/burn"
          as={Link}
        >
          KCOIN
        </ButtonMenuItem>
      </ButtonMenu>
    </StyledNav>
  );
};

export default Nav;
