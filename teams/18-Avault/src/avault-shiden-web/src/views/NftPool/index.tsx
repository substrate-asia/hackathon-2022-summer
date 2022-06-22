import React, { FC, useContext } from 'react';
import { useParams } from 'react-router';
import Page from 'components/Layout/Page';
import ShopCart from './components/ShopCart';
import { PoolHeader } from './components/Header';
import { NftProvider, NftContext } from './providers/nft.provider';
import { NFT_PAIRS } from 'config/constants/nft';
import { GoodsInPool } from './components/GoodsInPool';
import { useNftPair } from 'views/NftPools/hooks/useNftPools';
import { NftPair } from 'views/NftPools/hooks/useNftPools';
import { usePrice } from 'state/price/hooks';
import { useFarms, usePollFarmsData } from 'state/farms/hooks';

const NFTPool: FC<{ className?: string }> = ({ className }) => {
  const { data: farmsLP } = useFarms();
  usePollFarmsData();
  const { items } = useContext(NftContext);
  const { pairAddress } = useParams<{ pairAddress: string }>();
  const _index = NFT_PAIRS.findIndex((pair) => pair.address.toLocaleLowerCase() === pairAddress.toLocaleLowerCase());
  const index = _index < 0 ? 0 : _index;
  const pair = NFT_PAIRS[index];
  const pairDetail: NftPair = useNftPair(index, farmsLP);
  const { priceVsBusdMap } = usePrice();

  return (
    <div style={{ background: 'rgba(0,0,0,0)' }}>
      <Page className={className}>
        <PoolHeader
          pairIndex={index}
          pair={pairDetail}
          floorPrice={Number(priceVsBusdMap[pairAddress.toLowerCase()] || 0)}
        />
        <GoodsInPool pair={pair} pairDetail={pairDetail} />
      </Page>
      {!!items.length && <ShopCart floorPrice={100} symbol={pair.symbol} pairAddres={pair.address} />}
    </div>
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default () => (
  <NftProvider>
    <NFTPool />
  </NftProvider>
);
