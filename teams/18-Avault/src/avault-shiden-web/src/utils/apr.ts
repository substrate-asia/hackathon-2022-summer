import { BSC_BLOCK_TIME } from './../config/index';
import BigNumber from 'bignumber.js';
import { BLOCKS_PER_YEAR } from 'config';
import lpAprs from 'config/constants/lpAprs.json';

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new Kac allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number,
): number => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR);
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked);
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100);
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber();
};

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param kacPriceUsd Kac price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getFarmApr = (
  kacPerBlock: BigNumber,
  poolWeight: BigNumber,
  kacPriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  farmAddress: string,
): { kacRewardsApr: number; lpRewardsApr: number; kacRewardApy: number } => {
  const BLOCKS_PER_DAY = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24);
  const daylyKacRewardAllocation = kacPerBlock.times(BLOCKS_PER_DAY).times(poolWeight);
  const kacRewardsDaylyApr = daylyKacRewardAllocation.times(kacPriceUsd).div(poolLiquidityUsd).toNumber();
  const kacRewardsApy = new BigNumber(kacRewardsDaylyApr).pow(365).multipliedBy(100);
  // console.log(
  //   'farmAddress',
  //   farmAddress,
  //   '-------------',
  //   BLOCKS_PER_DAY.toString(),
  //   kacPerBlock.toString(),
  //   poolWeight.toString(),
  //   daylyKacRewardAllocation.toString(),
  //   kacRewardsDaylyApr.toString(),
  //   'kacPriceUsd',
  //   kacPriceUsd.toFixed(8),
  //   'poolLiquidityUsd',
  //   poolLiquidityUsd.toString(),
  // );
  const yearlyKacRewardAllocation = kacPerBlock.times(BLOCKS_PER_YEAR).times(poolWeight);
  const kacRewardsApr = yearlyKacRewardAllocation.times(kacPriceUsd).div(poolLiquidityUsd).times(100);
  let kacRewardsAprAsNumber = 0;
  let kacRewardsApyAsNumber = 0;

  if (!kacRewardsApr.isNaN() && kacRewardsApr.isFinite()) {
    kacRewardsAprAsNumber = kacRewardsApr.toNumber();
  }
  if (!kacRewardsApy.isNaN() && kacRewardsApy.isFinite()) {
    kacRewardsApyAsNumber = kacRewardsApy.toNumber();
  }

  const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0;

  // console.log(
  //   'kacRewardsAprAsNumber',
  //   kacRewardsAprAsNumber,
  //   kacRewardsApr.toJSON(),
  //   lpRewardsApr,
  //   'kacRewardsApyAsNumber',
  //   kacRewardsApyAsNumber,
  //   kacRewardsApy.toString(),
  // );
  return { kacRewardsApr: kacRewardsAprAsNumber, lpRewardsApr, kacRewardApy: kacRewardsApyAsNumber };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default null;
