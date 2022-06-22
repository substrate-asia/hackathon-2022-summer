import { ethers } from 'ethers';
import { simpleRpcProvider } from 'utils/providers';
import { poolsConfig } from 'config/constants';
import { PoolCategory } from 'config/constants/types';
import { Web3Provider } from '@ethersproject/providers';
// Addresses
import {
  getAddress,
  getPancakeProfileAddress,
  getPancakeRabbitsAddress,
  getBunnyFactoryAddress,
  getBunnySpecialAddress,
  getCakeAddress,
  getLotteryV2Address,
  getMasterChefAddress,
  getPointCenterIfoAddress,
  getClaimRefundAddress,
  getTradingCompetitionAddress,
  getEasterNftAddress,
  getCakeVaultAddress,
  getPredictionsAddress,
  getChainlinkOracleAddress,
  getMulticallAddress,
  getBunnySpecialCakeVaultAddress,
  getBunnySpecialPredictionAddress,
  getFarmAuctionAddress,
  getMerkleAddress,
  getKarsierAddress,
  getDappStakingAddress,
} from 'utils/addressHelpers';

// ABI
import profileABI from 'config/abi/pancakeProfile.json';
import pancakeRabbitsAbi from 'config/abi/pancakeRabbits.json';
import bunnyFactoryAbi from 'config/abi/bunnyFactory.json';
import bunnySpecialAbi from 'config/abi/bunnySpecial.json';
import bep20Abi from 'config/abi/erc20.json';
import erc721Abi from 'config/abi/erc721.json';
import lpTokenAbi from 'config/abi/lpToken.json';
import cakeAbi from 'config/abi/kaco.json';
import ifoV1Abi from 'config/abi/ifoV1.json';
import ifoV2Abi from 'config/abi/ifoV2.json';
import pointCenterIfo from 'config/abi/pointCenterIfo.json';
import lotteryV2Abi from 'config/abi/lotteryV2.json';
import masterChef from 'config/abi/masterchef.json';
import sousChef from 'config/abi/sousChef.json';
import sousChefV2 from 'config/abi/sousChefV2.json';
import sousChefBnb from 'config/abi/sousChefBnb.json';
import claimRefundAbi from 'config/abi/claimRefund.json';
import tradingCompetitionAbi from 'config/abi/tradingCompetition.json';
import easterNftAbi from 'config/abi/easterNft.json';
import cakeVaultAbi from 'config/abi/cakeVault.json';
import predictionsAbi from 'config/abi/predictions.json';
import chainlinkOracleAbi from 'config/abi/chainlinkOracle.json';
import MultiCallAbi from 'config/abi/Multicall.json';
import bunnySpecialCakeVaultAbi from 'config/abi/bunnySpecialCakeVault.json';
import bunnySpecialPredictionAbi from 'config/abi/bunnySpecialPrediction.json';
import farmAuctionAbi from 'config/abi/farmAuction.json';
import merkleAbi from 'config/abi/merkleAbi.json';
import KarsierAbi from 'config/abi/karsierAbi.json';
import dAppStakingAbi from 'config/abi/dAppStakingAbi.json';

import {
  ChainLinkOracleContract,
  FarmAuctionContract,
  PredictionsContract,
  IMerkleDistributorInterface,
  IDappStakingInterface,
} from './types';
import { calculateGasMargin, getSigner } from 'utils';
import { parseEther } from 'ethers/lib/utils';
import { ERC20_ABI } from 'config/abi/erc20';

const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};

export const getBep20Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bep20Abi, address, signer);
};
export const getErc721Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(erc721Abi, address, signer);
};
export const getLpContract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(lpTokenAbi, address, signer);
};
export const getIfoV1Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(ifoV1Abi, address, signer);
};
export const getIfoV2Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(ifoV2Abi, address, signer);
};
export const getSouschefContract = (id: number, signer?: ethers.Signer | ethers.providers.Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id);
  const abi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef;
  return getContract(abi, getAddress(config.contractAddress), signer);
};
export const getSouschefV2Contract = (id: number, signer?: ethers.Signer | ethers.providers.Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id);
  return getContract(sousChefV2, getAddress(config.contractAddress), signer);
};
export const getPointCenterIfoContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(pointCenterIfo, getPointCenterIfoAddress(), signer);
};
export const getCakeContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(cakeAbi, getCakeAddress(), signer);
};
export const getProfileContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(profileABI, getPancakeProfileAddress(), signer);
};
export const getPancakeRabbitContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(pancakeRabbitsAbi, getPancakeRabbitsAddress(), signer);
};
export const getBunnyFactoryContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bunnyFactoryAbi, getBunnyFactoryAddress(), signer);
};
export const getBunnySpecialContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bunnySpecialAbi, getBunnySpecialAddress(), signer);
};
export const getLotteryV2Contract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(lotteryV2Abi, getLotteryV2Address(), signer);
};
export const getMasterchefContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(masterChef, getMasterChefAddress(), signer);
};
export const getSpecialMasterchefContract = (
  abi: any,
  masterChefAddress: string,
  signer?: ethers.Signer | ethers.providers.Provider,
) => {
  return getContract(abi, masterChefAddress, signer);
};
export const getClaimRefundContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(claimRefundAbi, getClaimRefundAddress(), signer);
};
export const getTradingCompetitionContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(tradingCompetitionAbi, getTradingCompetitionAddress(), signer);
};
export const getEasterNftContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(easterNftAbi, getEasterNftAddress(), signer);
};
export const getCakeVaultContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(cakeVaultAbi, getCakeVaultAddress(), signer);
};

export const getPredictionsContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(predictionsAbi, getPredictionsAddress(), signer) as PredictionsContract;
};

export const getChainlinkOracleContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(chainlinkOracleAbi, getChainlinkOracleAddress(), signer) as ChainLinkOracleContract;
};
export const getMulticallContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MultiCallAbi, getMulticallAddress(), signer);
};
export const getBunnySpecialCakeVaultContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bunnySpecialCakeVaultAbi, getBunnySpecialCakeVaultAddress(), signer);
};
export const getBunnySpecialPredictionContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bunnySpecialPredictionAbi, getBunnySpecialPredictionAddress(), signer);
};
export const getFarmAuctionContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(farmAuctionAbi, getFarmAuctionAddress(), signer) as FarmAuctionContract;
};

export const getMerkleContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  const _merkle = getContract(merkleAbi, getMerkleAddress(), signer) as IMerkleDistributorInterface;
  return _merkle;
};
export const getKarsierContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  const _merkle = getContract(KarsierAbi, getKarsierAddress(), signer) as IMerkleDistributorInterface;
  return _merkle;
};

export const getDappStakingContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  const _merkle = getContract(dAppStakingAbi, getDappStakingAddress(), signer) as IDappStakingInterface;
  return _merkle;
};

export const getETHBalance = async (account: string, library: Web3Provider) => {
  return library.getBalance(account);
};

export const getERC20Balance = async (contractAddress: string, library: Web3Provider, account?: string) => {
  const contract = getContract(ERC20_ABI, contractAddress, library);
  return contract.balanceOf(account);
};

export const sendTransaction = async (
  library: Web3Provider,
  account: string,
  amount: string,
  to: string,
): Promise<ethers.providers.TransactionResponse | any> => {
  try {
    const signer = getSigner(library, account);
    const estimatedGas = await signer.estimateGas({
      value: parseEther(amount),
      to: to,
    });
    const tx = await signer.sendTransaction({
      gasLimit: calculateGasMargin(estimatedGas),
      value: parseEther(amount),
      to: to,
    });
    const receipt = await tx.wait();
    if (receipt.status) {
      // console.log(receipt);
      return {
        receipt: receipt,
        isOk: true,
      };
    } else {
      console.log(receipt);
      return {
        isOk: false,
        message: 'Some Error',
      };
    }
  } catch (e: any) {
    console.log(3333, e);
    return {
      isOk: false,
      message: e?.message,
    };
  }
};
// export const sendERC20Token = async (contractAddress: string,account:string, sendAddress: string, amount: BigNumber, library: Web3Provider):Promise<TransactionResponse> => {
// 	return getContract(contractAddress,ERC20ABI,library,account).transfer(sendAddress, amount)
// }

// export const doApprove = async (contractAddress: string,account:string, sendAddress: string, library: Web3Provider):Promise<TransactionResponse> => {
// 	return getContract(contractAddress,ERC20ABI,library,account).approve(sendAddress,ethers.constants.MaxUint256)
// }

// export const getAllowance = async (contractAddress: string, library: Web3Provider, targetAddress:string,account: string) => {
// 	return getContract(contractAddress, ERC20ABI, library).allowance(account,targetAddress)
// }

// export const signMessage = async (account: string, library: Web3Provider, message:string,):Promise<string> => {
// 	return library.getSigner(account).signMessage(message)
// }
