import React from 'react';
import { Price } from '@my/sdk';
import { Text } from '@my/ui';
import SwapSVG from './imgs/swap-price.svg';

interface TradePriceProps {
  price?: Price;
  showInverted: boolean;
  setShowInverted: (showInverted: boolean) => void;
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6);

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency);
  const label = showInverted
    ? `${price?.quoteCurrency?.symbol} per ${price?.baseCurrency?.symbol}`
    : `${price?.baseCurrency?.symbol} per ${price?.quoteCurrency?.symbol}`;

  return (
    <Text
      style={{
        color: '#9DA6A6',
        fontSize: '12px',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      {show ? (
        <>
          {formattedPrice ?? '-'} {label}
          <img
            style={{ cursor: 'pointer', marginLeft: '9px' }}
            src={SwapSVG}
            alt=""
            onClick={() => setShowInverted(!showInverted)}
          />
        </>
      ) : (
        '-'
      )}
    </Text>
  );
}
