import React, { FC, useMemo, useState } from 'react';
import styled from 'styled-components';
import Page from 'components/Layout/Page';
import { useMatchBreakpoints, Text, Flex } from '@my/ui';
import Row from './components/Row';
import AnimalSvg from './svg/animal.png';
import MarketSvg from './svg/market.svg';
import { useNftPairs } from './hooks/useNftPools';
import Search from 'components/Search';
import PageLoader from 'components/Loader/PageLoader';
import { useFarms, usePollFarmsData } from 'state/farms/hooks';

const Header = styled(Flex)`
  justify-content: space-between;
  align-items: flex-end;

  > .left {
    margin-bottom: 20px;
    > .banner {
      text-align: center;
      margin-top: 30px;
      > img {
        width: 80%;
        height: 90px;
      }
      ${({ theme }) => theme.mediaQueries.md} {
        > img {
          width: 100%;
        }
      }
    }

    > .text {
      text-align: center;
    }
    ${({ theme }) => theme.mediaQueries.md} {
      > .text {
        text-align: left;
      }
    }
  }
  > .right {
    display: none;
    ${({ theme }) => theme.mediaQueries.md} {
      display: block;
    }
  }
`;

const PoolList = styled.div`
  border-radius: 16px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  z-index: 2;
  position: relative;
  > table {
    width: 100%;
  }
  > div {
    > .line {
      background-color: ${({ theme }) => theme.colors.cardBackground};
      height: 88px;
    }
    > .more {
    }
  }
`;

const NftPools: FC = () => {
  const { isXs, isSm } = useMatchBreakpoints();
  const [filter, setFilter] = useState<string>('');
  const simpleMode = useMemo(() => isXs || isSm, [isXs, isSm]);
  const { data: farmsLP } = useFarms();
  usePollFarmsData();
  const pairs = useNftPairs(farmsLP);

  return (
    <Page>
      <Header>
        <div className="left">
          <div className="banner">
            <img src={MarketSvg} alt="" />
          </div>
          <Text className="text" color="primary" bold fontSize="20px" mt="23px" mb="40px">
            Trade, Swap, Fractionalized Your NFTS
          </Text>
          <Search placeholder="Search NFT" value={filter} onChange={setFilter} />
        </div>
        <div
          className="right"
          style={{ background: `url(${AnimalSvg})`, height: '221px', width: '247px', marginRight: '89px' }}
        ></div>
      </Header>
      {!pairs.length ? (
        <PageLoader />
      ) : (
        <PoolList>
          <table>
            <tbody>
              {pairs
                .filter((pair) => pair.name.toLowerCase().includes(filter.toLowerCase()))
                .map((pair) => (
                  <Row key={pair.pairAddress} pair={pair} simpleMode={simpleMode} />
                ))}
            </tbody>
          </table>
        </PoolList>
      )}
    </Page>
  );
};

export default NftPools;
