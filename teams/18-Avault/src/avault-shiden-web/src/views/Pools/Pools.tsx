import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { Flex } from '@my/ui';
import orderBy from 'lodash/orderBy';
import partition from 'lodash/partition';
import usePersistState from 'hooks/usePersistState';
import { usePools, useFetchCakeVault, useCakeVault, useFetchPublicPoolsData } from 'state/pools/hooks';
import { usePollFarmsData } from 'state/farms/hooks';
import { latinise } from 'utils/latinise';
import FlexLayout from 'components/Layout/Flex';
import Page from 'components/Layout/Page';
import PoolHeader from './components/PoolHeader/PoolHeader';
import { Pool } from 'state/types';
import Loading from 'components/Loading';
import PoolCard from './components/PoolCard/PoolCard';
import CakeVaultCard from './components/CakeVaultCard';
import PoolsTable from './components/PoolsTable/PoolsTable';
import { ViewMode } from './components/ToggleView/ToggleView';
import { getAprData, getCakeVaultEarnings } from './helpers';

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`;

const NUMBER_OF_FARMS_VISIBLE = 12;
const Pools: React.FC = () => {
  const location = useLocation();
  const { account } = useWeb3React();
  const { pools: poolsWithoutAutoVault, userDataLoaded: userDataReady } = usePools(account);
  const [stakedOnly, setStakedOnly] = usePersistState(false, { localStorageKey: 'kaco_pool_staked' });
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_FARMS_VISIBLE);
  const [observerIsSet, setObserverIsSet] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [viewMode] = usePersistState(ViewMode.TABLE, { localStorageKey: 'kaco_pool_view' });
  const [filter, setFilter] = useState('');
  const [sortOption] = useState('hot');
  const chosenPoolsLength = useRef(0);
  const {
    userData: { cakeAtLastUserAction, userShares },
    fees: { performanceFee },
    pricePerFullShare,
    totalCakeInVault,
  } = useCakeVault();
  const accountHasVaultShares = userShares && userShares.gt(0);
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100;
  const pools = poolsWithoutAutoVault;
  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools]);
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        if (pool.isAutoVault) {
          return accountHasVaultShares;
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0);
      }),
    [finishedPools, accountHasVaultShares],
  );

  const stakedOnlyOpenPools = useMemo(
    () =>
      openPools.filter((pool) => {
        if (pool.isAutoVault) {
          return accountHasVaultShares;
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0);
      }),
    [openPools, accountHasVaultShares],
  );

  usePollFarmsData();
  useFetchCakeVault();
  useFetchPublicPoolsData();
  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setNumberOfPoolsVisible((poolsCurrentlyVisible) => {
          if (poolsCurrentlyVisible <= chosenPoolsLength.current) {
            return poolsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE;
          }
          return poolsCurrentlyVisible;
        });
      }
    };
    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      });
      loadMoreObserver.observe(loadMoreRef.current);
      setObserverIsSet(true);
    }
  }, [observerIsSet]);
  const showFinishedPools = location.pathname.includes('history');

  const sortPools = (poolsToSort: Pool[]) => {
    switch (sortOption) {
      case 'apr':
        return orderBy(
          poolsToSort,
          (pool: Pool) => (pool.apr ? getAprData(pool, performanceFeeAsDecimal).apr : 0),
          'desc',
        );
      case 'earned':
        return orderBy(
          poolsToSort,
          (pool: Pool) => {
            if (!pool.userData || !pool.earningTokenPrice) {
              return 0;
            }
            return pool.isAutoVault
              ? getCakeVaultEarnings(
                  account,
                  cakeAtLastUserAction,
                  userShares,
                  pricePerFullShare,
                  pool.earningTokenPrice,
                ).autoUsdToDisplay
              : pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber();
          },
          'desc',
        );
      case 'totalStaked':
        return orderBy(
          poolsToSort,
          (pool: Pool) => (pool.isAutoVault ? totalCakeInVault.toNumber() : pool.totalStaked.toNumber()),
          'desc',
        );
      default:
        return poolsToSort;
    }
  };
  let chosenPools;
  if (showFinishedPools) {
    chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools;
  } else {
    chosenPools = stakedOnly ? stakedOnlyOpenPools : openPools;
  }
  if (filter) {
    const lowercaseQuery = latinise(filter.toLowerCase());
    chosenPools = chosenPools.filter((pool) =>
      latinise(pool.earningToken.symbol.toLowerCase()).includes(lowercaseQuery),
    );
  }
  chosenPools.push(...(finishedPools || []));
  chosenPools = sortPools(chosenPools).slice(0, numberOfPoolsVisible);
  chosenPoolsLength.current = chosenPools.length;

  const renderContent = (): JSX.Element => {
    if (viewMode === ViewMode.TABLE && chosenPools.length) {
      return <PoolsTable pools={chosenPools} account={account} userDataReady={userDataReady} />;
    }
    return (
      <CardLayout>
        {chosenPools.map((pool) =>
          pool.isAutoVault ? (
            <CakeVaultCard key="auto-cake" pool={pool} showStakedOnly={stakedOnly} />
          ) : (
            <PoolCard key={pool.sousId} pool={pool} account={account} />
          ),
        )}
      </CardLayout>
    );
  };
  return (
    <>
      <div style={{ background: 'rgba(0,0,0,0)' }}>
        <Page>
          <PoolHeader
            stakedOnly={stakedOnly}
            filter={filter}
            onFilterChange={setFilter}
            onStakedOnlyChange={setStakedOnly}
            placeholder="Search Pool"
          />
          {renderContent()}
          {account && !userDataReady && stakedOnly && (
            <Flex justifyContent="center">
              <Loading />
            </Flex>
          )}
          <div ref={loadMoreRef} />
        </Page>
      </div>
    </>
  );
};
export default Pools;
