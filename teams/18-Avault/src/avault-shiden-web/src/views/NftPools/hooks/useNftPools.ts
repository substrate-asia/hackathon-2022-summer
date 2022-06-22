import { useEffect, useState } from 'react';
import type { BigNumber as BN } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';
import NFT100FactoryAbi from 'config/abi/NFT100Factory.json';
import { NFT_FACTORY, NFT_TYPE, NFT_PAIRS } from 'config/constants/nft';
import multicall, { multicallv2 } from 'utils/multicall';
import { useContract } from 'hooks/useContract';
import _ from 'lodash';
import { chainId } from 'config/constants/tokens';
import { FarmWithStakedValue } from 'views/Farms/components/FarmTable/FarmTable';

export interface NftPair {
  pairAddress: string;
  nftAddress: string;
  type: NFT_TYPE;
  name: string;
  symbol: string;
  supply: number;
  liquidity: number;
}

const fetchNftPairs = async (count: number): Promise<NftPair[]> => {
  const calls = new Array(count).fill(true).map((_, index) => ({
    address: NFT_FACTORY[chainId],
    name: 'getPairByIndex',
    params: [index],
  }));
  // console.log({ calls });
  const infos = (await multicall(NFT100FactoryAbi, calls)) as [string, string, BN, string, string, BN][];
  // console.log({ infos });
  return infos.map((info) => ({
    pairAddress: info[0],
    nftAddress: info[1],
    type: info[2].toNumber(),
    name: info[3],
    symbol: info[4],
    supply: info[5].toNumber(),
    liquidity: 0,
  }));
};

const fetchNftPair = async (index: number): Promise<NftPair> => {
  const calls = [
    {
      address: NFT_FACTORY[chainId],
      name: 'getPairByIndex',
      params: [index],
    },
  ];

  const [info] = (await multicallv2(NFT100FactoryAbi, calls)) as [string, string, BN, string, string, BN][];

  return {
    pairAddress: info[0],
    nftAddress: info[1],
    type: info[2].toNumber(),
    name: info[3],
    symbol: info[4],
    supply: info[5].toNumber(),
    liquidity: 0,
  };
};

export const useNftPairs = (farms: FarmWithStakedValue[]): NftPair[] => {
  const [pairs, setPairs] = useState<NftPair[]>([]);
  const contract = useContract(NFT_FACTORY[chainId], NFT100FactoryAbi);

  useEffect(() => {
    contract.counter().then(async (counter: BN) => {
      // console.log('counter', counter.toString());
      let pairs = await fetchNftPairs(counter.toNumber());

      pairs = pairs
        .filter((pair) => NFT_PAIRS.find((_pair) => _pair.address.toLowerCase() === pair.pairAddress.toLowerCase()))
        .map((pp) => {
          const item = NFT_PAIRS.find((_pair) => _pair.address.toLowerCase() === pp.pairAddress.toLowerCase());
          const v = farms.filter((v) => v.lpSymbol === item.pairs)[0];
          const totalLiquidity = new BigNumber(v.lpTotalInQuoteToken).times(v.quoteToken.busdPrice);
          return {
            ...pp,
            liquidity: Number(totalLiquidity.toFixed(0)),
          };
        });
      setPairs((oldPairs) => (_.isEqual(oldPairs, pairs) ? oldPairs : pairs));
    }, console.error);
  }, [contract, farms]);

  return pairs;
};

export const useNftPair = (index: number, farms: FarmWithStakedValue[]): NftPair => {
  const [pair, setPair] = useState<NftPair>();

  useEffect(() => {
    fetchNftPair(index).then((val) => {
      const item = NFT_PAIRS[index];
      const v = farms.filter((v) => v.lpSymbol === item.pairs)[0];
      const totalLiquidity = new BigNumber(v.lpTotalInQuoteToken).times(v.quoteToken.busdPrice);

      setPair({ ...val, liquidity: Number(totalLiquidity.toFixed(0)) });
    });
  }, [index, farms]);

  return pair;
};
