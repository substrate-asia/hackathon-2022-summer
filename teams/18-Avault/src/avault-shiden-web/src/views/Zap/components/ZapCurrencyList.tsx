import { ETHER, Token } from '@my/sdk';
import { Flex, Heading } from '@my/ui';
import BigNumber from 'bignumber.js';
import CircleLoader from 'components/Loader/CircleLoader';
import { chainId } from 'config/constants/tokens';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { CSSProperties, MutableRefObject, useCallback } from 'react';
import { FixedSizeList } from 'react-window';
import { useCurrencyBalance } from 'state/wallet/hooks';
import styled from 'styled-components';
import { showDecimals } from 'views/Vault/utils';
import { IToken } from '../utils/types';
import { currencyKey, isCurrencyEquals } from '../utils/utils';
import ZapCurrencyLogo from './ZapCurrencyLogo';

const ZapCurrencyList = ({
  height,
  currencies,
  fixedListRef,

  selectedCurrency,
  otherCurrency,
  onCurrencySelect,
  breakIndex,
}: {
  height: number;
  currencies: IToken[];
  fixedListRef: MutableRefObject<FixedSizeList | undefined>;

  selectedCurrency?: IToken | null;
  otherCurrency?: IToken | null;
  onCurrencySelect: (currency: IToken) => void;
  breakIndex?: number | undefined;
  debouncedQuery: string;
}) => {
  const itemKey = useCallback((index: number, data: any) => currencyKey(data[index], index), []);
  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: IToken = data[index];
      const isSelected = Boolean(selectedCurrency && isCurrencyEquals(selectedCurrency, currency));
      const otherSelected = Boolean(otherCurrency && isCurrencyEquals(otherCurrency, currency));
      const handleSelect = () => onCurrencySelect(currency);
      if (index === breakIndex || !data) {
        return null;
      }
      return (
        <CurrencyRow
          style={style}
          currency={currency}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
        />
      );
    },
    [breakIndex, onCurrencySelect, otherCurrency, selectedCurrency],
  );
  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={currencies}
      itemCount={currencies.length}
      itemSize={60}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  );
};
function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
}: {
  currency: IToken;
  onSelect: () => void;
  isSelected: boolean;
  otherSelected: boolean;
  style: CSSProperties;
}) {
  const { account } = useActiveWeb3React();
  const _currency =
    currency.address && currency.address[chainId]
      ? new Token(chainId, currency.address[chainId], currency.decimals ?? 18, currency.symbol, currency.name)
      : ETHER[chainId];
  const balance = useCurrencyBalance(account ?? undefined, _currency);
  const decimals = showDecimals(currency.symbol);
  return (
    <MenuItem
      style={style}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <FlexCol>
        <ZapCurrencyLogo currency={currency} />
        <HeadingStyled>{currency.symbol}</HeadingStyled>
      </FlexCol>
      <HeadingStyled>
        {balance ? (
          Number(new BigNumber(balance.toSignificant(18)).toFixed(decimals, BigNumber.ROUND_DOWN)).toLocaleString(
            'en-US',
            {
              maximumFractionDigits: decimals,
            },
          )
        ) : account ? (
          <CircleLoader />
        ) : (
          ''
        )}
      </HeadingStyled>
    </MenuItem>
  );
}
const HeadingStyled = styled(Heading)`
  font-size: 14px;
`;
const FlexCol = styled(Flex)`
  align-items: center;
  justify-content: space-between;
`;
const MenuItem = styled(Flex)<{ disabled: boolean; selected: boolean }>`
  padding: 0 16px;
  transition: all 0.3s ease;
  align-items: center;
  justify-content: space-between;
  background-image: ${({ disabled }) => (disabled ? ' linear-gradient(90deg, #a428d0 0%, #20d4a9 100%)' : 'none')};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  cursor: ${({ disabled, selected }) => (disabled || selected ? '' : 'pointer')};
  opacity: ${({ selected }) => (selected ? 0.5 : 1)};
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 4px 30px;
  }
  :hover {
    background-color: ${({ theme, disabled }) => !disabled && theme.colors.secondary};
  }
`;
export default ZapCurrencyList;
