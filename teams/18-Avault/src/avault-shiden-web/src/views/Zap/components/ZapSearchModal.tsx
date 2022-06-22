import { Currency, ETHER } from '@my/sdk';
import {
  Heading,
  InjectedModalProps,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  Text,
  useMatchBreakpoints,
} from '@my/ui';
import { chainKey } from 'config';
import { chainId } from 'config/constants/tokens';
import useDebounce from 'hooks/useDebounce';
import { useCallback, KeyboardEvent, RefObject, useEffect, useRef, useState, useMemo } from 'react';
import { FixedSizeList } from 'react-window';
import styled from 'styled-components';
import { isAddress } from 'utils';
import { lpTokenAll, tokenAll } from '../constants/data';
import { IToken, ITokenType } from '../utils/types';
import { deweight, useZapSortedTokensByQuery } from '../utils/utils';
import ZapCurrencyList from './ZapCurrencyList';
const ModalContainerStyled = styled(ModalContainer)`
  min-width: 380;
  max-width: 400px;
  padding-bottom: 30px;
  position: relative;
  &:after {
    content: '';
    box-shadow: 0 0px 20px ${({ theme }) => theme.colors.backgroundAlt};
    width: 100%;
    height: 49px;
    position: absolute;
    bottom: -6px;
    background: ${({ theme }) => theme.colors.backgroundAlt};
  }
  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 468px;
    max-width: 500px;
  }
`;
interface IZapSearchModalProps extends InjectedModalProps {
  selectedCurrency?: IToken | null;
  onCurrencySelect: (currency: IToken) => void;
  otherSelectedCurrency?: IToken | null;
  isTo: boolean;
}
const ZapSearchModal = ({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  isTo,
  onDismiss = () => null,
}: IZapSearchModalProps) => {
  const fixedList = useRef<FixedSizeList>();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>();

  const debouncedQuery = useDebounce(searchQuery, 200);

  const currencies = isTo ? lpTokenAll : tokenAll;
  const _itemData: (IToken | undefined)[] = useMemo(() => {
    const MAIN = {
      ...Currency.ETHER[chainId],
      type: ITokenType.MAIN,
      decimals: 18,
    };
    const formatted: (IToken | undefined)[] = deweight([selectedCurrency, MAIN, ...currencies]);
    return formatted;
  }, [selectedCurrency, currencies]);
  const itemData = useZapSortedTokensByQuery(_itemData, debouncedQuery);
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  const handleInput = useCallback((event) => {
    const input = event.target.value;
    const checksummedInput = isAddress(input);
    setSearchQuery(checksummedInput || input);
    fixedList.current?.scrollTo(0);
  }, []);

  const handleCurrencySelect = useCallback(
    (currency: IToken) => {
      onCurrencySelect(currency);
      onDismiss();
    },
    [onCurrencySelect, onDismiss],
  );
  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toUpperCase().trim();
        if (s === chainKey) {
          handleCurrencySelect(ETHER[chainId]);
        } else if (itemData.length > 0) {
          if (itemData[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() || itemData.length === 1) {
            handleCurrencySelect(itemData[0]);
          }
        }
        onDismiss();
      }
    },
    [debouncedQuery, handleCurrencySelect, onDismiss, itemData],
  );
  const { isXl, isLg } = useMatchBreakpoints();

  const isMobile = !(isXl || isLg);
  return (
    <ModalContainerStyled>
      <ModalHeader>
        <ModalTitle>
          <Heading>Select Token</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <ModalBody bodyPadding="14px 0 0">
        <InputWrapStyled>
          <Input
            id="token-search-input_22"
            placeholder="Search or enter token adress"
            scale="lg"
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
          />
        </InputWrapStyled>
        {itemData.length === 0 ? (
          <div style={{ padding: '20px', height: '100%' }}>
            <Text color="textSubtle" textAlign="center" mb="20px">
              No results found.
            </Text>
          </div>
        ) : null}
        <ZapCurrencyList
          height={isMobile ? 280 : itemData.length > 6 ? 380 : 250}
          currencies={itemData}
          fixedListRef={fixedList}
          selectedCurrency={selectedCurrency}
          otherCurrency={otherSelectedCurrency}
          onCurrencySelect={handleCurrencySelect}
          debouncedQuery={debouncedQuery}
        />
      </ModalBody>
    </ModalContainerStyled>
  );
};
const InputWrapStyled = styled.div`
  margin: 0 16px 12px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin: 0 30px 24px;
  }
  input {
    &:focus {
      border: 1px solid ${({ theme }) => theme.colors.text};
    }
  }
`;
export default ZapSearchModal;
