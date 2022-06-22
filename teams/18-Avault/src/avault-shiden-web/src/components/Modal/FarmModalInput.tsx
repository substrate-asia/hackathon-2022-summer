import React, { useState } from 'react';
import styled from 'styled-components';
import { Text, Input, Button, Flex } from '@my/ui';
import { useTranslation } from 'contexts/Localization';
import { BigNumber } from 'bignumber.js';
import CellLayout from 'views/Farms/components/FarmTable/CellLayout';
import Farm, { FarmProps } from 'views/Farms/components/FarmTable/Farm';

interface ModalInputProps {
  max: string;
  symbol: string;
  onSelectMax?: () => void;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value: string;
  addLiquidityUrl?: string;
  inputTitle?: string;
  decimals?: number;
  farm: FarmProps;
}

const StyledInput = styled(Input)`
  box-shadow: none;
  border-width: 0px;
  text-align: right;
  background: ${({ theme }) => theme.colors.background};
  width: 40%;
  text-align: right;
  height: 24px;
  font-size: 12px;
  padding: 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 50%;
    font-size: 16px;
  }
`;

const MaxButton = styled(Button)`
  text-align: right;
  padding: 0 0 0 12px;
  margin: 0;
  align-items: center;
  justify-content: right;
  line-height: 40px;
  height: 40px;
`;
const InputContainer = styled(Flex)<{ focused: boolean }>`
  align-items: center;
  justify-content: space-between;
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.background};
  padding: 17px 20px;
  margin-bottom: 20px;
  border: 1px solid ${({ theme, focused }) => (focused ? theme.colors.text : theme.colors.cardBorder)};
  transition: all 0.3s ease;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 30px;
  }
`;
const TextFlexStyled = styled(Flex)`
  justify-content: space-between;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 10px;
  }
`;
const ModalInput: React.FC<ModalInputProps> = ({
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
  addLiquidityUrl,
  inputTitle,
  decimals = 18,
  farm,
}) => {
  const { t } = useTranslation();
  const isBalanceZero = max === '0' || !max;
  const [focused, setFocused] = useState(false);

  const displayBalance = (balance: string) => {
    if (isBalanceZero) {
      return '0';
    }
    const balanceBigNumber = new BigNumber(balance);
    if (balanceBigNumber.gt(0) && balanceBigNumber.lt(0.0001)) {
      return balanceBigNumber.toLocaleString();
    }
    return balanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN);
  };
  const onFocusHandler = () => {
    setFocused(true);
  };

  const onBlurHandler = () => {
    setFocused(false);
  };
  return (
    <>
      <TextFlexStyled>
        <p></p>
        <Flex alignItems="center">
          <Text fontSize="12px">{t('Balance: %balance%', { balance: displayBalance(max) })}</Text>
          <MaxButton variant="text" onClick={onSelectMax}>
            Max
          </MaxButton>
        </Flex>
      </TextFlexStyled>
      <InputContainer focused={focused}>
        <CellLayout>
          <Farm {...farm} label={symbol} />
        </CellLayout>
        <StyledInput
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
          inputMode="decimal"
          step="any"
          min="0"
          onChange={onChange}
          placeholder="0.00"
          value={value}
        />
      </InputContainer>
    </>
  );
};

export default ModalInput;
