import BigNumber from 'bignumber.js';
import erc20 from 'config/abi/erc20.json';
import { getAddress } from 'utils/addressHelpers';
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber';
import multicall from 'utils/multicall';
import { Farm, SerializedBigNumber } from '../types';
import { chainKey } from 'config';
import { CHAINKEY } from '@my/sdk';
import masterchefABI from 'config/abi/masterchef_aavt_shiden.json';
import { chainId } from 'config/constants/tokens';
import { getAultPrice } from 'views/Zap/utils/utils';
import { IVault } from 'state/vault/types';

export type PublicFarmData = {
  tokenAmountMc: SerializedBigNumber;
  quoteTokenAmountMc: SerializedBigNumber;
  tokenAmountTotal: SerializedBigNumber;
  quoteTokenAmountTotal: SerializedBigNumber;
  lpTotalInQuoteToken: SerializedBigNumber;
  lpTotalSupply: SerializedBigNumber;
  tokenPriceVsQuote: SerializedBigNumber;
  poolWeight: SerializedBigNumber;
  multiplier: string;
  liquidity: string;
};

const fetchFarm = async (
  farm: Farm,
  priceVsBusdMap: Record<string, string>,
  vaultData: IVault[],
): Promise<PublicFarmData> => {
  const { pid, lpAddresses, lpMasterChefes, lpDetail, token, quoteToken, decimals } = farm;
  const lpAddress = getAddress(lpAddresses);
  const lpMasterChef = getAddress(lpMasterChefes);
  const calls = [
    // Balance of token in the LP contract
    {
      address: getAddress(token.address),
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of quote token on LP contract
    {
      address: getAddress(quoteToken.address),
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of LP tokens in the master chef contract
    {
      address: lpAddress,
      name: 'balanceOf',
      params: [lpMasterChef],
    },
    // Total supply of LP tokens
    {
      address: lpAddress,
      name: 'totalSupply',
    },
    // Token decimals
    {
      address: getAddress(token.address),
      name: 'decimals',
    },
    // Quote token decimals
    {
      address: getAddress(quoteToken.address),
      name: 'decimals',
    },
  ];

  const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply, tokenDecimals, quoteTokenDecimals] =
    await multicall(erc20, calls);

  const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply));

  // Raw amount of token in the LP, including those not staked
  const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals));
  const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteTokenDecimals));

  // Amount of token in the LP that are staked in the MC (i.e amount of token * lp ratio)
  const tokenAmountMc = tokenAmountTotal.times(lpTokenRatio);
  const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio);
  // Total staked in LP, in quote token value
  // const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2));

  // Only make masterchef calls if farm has pid
  const [info, totalAllocPoint] =
    pid || pid === 0
      ? await multicall(masterchefABI, [
          {
            address: lpMasterChef,
            name: 'poolInfo',
            params: [pid],
          },
          {
            address: lpMasterChef,
            name: 'totalAllocPoint',
          },
        ])
      : [null, null];
  const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO;
  const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO;
  let lpTokenPrice = '0';
  if (lpTotalSupply && priceVsBusdMap[token.address[chainId].toLowerCase()]) {
    // const farmTokenPriceInUsd = priceVsBusdMap[token.address[chainId].toLowerCase()];
    // console.log('farmTokenPriceInUsd: ', farmTokenPriceInUsd);
    // const valueOfBaseTokenInFarm = new BigNumber(farmTokenPriceInUsd).times(tokenAmountTotal);
    // const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2);
    // const totalLpTokens = getBalanceAmount(new BigNumber(lpTotalSupply));
    // lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens);

    const _token = token.address[chainId].toLowerCase();
    const _tokenDecimals = token.decimals;
    const _lpAddress = lpDetail.address[chainId].toLowerCase();
    lpTokenPrice = await getAultPrice(
      _token,
      _tokenDecimals,
      priceVsBusdMap,
      _lpAddress,
      lpAddress.toLowerCase(),
      vaultData,
    );
  }

  //  akks  0.24
  //  lp  0.4
  // akksprice = lpTokenPrice*1.234(比例)
  // 17829525466206354
  const liquidity = new BigNumber(lpTokenBalanceMC)
    .div(BIG_TEN.pow(new BigNumber(decimals)))
    .times(new BigNumber(lpTokenPrice))
    .toFixed(8);
  return {
    tokenAmountMc: tokenAmountMc.toJSON(),
    quoteTokenAmountMc: quoteTokenAmountMc.toJSON(),
    tokenAmountTotal: tokenAmountTotal.toJSON(),
    quoteTokenAmountTotal: quoteTokenAmountTotal.toJSON(),
    lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
    // lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
    lpTotalInQuoteToken: liquidity,
    tokenPriceVsQuote: quoteTokenAmountTotal.div(tokenAmountTotal).toJSON(),
    poolWeight: poolWeight.toJSON(),
    liquidity: liquidity,
    multiplier: `${allocPoint.div(new BigNumber(chainKey === CHAINKEY.BSC ? 1 : 100)).toString()}X`,
  };
};

export default fetchFarm;
