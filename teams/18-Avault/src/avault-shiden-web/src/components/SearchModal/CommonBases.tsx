import React from 'react';
import { Currency, currencyEquals, ETHER, Token, ChainId } from '@my/sdk';
import { Text } from '@my/ui';
import styled from 'styled-components';
import { useTranslation } from 'contexts/Localization';
import { SUGGESTED_BASES } from 'config/constants';
import { AutoColumn } from '../Layout/Column';
import QuestionHelper from '../QuestionHelper';
import { AutoRow } from '../Layout/Row';
import { CurrencyLogo } from '../Logo';

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid ${({ theme, disable }) => (disable ? 'transparent' : theme.colors.dropdown)};
  border-radius: 10px;
  display: flex;
  padding: 6px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background-color: ${({ theme, disable }) => !disable && theme.colors.background};
  }

  background-color: ${({ theme, disable }) => disable && theme.colors.dropdown};
  opacity: ${({ disable }) => disable && '0.4'};
`;

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency,
}: {
  chainId?: ChainId;
  selectedCurrency?: Currency | null;
  onSelect: (currency: Currency) => void;
}) {
  const { t } = useTranslation();
  return (
    <AutoColumn gap="md">
      <AutoRow>
        <Text fontSize="14px">{t('Common bases')}</Text>
        <QuestionHelper text={t('These tokens are commonly paired with other tokens.')} ml="4px" />
      </AutoRow>
      <AutoRow gap="auto">
        <BaseWrapper
          onClick={() => {
            if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER[chainId])) {
              onSelect(ETHER[chainId]);
            }
          }}
          disable={selectedCurrency === ETHER[chainId]}
        >
          <CurrencyLogo currency={ETHER[chainId]} style={{ marginRight: 8 }} />
          <Text>BNB</Text>
        </BaseWrapper>
        {(chainId ? SUGGESTED_BASES[chainId] : []).map((token: Token) => {
          const selected = selectedCurrency instanceof Token && selectedCurrency.address === token.address;
          return (
            <BaseWrapper onClick={() => !selected && onSelect(token)} disable={selected} key={token.address}>
              <CurrencyLogo currency={token} style={{ marginRight: 8 }} />
              <Text>{token.symbol}</Text>
            </BaseWrapper>
          );
        })}
      </AutoRow>
    </AutoColumn>
  );
}
