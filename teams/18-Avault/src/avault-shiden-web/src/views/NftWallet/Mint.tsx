import Page from './Page';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Grid, Text } from '@my/ui';
import Nft from './components/Nft';
import { fetchAllTokens, filterNft } from 'views/NftPool/util/fetchNft';
import { NFT } from 'views/NftPool/components/GoodsInPool';
import { useWeb3React } from '@web3-react/core';
import { NftPair, useNftPairs } from 'views/NftPools/hooks/useNftPools';
import PageLoader from 'components/Loader/PageLoader';
import { useFarms, usePollFarmsData } from 'state/farms/hooks';
import NoBalance from './components/NoBalance';

const NftsGroupByPool_: FC<{
  className?: string;
  title: string;
  pair: NftPair;
  nfts: NFT[];
}> = ({ className, title, nfts, pair }) => {
  return (
    <div className={className}>
      <Text bold color="text" mb="20px" fontSize="20px">
        {title}
      </Text>
      <Grid gridGap={{ xs: '4px', md: '10px' }} className="nfts">
        {nfts.map((nft, index) => (
          <Nft nft={nft} key={index} pair={pair} />
        ))}
      </Grid>
    </div>
  );
};

const NftsGroupByPool = styled(NftsGroupByPool_)`
  width: 100%;
  border-radius: 24px;
  margin-top: 10px;

  ${({ theme }) => theme.mediaQueries.md} {
    background: ${({ theme }) => theme.colors.cardBackground};
    padding: 30px 40px;
  }

  > .nfts {
    grid-template-columns: 1fr 1fr;
    justify-content: space-between;

    @media screen and (min-width: 1040px) {
      justify-items: center;
      grid-template-columns: 1fr 1fr 1fr;
    }

    @media screen and (min-width: 1263px) {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }
  }
`;
export const USER_NFTS = 'USER_NFTS';

const Mint: FC<{ className?: string }> = ({ className }) => {
  let _pairs: ({ nfts: NFT[] } & NftPair)[] = [];

  try {
    _pairs = JSON.parse(localStorage.getItem(USER_NFTS));
  } catch {
    localStorage.removeItem(USER_NFTS);
  }
  const [pools, setPools] = useState<({ nfts: NFT[] } & NftPair)[]>(_pairs);
  const { account } = useWeb3React();
  const { data: farmsLP } = useFarms();
  usePollFarmsData();
  const pairs = useNftPairs(farmsLP);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!account || !pairs || !pairs.length) {
      return;
    }

    setFetching(true);
    fetchAllTokens(account)
      .then(async (items) => {
        const poolsPromises = pairs
          .map(async (pair) => ({ ...pair, nfts: await filterNft(items, pair.nftAddress) }))
          .filter(async (pair) => (await pair).nfts.length);
        const results = await Promise.all(poolsPromises);
        setPools(results);
        localStorage.setItem(USER_NFTS, JSON.stringify(results));
      }, console.error)
      .finally(() => setFetching(false));
  }, [account, pairs]);
  if (!account) {
    return (
      <Page className={className}>
        <NoBalance />
      </Page>
    );
  }
  return (
    <Page className={className}>
      {!pools && fetching ? (
        <PageLoader />
      ) : !pools || !pools.length ? (
        <NoBalance />
      ) : (
        pools.map((pair, index) => (
          <NftsGroupByPool title={pair.name} nfts={pair.nfts} key={index} pair={pools[index]} />
        ))
      )}
    </Page>
  );
};

export default styled(Mint)`
  width: 100%;
  min-height: 0px;
`;
