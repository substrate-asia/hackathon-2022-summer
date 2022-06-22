import { useMemo } from 'react';
import { getFullDisplayBalance } from 'utils/formatBalance';
import { useGetBnbBalance } from 'hooks/useTokenBalance';
import { main_tokens } from 'config/constants/tokens';
import useActiveWeb3React from 'hooks/useActiveWeb3React';

const useStakeWrap = () => {
  const { balance } = useGetBnbBalance();
  const decimals = main_tokens.sdn.decimals;
  const pid = 0;
  const max = balance.toString();
  const isBalanceZero = max === '0' || !max;
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(balance, decimals, 8);
  }, [balance]);
  const { account } = useActiveWeb3React();

  return {
    balance,
    decimals,
    max,
    isBalanceZero,
    fullBalance,
    pid,
    account,
  };
};
export default useStakeWrap;
