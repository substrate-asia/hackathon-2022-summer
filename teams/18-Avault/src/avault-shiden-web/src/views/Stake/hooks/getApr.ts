import { useEffect, useState } from 'react';
import { IDappStakingInterface } from 'utils/types';
const dailyApr = async (contract: IDappStakingInterface, setApr: React.Dispatch<React.SetStateAction<number>>) => {
  if (contract.calcDailyApr) {
    try {
      const RATIO_PRECISION = await contract.RATIO_PRECISION();
      const RATIO_PRECISION_Number = Number(RATIO_PRECISION.toString());
      const dailyApr = await contract.calcDailyApr();
      const dailyApr_Number = Number(dailyApr.toString());
      const __apr = (1 + dailyApr_Number / RATIO_PRECISION_Number) ^ (365 - 1);
      setApr(__apr);
    } catch (e) {
      // console.log('get dailyApr err', e);
      setApr(0);
    }
  }
};
export const GetDAppApr = (contract) => {
  const [apr, setApr] = useState(0);
  useEffect(() => {
    if (contract) {
      dailyApr(contract, setApr);
    }
  }, [contract]);
  return apr;
};
