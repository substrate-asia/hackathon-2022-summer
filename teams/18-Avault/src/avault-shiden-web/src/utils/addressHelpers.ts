import { ChainId } from '@my/sdk';
import { chainKey } from 'config';
import addresses from 'config/constants/contracts';
import tokens, { chainId, DEFAULT_Token } from 'config/constants/tokens';
import { Address } from 'config/constants/types';
import { dAppStakingcontract } from 'config/constants/dAppStaking';

export const getAddress = (address: Address | string): string => {
  if (typeof address === 'string') {
    return address;
  }
  return address[chainId] ? address[chainId] : address[ChainId.BSC_MAINNET];
};

export const getCakeAddress = () => {
  return getAddress(tokens[chainKey].kaco.address);
};
export const getMasterChefAddress = () => {
  return getAddress(addresses.masterChef);
};
export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall);
};
export const getwethAddress = () => {
  return getAddress(DEFAULT_Token[chainId].address);
};
export const getLotteryV2Address = () => {
  return getAddress(addresses.lotteryV2);
};
export const getPancakeProfileAddress = () => {
  return getAddress(addresses.pancakeProfile);
};
export const getPancakeRabbitsAddress = () => {
  return getAddress(addresses.pancakeRabbits);
};
export const getBunnyFactoryAddress = () => {
  return getAddress(addresses.bunnyFactory);
};
export const getClaimRefundAddress = () => {
  return getAddress(addresses.claimRefund);
};
export const getPointCenterIfoAddress = () => {
  return getAddress(addresses.pointCenterIfo);
};
export const getBunnySpecialAddress = () => {
  return getAddress(addresses.bunnySpecial);
};
export const getTradingCompetitionAddress = () => {
  return getAddress(addresses.tradingCompetition);
};
export const getEasterNftAddress = () => {
  return getAddress(addresses.easterNft);
};
export const getCakeVaultAddress = () => {
  return getAddress(addresses.cakeVault);
};
export const getPredictionsAddress = () => {
  return getAddress(addresses.predictions);
};
export const getChainlinkOracleAddress = () => {
  return getAddress(addresses.chainlinkOracle);
};
export const getBunnySpecialCakeVaultAddress = () => {
  return getAddress(addresses.bunnySpecialCakeVault);
};
export const getBunnySpecialPredictionAddress = () => {
  return getAddress(addresses.bunnySpecialPrediction);
};
export const getFarmAuctionAddress = () => {
  return getAddress(addresses.farmAuction);
};
export const getMerkleAddress = () => {
  return getAddress(addresses.merkle);
};

export const getKarsierAddress = () => {
  return getAddress(addresses.karsier);
};
export const getDappStakingAddress = () => {
  return getAddress(dAppStakingcontract);
};
