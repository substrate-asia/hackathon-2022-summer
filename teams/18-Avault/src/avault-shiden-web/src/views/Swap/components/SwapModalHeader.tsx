import React, { useMemo } from 'react';
import { Trade, TradeType } from '@my/sdk';
import { Button, Text, ErrorIcon } from '@my/ui';
import { Field } from 'state/swap/actions';
import { isAddress, shortenAddress } from 'utils';
import { computeSlippageAdjustedAmounts } from 'utils/prices';
import { AutoColumn } from 'components/Layout/Column';
import { CurrencyLogo } from 'components/Logo';
import { RowBetween, RowFixed } from 'components/Layout/Row';
import { TruncatedText, SwapShowAcceptChanges } from './styleds';

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}: {
  trade: Trade;
  allowedSlippage: number;
  recipient: string | null;
  showAcceptChanges: boolean;
  onAcceptChanges: () => void;
}) {
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage],
  );

  return (
    <AutoColumn gap="md">
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo currency={trade.inputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
          <Text fontSize="14px" color="text" ml="10px">
            {trade.inputAmount.currency.symbol}
          </Text>
        </RowFixed>
        <RowFixed gap="0px">
          <TruncatedText fontSize="14px" color="primary">
            {trade.inputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
      </RowBetween>
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo currency={trade.outputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
          <Text fontSize="14px" color="text">
            {trade.outputAmount.currency.symbol}
          </Text>
        </RowFixed>
        <RowFixed gap="0px">
          <TruncatedText fontSize="14px" color="primary">
            {trade.outputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
      </RowBetween>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap="0px">
          <RowBetween>
            <RowFixed>
              <ErrorIcon mr="8px" />
              <Text bold> Price Updated</Text>
            </RowFixed>
            <Button onClick={onAcceptChanges}>Accept</Button>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '24px 0 0 0px' }}>
        {trade.tradeType === TradeType.EXACT_INPUT ? (
          <Text
            small
            color="#F1842C"
            textAlign="left"
            style={{ padding: '12px 20px', width: '100%', background: '#272E32', borderRadius: '12px' }}
          >
            {`Output is estimated. You will receive at least `}
            <b>
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {trade.outputAmount.currency.symbol}
            </b>
            {' or the transaction will revert.'}
          </Text>
        ) : (
          <Text small color="textSubtle" textAlign="left" style={{ width: '100%' }}>
            {`Input is estimated. You will sell at most `}
            <b>
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {trade.inputAmount.currency.symbol}
            </b>
            {' or the transaction will revert.'}
          </Text>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <Text color="textSubtle">
            Output will be sent to{' '}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </Text>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  );
}
