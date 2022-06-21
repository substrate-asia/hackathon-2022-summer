import React, { KeyboardEvent, FC, useEffect, useMemo, useRef, useState } from 'react';
import { Grid } from '@my/ui';
import styled from 'styled-components';
import NftItem from './Nft';
import { NftPairConfig, NftItemConfig } from 'config/constants/nft';
import { fetchAllNfts } from '../util/fetchNft';
import PageLoader from 'components/Loader/PageLoader';
// import { useTranslation } from 'contexts/Localization';
import { NftPair } from 'views/NftPools/hooks/useNftPools';
// NftInfoWithLock, useNftWithLockInfo,
import Search from 'components/Search';
import { NftInfoWithLock, NftLockInfo, useNfts } from '../hooks/useNftWithLocks';
import NoBalance from './NoBalance';
import { simpleRpcProvider } from 'utils/providers';
import { fetchNftInfo } from '../util/fetchNft';
import { useWeb3React } from '@web3-react/core';
export interface Pool {
  poolName: string;
  fragmentName: string;
  nftCount: number;
  liquidity: number;
  floorPrice: number;
  changeDay7: number;
}

export interface NFT {
  id: number;
  balance: number;
  uri: string;
  image: string;
  name: string;
  attributes: any[];
}
const pageSize = 12;
export const NFT_POOLS = 'NFT_POOLS';
const defaultAddress = '0x0000000000000000000000000000000000000001';

const Pools_: FC<{
  className?: string;
  pair: NftPairConfig | undefined;
  pairDetail: NftPair | undefined;
}> = ({ className, pair, pairDetail }) => {
  let _pairs: NFT[] = [];

  let _nfts: NftLockInfo[] = [];
  try {
    _pairs = JSON.parse(localStorage.getItem(`${NFT_POOLS}-${pair?.address.toLowerCase()}`)) || [];
    _nfts = JSON.parse(localStorage.getItem(`${NFT_POOLS}-${pair?.address.toLowerCase()}-nft`)) || [];
  } catch {
    localStorage.removeItem(NFT_POOLS);
  }

  const [items, setItems] = useState<NFT[]>(_pairs);
  const [fetching, setFetching] = useState(false);
  // const { t } = useTranslation();
  // const locksInfo = useNftWithLockInfo(pair);
  // const nfts = useNftWithLocks(pair);
  const [NftData, setNftData] = useState([...new Set(_pairs.map((v: any) => v && v.name))].filter((v) => v));
  const { account: _account } = useWeb3React();
  const [nfts, setNfts] = useState<NftInfoWithLock[]>();
  const nfts_ = useNfts(pairDetail, pair, _nfts);
  const nftsReversed = useMemo(() => [...nfts_].reverse(), [nfts_]);
  const count = useRef(0);

  const account = useMemo(() => _account || defaultAddress, [_account]);
  const container = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(0);
  const fetchingMore = useRef(false);
  const [showName, setShowName] = useState(false);
  const [searchNameValue, setSearchNameValue] = useState('');
  const [searchIdValue, setSearchIdValue] = useState('');

  useEffect(() => {
    if (!pair?.nftAddress || !pair?.address) {
      return;
    }
    fetchAllNfts(pair.address).then((__items) => {
      const _items = __items.filter((v) => v?.id);
      if (_items.length > 0 && _items.length !== items.length) {
        const _arr = [...new Set(_items.map((v: any) => v && v.name).filter((v) => v))];
        setNftData(_arr);
        if (items.length === 0 || _items.length !== items.length) {
          setItems(_items);
          localStorage.setItem(`${NFT_POOLS}-${pair?.address.toLowerCase()}`, JSON.stringify(_items));
        }
      }
    });
  }, [pair, items]);
  useEffect(() => {
    if (!pair || !nftsReversed.length || !account) {
      return;
    }
    fetchMore(nftsReversed, items, 0, pair.nftAddress, account, '', '').then((res) => {
      if (res.length) {
        setNfts(res);
      }
      return true;
    });
  }, [pair, nftsReversed, items, account]);

  useEffect(() => {
    if (!nfts || !nfts.length || !nftsReversed.length || !pair) {
      return;
    }

    document.body.onscroll = (e) => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if (
        clientHeight + scrollTop > scrollHeight - 300 &&
        !fetchingMore.current &&
        count.current < nftsReversed.length - pageSize
      ) {
        fetchingMore.current = true;
        count.current += pageSize;
        fetchMore(nftsReversed, items, count.current, pair.nftAddress, account, searchIdValue, searchNameValue)
          .then((nfts) => {
            if (document.body.onscroll) {
              setNfts((old) => [...old, ...nfts]);
            }
          })
          .finally(() => (fetchingMore.current = false));
      }
    };

    return () => (document.body.onscroll = undefined);
  }, [nfts, container, items, nftsReversed, account, pair, searchIdValue, searchNameValue]);

  useEffect(() => {
    simpleRpcProvider.getBlockNumber().then(setNow);
  }, []);

  // const results: NftInfoWithLock[] = useMemo(() => {
  //   return items
  //     .filter(({ id }) => locksInfo[id])
  //     .map((item): NftInfoWithLock => {
  //       const lockInfo = locksInfo[item.id];
  //       return {
  //         ...item,
  //         lastBlock: lockInfo.lastBlock,
  //         unlocker: lockInfo.unlocker,
  //         amount: lockInfo.amount,
  //       };
  //     });
  // }, [items, locksInfo]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setFetching(true);
      count.current = 0;
      fetchMore(nftsReversed, items, 0, pair.nftAddress, account, searchIdValue, searchNameValue).then((res) => {
        setNfts(res);
        setFetching(false);
        return true;
      });
    }
  };
  const onSearch = (_searchNameValue?: string) => {
    if (!items || !items.length || fetching) {
      return;
    }
    setFetching(true);
    count.current = 0;
    setShowName(false);
    fetchMore(
      nftsReversed,
      items,
      0,
      pair.nftAddress,
      account,
      searchIdValue,
      _searchNameValue || searchNameValue,
    ).then((res) => {
      setNfts(res);
      setFetching(false);
      return true;
    });
  };
  return (
    <div className={className}>
      {items.length > 0 ? (
        <div className="searchWrap">
          <Search
            placeholder="Search NFT"
            value={searchIdValue || searchNameValue}
            onChange={(v) => {
              if (!items || !items.length) {
                return;
              }
              if (fetching) {
                return;
              }
              if (!showName) {
                setShowName(true);
              }
              setSearchIdValue(v);
              setSearchNameValue('');
            }}
            onSearch={onSearch}
            onFocus={setShowName}
            onBlur={(v) => {
              setShowName(v);
            }}
            onKeyDown={onKeyDown}
          />
          <ul className={showName && NftData.length > 0 ? 'nameList visible' : 'nameList'}>
            {NftData.map((v, index: number) => (
              <li
                key={index}
                onClick={() => {
                  if (fetching) {
                    return;
                  }
                  onSearch(v);
                  setSearchIdValue('');
                  setSearchNameValue(`${v}`);
                }}
                className={searchNameValue === v ? 'on' : ''}
              >
                {v}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {pair?.excludeNFT && pair.excludeNFT.length ? (
        <div className="exclude_nft">
          <h3>
            Exclude NFT <span>+{pair.excludeNFT.length}</span>
          </h3>

          <div className="exclude_nft_pop">
            <h4>Exclude NFT</h4>
            {pair.excludeNFT.map((v, index) => (
              <p key={index}>{v}</p>
            ))}
          </div>
        </div>
      ) : null}
      {!nfts || fetching ? (
        <PageLoader />
      ) : !nfts.length ? (
        <NoBalance />
      ) : (
        <>
          <Grid gridGap="20px" className="pools" ref={container}>
            {nfts.map((item, index) => (
              <NftItem nft={item} key={index} now={now} pairPid={pair.pid} />
            ))}
          </Grid>
          {/* {fetchingMore.current && <PageLoader />} */}
        </>
      )}
    </div>
  );
};

export const GoodsInPool = styled(Pools_)`
  border-radius: 24px;
  z-index: 2;
  position: relative;
  padding-top: 70px;
  ${({ theme }) => theme.mediaQueries.md} {
    background: ${({ theme }) => theme.colors.cardBackground};
    padding: 50px 40px;
  }
  .exclude_nft {
    position: absolute;
    top: 22px;
    right: 0;
    color: #fff;
    ${({ theme }) => theme.mediaQueries.md} {
      top: 62px;
      right: 50px;
    }
    h3 {
      color: #9da6a6;
      font-size: 18px;
      padding-bottom: 10px;
      cursor: pointer;
    }
    h4 {
      color: ${({ theme }) => theme.colors.primary};
      font-size: 20px;
      padding-bottom: 10px;
    }
    p {
      color: #fff;
    }
    span {
      font-size: 14px;
      background: ${({ theme }) => theme.colors.cardBackground};
      border-radius: 12px;
      margin-left: 12px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      vertical-align: middle;
      padding: 0 10px;
      color: ${({ theme }) => theme.colors.primary};
      font-weight: 700;
    }
    &:hover {
      .exclude_nft_pop {
        visibility: visible;
        opacity: 1;
      }
    }
    .exclude_nft_pop {
      position: absolute;
      top: 38px;
      right: 20px;
      z-index: 20;
      background-color: ${({ theme }) => theme.colors.secondary};
      min-width: 200px;
      list-style: none;
      color: #9da6a6;
      border: 2px solid #1476ff;
      border-radius: 16px;
      line-height: 32px;
      font-size: 14px;
      padding: 10px 18px;
      font-weight: 600;
      opacity: 0;
      visibility: hidden;
      overflow: hidden;
      transition: opacity 0.1s ease;
      ${({ theme }) => theme.mediaQueries.md} {
        min-width: 300px;
      }
    }
  }
  .searchWrap {
    margin-bottom: 22px;
    width: 100%;
    position: relative;
    ${({ theme }) => theme.mediaQueries.md} {
      width: 42%;
    }
    .nameList {
      position: absolute;
      z-index: 19;
      background-color: rgba(18, 33, 36, 0.9);
      width: 100%;
      list-style: none;
      color: #9da6a6;
      border: 2px solid #1476ff;
      border-radius: 16px;
      line-height: 32px;
      font-size: 14px;
      padding: 10px 18px;
      margin-top: 12px;
      max-height: 380px;
      overflow-y: scroll;
      font-weight: 600;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.1s ease;
      &.visible {
        visibility: visible;
        opacity: 1;
      }
      &::-webkit-scrollbar {
        display: none;
      }
      li {
        transition: all 0.3s ease;
        cursor: pointer;
        &:hover,
        &.on {
          color: ${({ theme }) => theme.colors.primary};
        }
      }
    }
  }

  > .pools {
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    margin-top: 40px;
    @media screen and (min-width: 1040px) {
      grid-template-columns: 1fr 1fr 1fr;
    }

    @media screen and (min-width: 1263px) {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }
  }
`;

async function fetchMore(
  __nfts: NftLockInfo[],
  nftData: NftItemConfig[],
  start: number,
  nftAddress: string,
  account: string,
  searchId: string,
  searchName: string,
) {
  const nfts = [];
  if (account) {
    for (let i = 0; i < __nfts.length; i++) {
      if (__nfts[i].unlocker === account) {
        nfts.unshift(__nfts[i]);
      } else {
        nfts.push(__nfts[i]);
      }
    }
  }
  let ids = nftData;
  if (searchId) {
    ids = nftData.filter((v) => `${v.name}#${v.id}`.toLowerCase().indexOf(`${searchId}`.toLowerCase()) > -1);
  } else if (searchName) {
    ids = nftData.filter((v) => `${v.name}`.indexOf(searchName) > -1);
  } else {
    ids = nftData;
  }
  let _nfts = [];
  if (ids.length !== 0) {
    nfts.map((vv) => {
      const _nftsd = ids.filter((v) => v && +vv.id === +v.id);
      if (_nftsd && _nftsd.length > 0) {
        _nfts.push({ ...vv, ..._nftsd[0] });
      }
      return vv;
    });
  } else {
    if (!searchId && !searchName) {
      _nfts = nfts;
    }
  }
  const results = await Promise.all(
    _nfts.slice(start, start + pageSize).map((nft) => fetchNftInfo(nftAddress, Number(nft.id), account, nft)),
  );
  return results
    .map((nft, index) => {
      if (!nft) {
        return undefined;
      }
      const n: NftInfoWithLock = { ..._nfts[start + index], ...nft };
      return n;
    })
    .filter(Boolean);
}
