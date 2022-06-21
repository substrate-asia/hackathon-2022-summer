import { Flex, Heading, Skeleton } from '@my/ui';
import BigNumber from 'bignumber.js';
import { MaxButton } from 'style/SmallBorderPageLayout';
import styled from 'styled-components';
import { StyledInput } from 'views/Stake/style/DappstakeStyle';
import ZapCurrencyLogo from 'views/Zap/components/ZapCurrencyLogo';
import { IToken } from 'views/Zap/utils/types';

interface IProps {
  account: string;
  isUserLoaded: boolean;
  balance: string;
  handleSelectMax: any;
  val: string;
  decimals?: number;
  handleChange: any;
  token: IToken;
}
const BalanceInput = ({
  account,
  balance,
  isUserLoaded,
  decimals = 18,
  val,
  handleSelectMax,
  handleChange,
  token,
}: IProps) => {
  return (
    <div>
      <Flex alignItems="center" justifyContent="end" paddingY="4px">
        <BalanceStyled>
          Balance:{' '}
          {balance || Number(balance) === 0 ? (
            Number(new BigNumber(balance).toFixed(decimals, BigNumber.ROUND_DOWN)).toLocaleString('en-US', {
              maximumFractionDigits: decimals,
              minimumFractionDigits: 2,
            })
          ) : isUserLoaded ? (
            <SkeletonStyled />
          ) : (
            '0.00'
          )}
        </BalanceStyled>
        <MaxButtonStyled variant="text" onClick={handleSelectMax}>
          Max
        </MaxButtonStyled>
      </Flex>
      <InnerStyled border={Number(`${val}`) > 0}>
        <FlexCol>
          <FlexCol>
            <ZapCurrencyLogo currency={token} />
            <TokenStyled>{token.symbol}</TokenStyled>
          </FlexCol>
          <Flex alignItems="end" justifyContent="center" flexDirection="column">
            <StyledInput
              pattern={`^[0-9]*[.,]?[0-9]{0,8}$`}
              inputMode="decimal"
              step="any"
              min="0"
              placeholder="0.00"
              value={val}
              onChange={handleChange}
            />
          </Flex>
        </FlexCol>
      </InnerStyled>
    </div>
  );
};
const TokenStyled = styled(Heading)`
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
`;
const FlexCol = styled(Flex)`
  align-items: center;
  justify-content: space-between;
`;
const MaxButtonStyled = styled(MaxButton)`
  font-size: 12px;
  height: 30px;
`;
const InnerStyled = styled.div<{ border: boolean }>`
  background: ${({ theme }) => theme.colors.background};
  transition: all 0.3s ease;
  border-radius: 12px;
  position: relative;
  border: 1px solid ${({ theme, border }) => (border ? theme.colors.text : theme.colors.cardBorder)};
  padding: 10px 20px;
`;
const BalanceStyled = styled(Flex)`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  align-items: center;
  justify-content: space-between;
`;
const SkeletonStyled = styled(Skeleton)`
  height: 20px;
  width: 40px;
  margin: 0 4px 0 10px;
`;
export default BalanceInput;
