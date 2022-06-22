import { Flex, Heading, useModal } from '@my/ui';
import { ArrowIcon } from 'style/SmallBorderPageLayout';
import styled from 'styled-components';
import { IToken } from '../utils/types';
import ZapCurrencyLogo from './ZapCurrencyLogo';
import ZapSearchModal from './ZapSearchModal';

const ZapCurrencyInputPanel = ({
  currency,
  otherCurrency,
  setCurrency,
  isTo,
}: {
  currency: IToken;
  otherCurrency: IToken;
  setCurrency: any;
  isTo: boolean;
}) => {
  const onCurrencySelect = (currency: IToken) => {
    setCurrency(currency);
  };
  const [onPresentCurrencyModal] = useModal(
    <ZapSearchModal
      isTo={isTo}
      selectedCurrency={currency}
      onCurrencySelect={onCurrencySelect}
      otherSelectedCurrency={otherCurrency}
    />,
  );
  return (
    <FlexCol onClick={onPresentCurrencyModal}>
      <ZapCurrencyLogo currency={currency} />
      <TokenStyled>{currency.symbol}</TokenStyled>
      <ArrowIcon color="primary" toggled={false} />
    </FlexCol>
  );
};
const TokenStyled = styled(Heading)`
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  margin-right: 8px;
`;
const FlexCol = styled(Flex)`
  align-items: center;
  justify-content: space-between;
`;
export default ZapCurrencyInputPanel;
