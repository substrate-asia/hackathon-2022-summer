import { Heading, Text, Flex, Input, Button, useWalletModal, AutoRenewIcon } from '@my/ui';
import PageLayout from 'components/Layout/Page';
import { BgGlobalStyle } from 'style/Global';
import styled from 'styled-components';
import { W480BorderPageLayout, PageContainerWrap, MaxButton, TableContent } from 'style/SmallBorderPageLayout';
import ZapBg from './components/ZapBg';
import {
  fromCurrency as _fromCurrency,
  toCurrency as _toCurrency,
  zapLocalFromCurrency,
  zapLocalToCurrency,
} from './constants/data';
import { useCallback, useState } from 'react';
import ZapCurrencyInputPanel from './components/ZapCurrencyInputPanel';
import { IToken, ITokenType } from './utils/types';
import ZapBalance from './components/ZapBalance';
import BigNumber from 'bignumber.js';
import useToast from 'hooks/useToast';
import { useEstimatedPrice } from './utils/utils';
import useZapContract, { useApprove, useHandleApproved, zapAddress } from './constants/contract';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { DEFAULT_GAS_LIMIT } from 'config';
import useDebounce from 'hooks/useDebounce';
import useAuth from 'hooks/useAuth';
import ArrowDown from 'views/Stake/components/svg/arrow_down';
const Zap = () => {
  const { account } = useActiveWeb3React();
  const [fromCurrency, setFromCurrency] = useState(_fromCurrency);
  const [toCurrency, setToCurrency] = useState(_toCurrency);
  const [fullBalance, setMax] = useState('0');
  const [val, setVal] = useState('');
  const { handleZapClick } = useZapContract(zapAddress, fromCurrency, toCurrency);
  const [pendingTx, setPendingTx] = useState(false);
  const valNumber = useDebounce(new BigNumber(val ?? '0'), 100);
  const { toastSuccess, toastError, toastWarning } = useToast();

  const { login, logout } = useAuth();
  const { onPresentConnectModal } = useWalletModal(login, logout);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'));
      }
    },
    [setVal],
  );
  const handleSelectMax = useCallback(() => {
    if (fromCurrency.type === ITokenType.MAIN) {
      // console.log(fullBalance, (DEFAULT_GAS_LIMIT * 1000000000) / Math.pow(10, 18));
      if (fullBalance && Number(fullBalance) <= (DEFAULT_GAS_LIMIT * 1000000000) / Math.pow(10, 18)) {
        toastWarning('Warn', `Your ${fromCurrency.symbol} balance is insufficient!`);
        return;
      }
      setVal(
        new BigNumber(`${Number(fullBalance) - 2 * ((DEFAULT_GAS_LIMIT * 1000000000) / Math.pow(10, 18))}`).toFixed(
          5,
          BigNumber.ROUND_DOWN,
        ),
      );
    } else {
      // console.log(fullBalance);
      setVal(fullBalance);
    }
  }, [fullBalance, toastWarning, setVal, fromCurrency]);
  const EstimatedPrice = useEstimatedPrice(val, fromCurrency, toCurrency, valNumber);
  const zapComfirm = useCallback(async () => {
    if (!account) {
      onPresentConnectModal();
      return;
    }
    setPendingTx(true);
    try {
      const result = await handleZapClick(val, account);
      // console.log(res);
      if (typeof result === 'boolean' && result) {
        toastSuccess(
          'Successfully claimed!',
          `Your ${fromCurrency.symbol} to ${toCurrency.symbol} Zap Successfully claimed!`,
        );
      } else {
        const message = result ? result : `Your ${fromCurrency.symbol} to ${toCurrency.symbol} Zap failed!`;
        toastError('Error', message);
      }
    } catch (e: any) {
      toastError('Error', e.message ? e.message : `Your ${fromCurrency.symbol} to ${toCurrency.symbol} Zap failed!`);
    } finally {
      setVal('');

      setPendingTx(false);
    }
  }, [account, onPresentConnectModal, fromCurrency, toCurrency, val, handleZapClick, toastSuccess, toastError]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { fetchApprove } = useHandleApproved(fromCurrency, account, zapAddress);
  const isApprove = useApprove(isLoaded, setPendingTx, fromCurrency, toCurrency, account, zapAddress);
  const zapApprove = useCallback(async () => {
    if (!account) {
      onPresentConnectModal();
      return;
    }
    try {
      setPendingTx(true);
      const result = await fetchApprove();
      if (typeof result === 'boolean' && result) {
        setIsLoaded(true);
        toastSuccess('Approve!', 'Your are Approved');
        setIsLoaded(false);
      } else {
        const message = result ? result : 'Your approved failed';
        toastError('Approve!', message);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPendingTx(false);
    }
  }, [account, fetchApprove, onPresentConnectModal, toastError, toastSuccess]);
  return (
    <PageLayout>
      <BgGlobalStyle />
      <PageContainerWrap>
        <W480BorderPageLayout className="single">
          <TableContent>
            <TitleStyled>Zap</TitleStyled>
            <TextStyled>Convert single tokens to LP tokens directly</TextStyled>
            <InnerStyled>
              <PaddingStyled>
                <TextCol>
                  <BoldStyled>From</BoldStyled>
                  <TextCol>
                    <ZapBalance account={account} currency={fromCurrency} setMax={setMax} />
                    <MaxButtonStyled variant="text" onClick={handleSelectMax}>
                      Max
                    </MaxButtonStyled>
                  </TextCol>
                </TextCol>

                <TextCol>
                  <ZapCurrencyInputPanel
                    currency={fromCurrency}
                    otherCurrency={toCurrency}
                    setCurrency={(currency: IToken) => {
                      localStorage.setItem(zapLocalFromCurrency, JSON.stringify(currency));
                      setVal('');
                      setFromCurrency(currency);
                    }}
                    isTo={false}
                  />
                  <StyledInput
                    pattern={`^[0-9]*[.,]?[0-9]{0,8}$`}
                    inputMode="decimal"
                    step="any"
                    min="0"
                    placeholder="0.00"
                    value={val}
                    onChange={handleChange}
                  />
                </TextCol>
              </PaddingStyled>
              <PaddingStyled>
                <TextCol>
                  <BoldStyled>TO LP</BoldStyled>
                  {/* <ZapBalance currency={toCurrency} /> */}
                </TextCol>

                <TextCol>
                  <ZapCurrencyInputPanel
                    currency={toCurrency}
                    otherCurrency={fromCurrency}
                    setCurrency={(currency: IToken) => {
                      localStorage.setItem(zapLocalToCurrency, JSON.stringify(currency));
                      setVal('');
                      setToCurrency(currency);
                    }}
                    isTo={true}
                  />
                  <HeadingStyled isSmall={EstimatedPrice === '0'} isLong={EstimatedPrice.length > 16}>
                    {EstimatedPrice}
                  </HeadingStyled>
                </TextCol>
              </PaddingStyled>
              <ArrowDown />
            </InnerStyled>
            <Button
              isLoading={pendingTx}
              disabled={
                account &&
                isApprove &&
                (pendingTx ||
                  !valNumber.isFinite() ||
                  valNumber.eq(0) ||
                  valNumber.gt(fullBalance) ||
                  fromCurrency.symbol === toCurrency.symbol)
              }
              width="100%"
              padding="0"
              onClick={() => {
                if (isApprove) {
                  zapComfirm();
                } else {
                  zapApprove();
                }
              }}
              endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
            >
              {!account ? 'Connect Wallet' : isApprove ? 'Confirm' : 'Approve'}
            </Button>
          </TableContent>
          <ZapBgStyled>
            <ZapBg />
          </ZapBgStyled>
        </W480BorderPageLayout>
      </PageContainerWrap>
    </PageLayout>
  );
};
const HeadingStyled = styled(Heading)<{ isSmall: boolean; isLong: boolean }>`
  font-size: ${({ isLong }) => (isLong ? '14px' : '18px')};
  color: ${({ theme, isSmall }) => (isSmall ? theme.colors.textSubtle : theme.colors.text)};
  font-weight: 600;
  word-break: break-all;
  text-align: end;
`;
const ZapBgStyled = styled.div`
  position: absolute;
  width: 152px;
  top: 15px;
  right: 3px;
`;

const MaxButtonStyled = styled(MaxButton)`
  font-size: 12px;
`;
const BoldStyled = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSubtle};
`;

const InnerStyled = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  margin-bottom: 30px;
  position: relative;
`;
const StyledInput = styled(Input)`
  box-shadow: none;
  padding: 0;
  border-width: 0px;
  background-color: rgba(0, 0, 0, 0);
  width: 80%;
  text-align: right;
  font-size: 18px;
`;
const TextCol = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  height: 40px;
`;
const PaddingStyled = styled.div`
  padding: 14px 20px 24px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBackground};
  &:last-child {
    border-bottom: none;
  }
`;

const TitleStyled = styled(Heading)`
  display: inline-block;
  background: linear-gradient(90deg, #ffd8fe 0%, #c5fff1 100%);
  -webkit-background-clip: text;
  color: transparent;
  font-size: 36px;
  padding-bottom: 12px;
  font-weight: 800;
`;
const TextStyled = styled(Text)`
  font-size: 14px;
  padding-bottom: 30px;
  font-weight: 600;
  width: 60%;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 100%;
  }
`;
export default Zap;
