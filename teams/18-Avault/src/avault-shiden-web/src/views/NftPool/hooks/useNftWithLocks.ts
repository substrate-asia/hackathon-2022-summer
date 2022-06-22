import { useWeb3React } from '@web3-react/core';
import { NFT, NFT_POOLS } from './../components/GoodsInPool';
import type { BigNumber as BN } from '@ethersproject/bignumber';
import _ from 'lodash';
import { NFT_TYPE } from 'config/constants/nft';
import { useContract } from 'hooks/useContract';
import { useEffect, useState, useMemo } from 'react';
import NFT100Pair721 from 'config/abi/NFT100Pair721.json';
import NFT100Pair1155 from 'config/abi/NFT100Pair1155.json';
import { fetchNftInfo } from '../util/fetchNft';
import { NftPair } from 'views/NftPools/hooks/useNftPools';

export type LockInfo = { lastBlock: number; unlocker: string; amount?: number };
export type NftLockInfo = {
  id: number;
  lastBlock: number;
  unlocker: string;
  amount?: number;
};
export type Locks = { [key: number]: LockInfo };
export type NftInfoWithLock = LockInfo & NFT;

const defaultAddress = '0x0000000000000000000000000000000000000001';

export const useNftWithLocks = (pair?: { type: NFT_TYPE; address: string; nftAddress: string }) => {
  // const [fetching, setFetching] = useState(true);
  const contract = useContract(pair?.address, pair?.type === NFT_TYPE.NFT1155 ? NFT100Pair1155 : NFT100Pair721);
  const [locksInfo, setLocksInfo] = useState<NftInfoWithLock[]>();
  const { account: _account } = useWeb3React();

  const account = useMemo(() => _account || defaultAddress, [_account]);

  useEffect(() => {
    if (!contract || !pair) {
      return;
    }
    if (pair.type === NFT_TYPE.NFT721) {
      contract.getLockInfos().then(async ([ids, locksInfo]: [BN[], [number, string][]]) => {
        const promises = ids.map(async (id) => fetchNftInfo(pair.nftAddress, id.toNumber(), account, null));

        const results = await Promise.all(promises);

        const nfts: NftInfoWithLock[] = results.filter(Boolean).map((nft, index) => ({
          lastBlock: locksInfo[index][0],
          unlocker: locksInfo[index][1],
          ...nft,
        }));

        setLocksInfo(nfts);
      }, console.log);
    } else if (pair.type === NFT_TYPE.NFT1155) {
      contract.getLockInfos(0).then(async (lockInfos: [BN, string, number, BN][]) => {
        const promises = lockInfos.map(async (lockInfo) =>
          fetchNftInfo(pair.nftAddress, lockInfo[0].toNumber(), account),
        );

        const results = await Promise.all(promises);
        const nfts: NftInfoWithLock[] = results.filter(Boolean).map((nft, index) => ({
          lastBlock: lockInfos[index][2],
          unlocker: lockInfos[index][1],
          amount: lockInfos[index][3].toNumber(),
          ...nft,
        }));

        setLocksInfo(nfts);
      }, console.log);
    }
  }, [contract, pair, account]);

  return locksInfo;
};

export const useNftWithLockInfo = (pair?: { type: NFT_TYPE; address: string }) => {
  const contract = useContract(pair?.address, pair?.type === NFT_TYPE.NFT1155 ? NFT100Pair1155 : NFT100Pair721);
  const [locksInfo, setLocksInfo] = useState<Locks>({});

  useEffect(() => {
    if (!contract || !pair) {
      return;
    }

    if (pair?.type === NFT_TYPE.NFT721) {
      contract.getLockInfos().then(([ids, locksInfo]: [string[], [number, string][]]) => {
        const locks: Locks = ids.reduce((all: Locks, id, index) => {
          all[id] = {
            lastBlock: locksInfo[index][0],
            unlocker: locksInfo[index][1],
          };

          return all;
        }, {});

        setLocksInfo((old) => (_.isEqual(old, locks) ? old : locks));
      }, console.log);
    } else if (pair?.type === NFT_TYPE.NFT1155) {
      // if (pairDetail) {
      //   const len = Math.ceil(pairDetail.supply / 500);
      //   const startArr = [];
      //   for (let i = 0; i < len; i++) {
      //     startArr.push(i * 500);
      //   }
      //   // 构建队列
      //   const queue = async (arr) => {
      //     const res = [];
      //     for (const key of arr) {
      //       console.log(key);
      //       const data = await contract.getLockInfos(key);
      //       res.push(data);
      //     }
      //     return await res;
      //   };
      //   // 执行队列
      //   queue(startArr)
      //     .then((lockInfos: [BN, string, number, BN][][]) => {
      //       let locks: Locks = {};
      //       for (let j = 0; j < lockInfos.length; j++) {
      //         const _locks: Locks = lockInfos[j].reduce((all: Locks, curr) => {
      //           all[curr[0].toString()] = {
      //             lastBlock: curr[2],
      //             unlocker: curr[1],
      //             amount: curr[3].toString(),
      //           };
      //           return all;
      //         }, {});
      //         locks = { ...locks, ..._locks };
      //       }
      //       setLocksInfo((old) => (_.isEqual(old, locks) ? old : locks));
      //     })
      //     .catch((e) => console.log(e));
      // }
      contract.getLockInfos(0).then((lockInfos: [BN, string, number, BN][]) => {
        const locks: Locks = lockInfos.reduce((all: Locks, curr) => {
          all[curr[0].toString()] = {
            lastBlock: curr[2],
            unlocker: curr[1],
            amount: curr[3].toString(),
          };
          return all;
        }, {});
        setLocksInfo((old) => (_.isEqual(old, locks) ? old : locks));
      }, console.log);
    }
  }, [contract, pair]);

  return locksInfo;
};

export const useNfts = (
  pairDetail: NftPair | undefined,
  pair?: { type: NFT_TYPE; address: string },
  _nfts?: NftLockInfo[],
): NftLockInfo[] => {
  const contract = useContract(pair?.address, pair?.type === NFT_TYPE.NFT1155 ? NFT100Pair1155 : NFT100Pair721);
  const [locksInfo, setLocksInfo] = useState<NftLockInfo[]>(_nfts);
  useEffect(() => {
    if (!contract || !pair) {
      return;
    }
    if (pair?.type === NFT_TYPE.NFT721) {
      contract.getLockInfos().then(([ids, locksInfo]: [BN[], [number, string][]]) => {
        const locks: NftLockInfo[] = ids.map((id, index) => ({
          id: id.toNumber(),
          lastBlock: locksInfo[index][0],
          unlocker: locksInfo[index][1],
        }));

        setLocksInfo((old) => (_.isEqual(old, locks) ? old : locks));
      }, console.log);
    } else if (pair.type === NFT_TYPE.NFT1155) {
      if (pairDetail) {
        const len = Math.ceil(pairDetail.supply / 500);
        const startArr = [];
        for (let i = 0; i < len; i++) {
          startArr.push(i * 500);
        }
        // 构建队列
        const queue = async (arr) => {
          const res = [];
          for (const key of arr) {
            // console.log(key);
            const data = await contract.getLockInfos(key);
            // console.log(data);
            res.push(data);
          }
          return await res;
        };
        const locks: NftLockInfo[] = [];
        // 执行队列
        queue(startArr)
          .then((lockInfos: [BN, string, number, BN][][]) => {
            for (let j = 0; j < lockInfos.length; j++) {
              const _item = lockInfos[j].map((curr: any) => ({
                id: curr[0].toNumber(),
                lastBlock: curr[2],
                unlocker: curr[1],
                amount: curr[3].toNumber(),
              }));
              locks.push(..._item);
            }
            setLocksInfo((old) => (_.isEqual(old, locks) ? old : locks));
          })
          .catch((e) => console.log(e));
        // contract.getLockInfos(0).then((lockInfos: [BN, string, number, BN][]) => {
        //   const locks: NftLockInfo[] = lockInfos.map((curr) => ({
        //     id: curr[0].toNumber(),
        //     lastBlock: curr[2],
        //     unlocker: curr[1],
        //     amount: curr[3].toNumber(),
        //   }));

        //   setLocksInfo((old) => (_.isEqual(old, locks) ? old : locks));
        // }, console.log);
      }
    }
  }, [contract, pairDetail, pair]);
  localStorage.setItem(`${NFT_POOLS}-${pair?.address.toLowerCase()}-nft`, JSON.stringify(locksInfo));
  return locksInfo;
};
