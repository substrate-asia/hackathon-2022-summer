import { Currency, CurrencyAmount, Fraction, Percent } from '@my/sdk';
import React from 'react';
import { Button, Text } from '@my/ui';
import { useTranslation } from 'contexts/Localization';
import { RowBetween, RowFixed } from 'components/Layout/Row';
import { CurrencyLogo } from 'components/Logo';
import { Field } from 'state/mint/actions';

function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
}: {
  noLiquidity?: boolean;
  price?: Fraction;
  currencies: { [field in Field]?: Currency };
  parsedAmounts: { [field in Field]?: CurrencyAmount };
  poolTokenPercentage?: Percent;
  onAdd: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div style={{ marginTop: '28px' }}>
      <div
        style={{
          background: '#272E32',
          border: '1px dashed #1476FF',
          borderRadius: '12px',
          padding: '24px 21px',
        }}
      >
        <RowBetween mb="16px">
          <RowFixed>
            <CurrencyLogo size="16px" currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
            <Text fontSize="12px">{t('%asset% Deposited', { asset: currencies[Field.CURRENCY_A]?.symbol })}</Text>
          </RowFixed>
          <Text color="#F1842C" fontSize="12px">
            {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
          </Text>
        </RowBetween>
        <RowBetween mb="16px">
          <RowFixed>
            <CurrencyLogo size="16px" currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
            <Text fontSize="12px">{t('%asset% Deposited', { asset: currencies[Field.CURRENCY_B]?.symbol })}</Text>
          </RowFixed>
          <Text color="#F1842C" fontSize="12px">
            {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
          </Text>
        </RowBetween>
        <RowBetween mb="16px">
          <Text fontSize="12px">{t('Rates')}</Text>
          <Text fontSize="12px">
            {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
              currencies[Field.CURRENCY_B]?.symbol
            }`}
          </Text>
        </RowBetween>
        <RowBetween style={{ justifyContent: 'flex-end' }} mb="23px">
          <Text fontSize="12px">
            {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
              currencies[Field.CURRENCY_A]?.symbol
            }`}
          </Text>
        </RowBetween>
        <RowBetween>
          <Text fontSize="12px">{t('Share of Pool')}:</Text>
          <Text fontSize="12px">{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</Text>
        </RowBetween>
      </div>
      <Button onClick={onAdd} mt="30px" width="100%">
        {noLiquidity ? t('Create Pool & Supply') : t('Confirm Supply')}
      </Button>
    </div>
  );
}

export default ConfirmAddModalBottom;
