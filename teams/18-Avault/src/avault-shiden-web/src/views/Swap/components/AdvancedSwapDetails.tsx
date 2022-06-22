import React from 'react';
import { Trade, TradeType } from '@my/sdk';
import { Text } from '@my/ui';
import { Field } from 'state/swap/actions';
import { useUserSlippageTolerance } from 'state/user/hooks';
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from 'utils/prices';
import { AutoColumn } from 'components/Layout/Column';
import { RowBetween, RowFixed } from 'components/Layout/Row';
import FormattedPriceImpact from './FormattedPriceImpact';
import SwapRoute from './SwapRoute';

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade);
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT;
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage);

  return (
    <AutoColumn style={{ padding: '0 16px' }}>
      <RowBetween>
        <RowFixed>
          <Text fontSize="12px" color="#9da6a6">
            {isExactIn ? 'Minimum received' : 'Maximum sold'}
          </Text>
          {/* <QuestionHelper
            text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed."
            ml="4px"
          /> */}
        </RowFixed>
        <RowFixed>
          <Text fontSize="12px" color="#9da6a6">
            {isExactIn
              ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                '-'
              : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ?? '-'}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <RowFixed>
          <Text fontSize="12px" color="#9da6a6">
            Price Impact
          </Text>
          {/* <QuestionHelper
            text="The difference between the market price and estimated price due to trade size."
            ml="4px"
          /> */}
        </RowFixed>
        <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
      </RowBetween>

      <RowBetween>
        <RowFixed>
          <Text fontSize="12px" color="#9da6a6">
            Liquidity Provider Fee
          </Text>
          {/* <QuestionHelper
            text={
              <>
                <Text color="#9da6a6" mb="12px">
                  For each trade a 0.25% fee is paid
                </Text>
                <Text color="#9da6a6">- 0.1875% to LP token holders</Text>
                <Text color="#9da6a6">- 0.03125% to the Treasury</Text>
                <Text color="#9da6a6">- 0.03125% towards KAC buyback and burn</Text>
              </>
            }
            ml="4px"
          /> */}
        </RowFixed>
        <Text fontSize="12px" color="#9da6a6">
          {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
        </Text>
      </RowBetween>
    </AutoColumn>
  );
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade;
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippageTolerance();

  const showRoute = Boolean(trade && trade.route.path.length > 2);

  return (
    <AutoColumn gap="0px">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <RowBetween style={{ padding: '0 16px' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <Text fontSize="14px" color="#9da6a6">
                    Route
                  </Text>
                  {/* <QuestionHelper
                    text="Routing through these tokens resulted in the best price for your trade."
                    ml="4px"
                  /> */}
                </span>
                <SwapRoute trade={trade} />
              </RowBetween>
            </>
          )}
        </>
      )}
    </AutoColumn>
  );
}
