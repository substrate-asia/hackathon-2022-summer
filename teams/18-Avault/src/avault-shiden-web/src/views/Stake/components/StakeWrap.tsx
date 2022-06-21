import { useMemo } from 'react';
import { getFullDisplayBalance } from 'utils/formatBalance';
import { useGetBnbBalance } from 'hooks/useTokenBalance';
import { chainId, main_tokens } from 'config/constants/tokens';
import styled from 'styled-components';
const StyledPageStyle = styled.div``;
const StyledPage = ({ children, ...props }) => {
  return <StyledPageStyle {...props}>{children}</StyledPageStyle>;
};
const StakeWrap = ({ children }) => {
  const { balance } = useGetBnbBalance();
  const decimals = main_tokens.sdn.decimals;
  const pid = 0;
  const max = balance.toString();
  const isBalanceZero = max === '0' || !max;
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(balance, decimals, 8);
  }, [balance]);
  return (
    <StyledPage
      balance={balance}
      decimals={decimals}
      max={max}
      isBalanceZero={isBalanceZero}
      fullBalance={fullBalance}
      pid={pid}
    >
      {children}
    </StyledPage>
  );
};
export default StakeWrap;
