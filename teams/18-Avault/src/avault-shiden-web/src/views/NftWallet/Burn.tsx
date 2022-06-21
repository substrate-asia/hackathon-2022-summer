import Page from './Page';
import { FC, useEffect, useState } from 'react';
import { Button, Grid, Text, Flex, useModal } from '@my/ui';
import styled from 'styled-components';
import BurnModal from './components/BurnModal';
import { NftPair, useNftPairs } from 'views/NftPools/hooks/useNftPools';
import { useWeb3React } from '@web3-react/core';
import multicall from 'utils/multicall';
import Erc20 from 'config/abi/erc20.json';
import { BigNumber } from '@ethersproject/bignumber';
import PageLoader from 'components/Loader/PageLoader';
import NoBalance from './components/NoBalance';
import RealBigNumber from 'bignumber.js';
import { formatFloat } from 'views/NftPool/util/format';
import { useFarms, usePollFarmsData } from 'state/farms/hooks';
import { NFT_PAIRS } from 'config/constants/nft';

const Burn: FC<{ className?: string }> = ({ className }) => {
  const { data: farmsLP } = useFarms();
  usePollFarmsData();
  const pairs = useNftPairs(farmsLP);
  const { account } = useWeb3React();
  const [balancesOfNft100, setBalancesOfNft100] = useState<(NftPair & { balance: number })[]>([]);
  const [nft100Index, setNft100Index] = useState(-1);
  const [onBurn] = useModal(
    <BurnModal pair={balancesOfNft100[nft100Index]} balance={balancesOfNft100[nft100Index]?.balance} />,
    true,
    true,
  );
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!account || !pairs.length) {
      return;
    }

    const calls = pairs
      .map((pair) => [
        {
          address: pair.pairAddress,
          name: 'balanceOf',
          params: [account],
        },
        {
          address: pair.pairAddress,
          name: 'decimals',
        },
      ])
      .reduce((calls, curr) => calls.concat(curr), []);

    setFetching(true);
    multicall(Erc20, calls)
      .then((results: any[]) => {
        const balancesOfNft100: (NftPair & { balance: number })[] = [];
        const step = 2;

        for (let i = 0; i < results.length - 1; i += step) {
          const balance: BigNumber = results[i][0];
          const decimals = results[i + 1][0];
          const balanceNumber = new RealBigNumber(balance.toString())
            .div(new RealBigNumber(10).pow(new RealBigNumber(decimals)))
            .toNumber();

          balancesOfNft100.push({ ...pairs[i / step], balance: balanceNumber });
        }

        setBalancesOfNft100(balancesOfNft100.filter((balance) => balance.balance));
      })
      .finally(() => setFetching(false));
  }, [account, pairs]);
  if (!account) {
    return (
      <Page style={{ minHeight: '0px' }}>
        <NoBalance />
      </Page>
    );
  }
  return (
    <Page style={{ minHeight: '0px' }}>
      {fetching ? (
        <PageLoader />
      ) : !balancesOfNft100.length ? (
        <NoBalance />
      ) : (
        <div className={className}>
          <Text bold color="text" mb="20px" fontSize="20px">
            NFT100
          </Text>
          <Grid gridGap={{ xs: '4px', md: '16px' }} className="nfts">
            {balancesOfNft100.map((balance, index) => (
              <Flex className="fragment" key={balance.pairAddress}>
                <img
                  className="logo"
                  src={NFT_PAIRS.find((p) => balance.pairAddress.toLowerCase() === p.address.toLowerCase())?.logo}
                  alt=""
                />
                <Flex flex="1" justifyContent="space-between" alignItems="center">
                  <div className="">
                    <Text color="primary" bold fontSize="20px">
                      {formatFloat(balance.balance)}
                    </Text>
                    <Text color="text" bold>
                      {balance.symbol}
                    </Text>
                  </div>
                  <Button
                    disabled={true}
                    height="36px"
                    variant="secondary"
                    onClick={() => {
                      setNft100Index(index);
                      setTimeout(() => {
                        onBurn();
                      }, 0);
                    }}
                  >
                    Burn
                  </Button>
                </Flex>
              </Flex>
            ))}
          </Grid>
        </div>
      )}
    </Page>
  );
};

export default styled(Burn)`
  width: 100%;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 24px;
  padding: 15px;
  margin-top: 10px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 30px 20px;
  }

  > .nfts {
    grid-template-columns: 1fr;
    justify-items: center;

    ${({ theme }) => theme.mediaQueries.md} {
      grid-template-columns: 1fr 1fr;
    }
    @media screen and (min-width: 1165px) {
      grid-template-columns: 1fr 1fr;
    }

    > .fragment {
      width: 100%;
      padding: 12px 15px;

      ${({ theme }) => theme.mediaQueries.md} {
        width: 450px;
        padding: 18px 30px;
      }
      height: 88px;
      background: ${({ theme }) => theme.colors.cardBackground};
      border-radius: 16px;
      align-items: center;

      > .logo {
        width: 52px;
        height: 52px;
        margin-right: 20px;
      }
    }
  }
`;
