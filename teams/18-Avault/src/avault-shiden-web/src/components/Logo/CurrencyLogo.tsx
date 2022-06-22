import { Currency, ETHER, Token } from '@my/sdk';
import { BinanceIcon } from '@my/ui';
import { BASE_URL } from 'config';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import useHttpLocations from 'hooks/useHttpLocations';
import { WrappedTokenInfo } from 'state/lists/hooks';
import getTokenLogoURL from 'utils/getTokenLogoURL';
import Logo from './Logo';
import { chainId } from 'config/constants/tokens';

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency;
  size?: string;
  style?: React.CSSProperties;
}) {
  const uriLocations = useHttpLocations(
    currency instanceof WrappedTokenInfo ? `${BASE_URL}${currency.logoURI}` : undefined,
  );

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER[chainId]) return [];

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)];
      }
      return [getTokenLogoURL(currency.address)];
    }
    return [];
  }, [currency, uriLocations]);

  if (currency === ETHER[chainId]) {
    return <BinanceIcon width={size} style={style} />;
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />;
}
