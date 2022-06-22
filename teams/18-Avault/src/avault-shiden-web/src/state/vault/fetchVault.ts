import masterchefABI from 'config/abi/masterchef.json';
import masterchefSdnABI from 'config/abi/masterchef_Shiden.json';
import { chainId } from 'config/constants/tokens';
import { getAddress } from 'utils/addressHelpers';
import multicall from 'utils/multicall';
import { IVault, IVaultConfigItem } from './types';
import AVaultPCS_ABI from 'config/abi/AVaultPCS_ABI.json';
import erc20 from 'config/abi/erc20.json';
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber';
import { chainKey } from 'config';
import { CHAINKEY } from '@my/sdk';
import BigNumber from 'bignumber.js';
import { getBalanceAmount } from 'utils/formatBalance';

const fetchVault = async (
  account: string,
  vault: IVaultConfigItem,
  priceVsBusdMap: Record<string, string>,
  vaultData: IVault,
): Promise<IVault> => {
  const vaultPublicData = await fetch(account, vault, priceVsBusdMap, vaultData);
  return { ...vault, ...vaultPublicData };
};
const fetch = async (
  account: string,
  vault: IVaultConfigItem,
  priceVsBusdMap: Record<string, string>,
  vaultData: IVault,
): Promise<IVault> => {
  const AVaultPCS = getAddress(vault.contractAddress[chainId]);
  const {
    masterChef,
    name,
    symbol,
    pid,
    wantAddress,
    token0Address,
    token1Address,
    earnedAddress,
    AVAAddress,
    wantLockedTotal,
    vaultTotalSupply,
    vaultDecimals,
  } = await fetchVaultABI(AVaultPCS);

  const { lpAddresses, poolWeight, multiplier } = await fetchMasterChefABI(masterChef, pid, vaultData);
  const {
    tokenAmountMc,
    tokenAmountTotal,
    quoteTokenAmountMc,
    quoteTokenAmountTotal,
    lpTotalSupply,
    lpTotalInQuoteToken,
    tokenPriceVsQuote,
    lpSymbol,
    quoteTokenDecimals,
    liquidity,
    lpTokenPrice,
    lpAddressDecimals,
  } = await fetchFarmDataABI(masterChef, lpAddresses, token0Address, token1Address, priceVsBusdMap);
  // console.log(vault.lpDetail.symbol, lpAddresses, lpAddressDecimals);
  const lpToCLpRate =
    wantLockedTotal && vaultTotalSupply && wantLockedTotal > 0 && vaultTotalSupply > 0
      ? (Number(wantLockedTotal) / Number(vaultTotalSupply)).toFixed(18)
      : '1';

  const currentSeconds = Math.floor(Date.now() / 1000);
  // 86400s/day
  const data = Math.ceil((currentSeconds - vaultData.online_at) / 86400) - 1;
  // state.data[index]?.online_at
  const kacRewardsApr = (Number(lpToCLpRate) - 1) / data + 1;
  const kacRewardApy = new BigNumber(kacRewardsApr).pow(365).times(100).minus(100).toFixed(2);

  const userData = vaultData?.farm?.userData ?? {};
  const _userDataKey = `${account}-${chainId}`;
  const _userData = userData[_userDataKey] ?? {
    account: '',
    allowance: '0',
    stakingTokenBalance: '0',
    stakedBalance: '0',
    pendingReward: '0',
    avaultAddressBalance: '0',
    userVaultSupply: '0',
  };

  return {
    isLoading: false,
    ...vault,
    vault: {
      symbol: symbol,
      name: name,
      masterChef: masterChef,
      token0Address: token0Address,
      token1Address: token1Address,
      fromSource: vault.fromSource,
      wantAddress: wantAddress,
      earnedAddress: earnedAddress,
      wantLockedTotal: wantLockedTotal,
      totalSupply: vaultTotalSupply,
      AVAAddress: AVAAddress,
      decimals: vaultDecimals,
      lpToCLpRate: lpToCLpRate,
    },
    farm: {
      pid: pid,
      lpSymbol: lpSymbol,
      lpAddresses: lpAddresses,
      token: token0Address,
      quoteToken: token1Address,
      tokenAmountMc: tokenAmountMc,
      quoteTokenAmountMc: quoteTokenAmountMc,
      tokenAmountTotal: tokenAmountTotal,
      quoteTokenAmountTotal: quoteTokenAmountTotal,
      lpTotalInQuoteToken: lpTotalInQuoteToken,
      lpTotalSupply: lpTotalSupply,
      tokenPriceVsQuote: tokenPriceVsQuote,
      poolWeight: poolWeight.toString(),
      multiplier: multiplier,
      quoteTokenDecimals: quoteTokenDecimals,
      liquidity: liquidity,
      lpTokenPrice: lpTokenPrice,
      lpAddressDecimals: lpAddressDecimals,
      apr: `${kacRewardsApr}`,
      apy: kacRewardApy,
      userData: {
        [_userDataKey]: {
          account: _userData.account,
          allowance: _userData.allowance,
          stakingTokenBalance: _userData.stakingTokenBalance,
          stakedBalance: _userData.stakedBalance,
          pendingReward: _userData.pendingReward,
          avaultAddressBalance: _userData.avaultAddressBalance,
          userVaultSupply: _userData.userVaultSupply,
        },
      },
    },
  };
};
const fetchVaultABI = async (AVaultPCSAddress: string) => {
  const calls = [
    {
      address: AVaultPCSAddress,
      name: 'farmContractAddress',
    },
    {
      address: AVaultPCSAddress,
      name: 'name',
    },
    {
      address: AVaultPCSAddress,
      name: 'symbol',
    },

    {
      address: AVaultPCSAddress,
      name: 'pid',
    },
    {
      address: AVaultPCSAddress,
      name: 'wantAddress',
    },
    {
      address: AVaultPCSAddress,
      name: 'token0Address',
    },
    {
      address: AVaultPCSAddress,
      name: 'token1Address',
    },
    {
      address: AVaultPCSAddress,
      name: 'earnedAddress',
    },

    // {
    //   address: AVaultPCS,
    //   name: 'wethAddress',
    // },
    {
      address: AVaultPCSAddress,
      name: 'AVAAddress',
    },
    {
      address: AVaultPCSAddress,
      name: 'wantLockedTotal',
    },
    {
      address: AVaultPCSAddress,
      name: 'totalSupply',
    },
    // Quote token decimals
    {
      address: AVaultPCSAddress,
      name: 'decimals',
    },
  ];
  const [
    _masterChef,
    _name,
    _symbol,
    _pid,
    _wantAddress,
    _token0Address,
    _token1Address,
    _earnedAddress,
    _AVAAddress,
    _wantLockedTotal,
    _vaultTotalSupply,
    _vaultDecimals,
  ] = await multicall(AVaultPCS_ABI, calls);
  return {
    masterChef: _masterChef ? _masterChef[0] : null,
    name: _name ? _name[0] : null,
    symbol: _symbol ? _symbol[0] : null,
    pid: _pid ? _pid[0].toNumber() : null,
    wantAddress: _wantAddress ? _wantAddress[0] : null,
    token0Address: _token0Address ? _token0Address[0] : null,
    token1Address: _token1Address ? _token1Address[0] : null,
    earnedAddress: _earnedAddress ? _earnedAddress[0] : null,
    AVAAddress: _AVAAddress ? _AVAAddress[0] : null,
    wantLockedTotal: _wantLockedTotal ? _wantLockedTotal[0].toString() : null,
    vaultTotalSupply: _vaultTotalSupply ? _vaultTotalSupply[0].toString() : null,
    vaultDecimals: _vaultDecimals ? _vaultDecimals[0].toString() : null,
  };
};
const fetchMasterChefABI = async (masterChefAddress: string, pid: number, vaultData: IVault) => {
  const _masterchefABI = chainKey === CHAINKEY.SDN ? masterchefSdnABI : masterchefABI;
  // info: [
  //   lpToken (address) : 0x456c0082de0048ee883881ff61341177fa1fef40
  //   allocPoint (uint256) : 2000
  //   lastRewardBlock (uint256) : 1296996
  //   accKacPerShare (uint256) : 349319463345545
  // ]
  const [info, totalAllocPoint] =
    pid || pid === 0
      ? await multicall(_masterchefABI, [
          {
            address: masterChefAddress,
            name: 'poolInfo',
            params: [pid],
          },
          {
            address: masterChefAddress,
            name: 'totalAllocPoint',
          },
        ])
      : [null, null];
  const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO;
  const lpAddresses = info ? info.lpToken : '';

  const poolWeight = totalAllocPoint
    ? allocPoint.div(new BigNumber(totalAllocPoint))
    : vaultData?.farm?.poolWeight
    ? new BigNumber(vaultData.farm.poolWeight)
    : BIG_ZERO;
  return {
    lpAddresses,
    poolWeight,
    multiplier: `${allocPoint.div(new BigNumber(100)).toString()}X`,
  };
};
const fetchFarmDataABI = async (
  masterChefAddress: string,
  lpAddress: string,
  token: string,
  quoteToken: string,
  priceVsBusdMap: Record<string, string>,
) => {
  const calls = [
    {
      address: token,
      name: 'balanceOf',
      params: [lpAddress],
    },
    {
      address: quoteToken,
      name: 'balanceOf',
      params: [lpAddress],
    },
    {
      address: lpAddress,
      name: 'balanceOf',
      params: [masterChefAddress],
    },
    {
      address: lpAddress,
      name: 'totalSupply',
    },
    {
      address: lpAddress,
      name: 'decimals',
    },
    {
      address: token,
      name: 'decimals',
    },
    {
      address: quoteToken,
      name: 'decimals',
    },
    {
      address: lpAddress,
      name: 'symbol',
    },
  ];
  const [
    tokenBalanceLP,
    quoteTokenBalanceLp,
    lpTokenBalanceMC,
    lpTotalSupply,
    lpAddressDecimals,
    tokenDecimals,
    quoteTokenDecimals,
    lpSymbol,
  ] = await multicall(erc20, calls);
  // const {
  //   tokenBalanceLP,
  //   quoteTokenBalanceLp,
  //   lpTokenBalanceMC,
  //   lpTotalSupply,
  //   tokenDecimals,
  //   quoteTokenDecimals,
  //   lpSymbol,
  // } = {
  //   tokenBalanceLP: _tokenBalanceLP ? _tokenBalanceLP[0] : null,
  //   quoteTokenBalanceLp: _quoteTokenBalanceLp ? _quoteTokenBalanceLp[0] : null,
  //   lpTokenBalanceMC: _lpTokenBalanceMC ? _lpTokenBalanceMC[0] : null,
  //   lpTotalSupply: _lpTotalSupply ? _lpTotalSupply[0] : null,
  //   tokenDecimals: _tokenDecimals ? _tokenDecimals[0] : null,
  //   quoteTokenDecimals: _quoteTokenDecimals ? _quoteTokenDecimals[0] : null,
  //   lpSymbol: _lpSymbol ? _lpSymbol[0] : null,
  // };
  // div 除法   times 乘法
  const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply));
  // token balance
  const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals));
  // quote token balance
  const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLp).div(BIG_TEN.pow(quoteTokenDecimals));
  //
  const tokenAmountMc = tokenAmountTotal.times(lpTokenRatio);
  const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio);
  // 在LP中的总质押，以报价代币价值计算
  const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2));
  const totalLiquidity = priceVsBusdMap[quoteToken.toLocaleLowerCase()]
    ? lpTotalInQuoteToken
        .times(priceVsBusdMap[quoteToken.toLocaleLowerCase()] ?? 1)
        .toFixed(2)
        .toString()
    : '';

  let lpTokenPrice = BIG_ZERO;
  if (lpTotalSupply && lpTotalInQuoteToken && priceVsBusdMap[token.toLocaleLowerCase()]) {
    const farmTokenPriceInUsd = priceVsBusdMap[token.toLocaleLowerCase()];
    const valueOfBaseTokenInFarm = new BigNumber(farmTokenPriceInUsd).times(tokenAmountTotal);
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2);
    const totalLpTokens = getBalanceAmount(new BigNumber(lpTotalSupply));
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens);
  }

  return {
    tokenAmountMc: tokenAmountMc.toString(),
    tokenAmountTotal: tokenAmountTotal.toString(),
    quoteTokenAmountMc: quoteTokenAmountMc.toString(),
    quoteTokenAmountTotal: quoteTokenAmountTotal.toString(),
    lpTotalSupply: lpTotalSupply.toString(),
    lpTotalInQuoteToken: lpTotalInQuoteToken.toString(),
    liquidity: totalLiquidity,
    tokenPriceVsQuote: quoteTokenAmountTotal.div(tokenAmountTotal).toString(),
    lpSymbol: lpSymbol ? lpSymbol[0] : '',
    quoteTokenDecimals: quoteTokenDecimals ? quoteTokenDecimals[0] : 18,
    lpAddressDecimals: lpAddressDecimals ? lpAddressDecimals[0] : 18,
    lpTokenPrice: lpTokenPrice.toString(),
  };
};
export default fetchVault;
