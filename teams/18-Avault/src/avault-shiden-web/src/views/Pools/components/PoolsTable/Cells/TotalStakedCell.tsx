import React, { useMemo } from 'react';
import { Skeleton } from '@my/ui';
// import BigNumber from 'bignumber.js';
import Balance from 'components/Balance';
import { Pool } from 'state/types';
// import { useCakeVault } from 'state/pools/hooks';
import { getBalanceNumber } from 'utils/formatBalance';

interface TotalStakedCellProps {
  pool: Pool;
}

const TotalStakedCell: React.FC<TotalStakedCellProps> = ({ pool }) => {
  // const { sousId, stakingToken, totalStaked, isAutoVault } = pool;
  const { stakingToken, totalStaked } = pool;
  // const { totalCakeInVault } = useCakeVault();

  // const isManualCakePool = sousId === 0;

  const totalStakedBalance = useMemo(() => {
    // if (isAutoVault) {
    //   return getBalanceNumber(totalCakeInVault, stakingToken.decimals);
    // }
    // if (isManualCakePool) {
    // const manualCakeTotalMinusAutoVault = new BigNumber(totalStaked);
    // return getBalanceNumber(manualCakeTotalMinusAutoVault, stakingToken.decimals);
    // }
    return getBalanceNumber(totalStaked, stakingToken.decimals);
  }, [totalStaked, stakingToken.decimals]);
  // }, [isAutoVault, totalCakeInVault, isManualCakePool, totalStaked, stakingToken.decimals]);
  return totalStaked && totalStaked.gte(0) ? (
    <Balance fontSize="16px" bold value={totalStakedBalance} decimals={0} unit={` ${stakingToken.symbol}`} />
  ) : (
    <Skeleton width="80px" height="16px" />
  );
};

export default TotalStakedCell;
