import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Trade, TradeType } from '@my/sdk';
import { Button, Text, AutoRenewIcon } from '@my/ui';
import { Field } from 'state/swap/actions';
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity,
} from 'utils/prices';
import { AutoColumn } from 'components/Layout/Column';
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row';
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds';
import { ONE_BIPS } from 'config/constants';

const SwapModalFooterContainer = styled(AutoColumn)`
  margin-top: 24px;
  margin-bottom: 12px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background02};
  border: 1px dashed #1476ff;
  border-radius: 12px;
`;

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
}: {
  trade: Trade;
  allowedSlippage: number;
  onConfirm: () => void;
  swapErrorMessage: string | undefined;
  disabledConfirm: boolean;
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false);
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [allowedSlippage, trade],
  );
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade]);
  const severity = warningSeverity(priceImpactWithoutFee);

  return (
    <>
      <SwapModalFooterContainer>
        <RowBetween align="center" style={{ marginBottom: '6px' }}>
          <Text fontSize="12px">Price</Text>
          <Text
            fontSize="12px"
            style={{
              color: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px',
            }}
          >
            {formatExecutionPrice(trade, showInverted)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <AutoRenewIcon width="12px" />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween style={{ marginBottom: '6px' }}>
          <RowFixed>
            <Text fontSize="12px">
              {trade.tradeType === TradeType.EXACT_INPUT ? 'Minimum received' : 'Maximum sold'}
            </Text>
            {/* <QuestionHelper
              text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed."
              ml="4px"
            /> */}
          </RowFixed>
          <RowFixed>
            <Text fontSize="12px" color="text">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </Text>
            <Text fontSize="12px" color="text" marginLeft="4px">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? trade.outputAmount.currency.symbol
                : trade.inputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween style={{ marginBottom: '6px' }}>
          <RowFixed>
            <Text fontSize="12px">Price Impact</Text>
            {/* <QuestionHelper text="The difference between the market price and your price due to trade size." ml="4px" /> */}
          </RowFixed>
          <Text fontSize="12px" color="text">
            {priceImpactWithoutFee
              ? priceImpactWithoutFee.lessThan(ONE_BIPS)
                ? '<0.01%'
                : `${priceImpactWithoutFee.toFixed(2)}%`
              : '-'}
          </Text>
        </RowBetween>
        <RowBetween style={{ marginBottom: '6px' }}>
          <RowFixed>
            <Text fontSize="12px">Liquidity Provider Fee</Text>
            {/* <QuestionHelper
              text={
                <>
                  <Text mb="12px">For each trade a 0.25% fee is paid</Text>
                  <Text>- 0.1875% to LP token holders</Text>
                  <Text>- 0.03% to the Treasury</Text>
                  <Text>- 0.05% towards KAC buyback and burn</Text>
                </>
              }
              ml="4px"
            /> */}
          </RowFixed>
          <Text fontSize="12px" color="text">
            {realizedLPFee ? `${realizedLPFee?.toSignificant(6)} ${trade.inputAmount.currency.symbol}` : '-'}
          </Text>
        </RowBetween>
      </SwapModalFooterContainer>

      <AutoRow>
        <Button
          variant={severity > 2 ? 'danger' : 'primary'}
          onClick={onConfirm}
          disabled={disabledConfirm}
          mt="12px"
          id="confirm-swap-or-send"
          width="100%"
        >
          {severity > 2 ? 'Swap Anyway' : 'Confirm Swap'}
        </Button>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  );
}
