import { Text } from '@my/ui';
import styled from 'styled-components';
import { MaxButton } from 'style/SmallBorderPageLayout';
const TextStyle = styled(Text)`
  font-size: 12px;
  text-align: center;
  font-weight: 600;
  padding-bottom: 16px;
  color: ${({ theme }) => theme.colors.text};
`;
const Balance = (props) => {
  const {
    symbol,
  }: {
    symbol: string;
  } = props;
  // const displayBalance = (balance: string) => {
  //   if (isBalanceZero) {
  //     return '0';
  //   }
  //   const balanceUnits = parseUnits(balance, 18);
  //   console.log(balance);
  //   return formatBigNumber(balanceUnits, 18, 18);
  // };
  return (
    <>
      <TextStyle>
        LP Balance: &nbsp;0 {symbol}
        <MaxButton variant="text">Max</MaxButton>
      </TextStyle>
    </>
  );
};
export default Balance;
