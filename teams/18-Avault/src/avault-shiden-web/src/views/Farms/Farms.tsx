import React, { useCallback, useState, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { RowType } from '@my/ui';
import Page from 'components/Layout/Page';
import { useFarms, usePollFarmsData, usePriceCakeBusd } from 'state/farms/hooks';
import { Farm } from 'state/types';
import { getBalanceNumber } from 'utils/formatBalance';
import { getFarmApr } from 'utils/apr';
import { orderBy } from 'lodash';
import isArchivedPid from 'utils/farmHelpers';
import { latinise } from 'utils/latinise';
import FarmTable, { FarmWithStakedValue } from './components/FarmTable/FarmTable';
import { RowProps } from './components/FarmTable/Row';
import { DesktopColumnSchema } from './components/types';
import { KACO_LP_PID } from 'config/constants/farms';
import useKacPerBlock from './hooks/useAvaultPerBlock';
import { chainId } from 'config/constants/tokens';
import { OptionProps } from 'components/Select/Select';
import { ISortDir } from 'components/SortIcon';
import FarmBanner from './components/FarmBanner/FarmBanner';

export const getDisplayApr = (cakeRewardsApr?: number, lpRewardsApr?: number): string => {
  if (cakeRewardsApr && lpRewardsApr) {
    return (cakeRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  if (cakeRewardsApr) {
    return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  if (cakeRewardsApr === 0 && lpRewardsApr === 0) {
    return '0';
  }
  return null;
};

export const getDisplayApy = (cakeRewardsApy?: number): string => {
  if (cakeRewardsApy) {
    return cakeRewardsApy.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  if (cakeRewardsApy) {
    return cakeRewardsApy.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  if (cakeRewardsApy === 0) {
    return '0';
  }
  return null;
};

const Farms: React.FC = () => {
  const { pathname } = useLocation();
  const { data: farmsLP, userDataLoaded } = useFarms();
  const cakePrice = usePriceCakeBusd();
  const [query] = useState('');
  const { account } = useWeb3React();
  const [sortKey, setSortKey] = useState('hot');
  const [sortDir, setSortDir] = useState(ISortDir.default);
  const chosenFarmsLength = useRef(0);
  const kacPerBlock = useKacPerBlock();
  const isArchived = pathname.includes('archived');
  const isInactive = pathname.includes('history');
  const isActive = !isInactive && !isArchived;

  usePollFarmsData(isArchived);

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded);

  // const activeFarms = farmsLP.filter(
  //   (farm) => farm.pid !== KACO_LP_PID && farm.multiplier !== '0X' && !isArchivedPid(farm.pid),
  // );

  const filtedFarmsLP = farmsLP;
  const activeFarms = filtedFarmsLP;
  const inactiveFarms = useMemo(
    () =>
      filtedFarmsLP.filter((farm) => farm.pid !== KACO_LP_PID && farm.multiplier === '0X' && !isArchivedPid(farm.pid)),
    [filtedFarmsLP],
  );
  const archivedFarms = useMemo(() => filtedFarmsLP.filter((farm) => isArchivedPid(farm.pid)), [filtedFarmsLP]);

  const farmsList = useCallback(
    (farmsToDisplay: Farm[]): FarmWithStakedValue[] => {
      let farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteToken.busdPrice) {
          return farm;
        }

        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteToken.busdPrice);
        // console.log(farm.lpTotalInQuoteToken, farm.quoteToken.busdPrice);
        // const { kacRewardsApr, lpRewardsApr, kacRewardApy } = isActive
        const { lpRewardsApr, kacRewardApy } = isActive
          ? getFarmApr(
              kacPerBlock,
              new BigNumber(farm.poolWeight),
              cakePrice,
              totalLiquidity,
              farm.lpAddresses[chainId],
            )
          : { lpRewardsApr: 0, kacRewardApy: 0 };
        // console.log(
        //   `${farm.token.symbol}-${farm.quoteToken.symbol}`,
        //   'kacPerBlock',
        //   kacPerBlock.toFixed(5),
        //   'cakePrice',
        //   cakePrice.toFixed(5),
        //   'totalLiquidity',
        //   totalLiquidity.toFixed(5),
        //   'apr',
        //   cakeRewardsApr,
        //   'lpRewardsApr',
        //   lpRewardsApr,
        // );
        // console.log({ kacRewardsApr });
        return { ...farm, apr: 0, lpRewardsApr, apy: kacRewardApy };
      });

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase());
        farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter((farm: FarmWithStakedValue) => {
          return latinise(farm.lpSymbol.toLowerCase()).includes(lowercaseQuery);
        });
      }
      return farmsToDisplayWithAPR;
    },
    [cakePrice, query, isActive, kacPerBlock],
  );

  // const loadMoreRef = useRef<HTMLDivElement>(null);

  // const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE);
  // const [observerIsSet, setObserverIsSet] = useState(false);

  const chosenFarmsMemoized = useMemo(() => {
    let chosenFarms = [];

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      const side = sortDir === ISortDir.default || sortDir === ISortDir.down ? 'desc' : 'asc';
      switch (sortKey) {
        case 'apr':
          return orderBy(farms, (farm: FarmWithStakedValue) => farm.apr + farm.lpRewardsApr, side);
        case 'multiplier':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
            side,
          );
        case 'earned':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
            side,
          );
        case 'liquidity':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), side);
        default:
          return farms;
      }
    };
    if (isActive) {
      chosenFarms = farmsList(activeFarms);
    } else if (isInactive) {
      chosenFarms = farmsList(inactiveFarms);
    } else if (isArchived) {
      chosenFarms = farmsList(archivedFarms);
    }

    return sortFarms(chosenFarms);
  }, [sortDir, sortKey, activeFarms, farmsList, inactiveFarms, archivedFarms, isActive, isInactive, isArchived]);

  chosenFarmsLength.current = chosenFarmsMemoized.length;
  const rowData = chosenFarmsMemoized.map((farm) => {
    const { token, quoteToken } = farm;
    const tokenAddress = token.address;
    const quoteTokenAddress = quoteToken.address;
    //WAIT
    const lpLabel = farm.lpSymbol;
    const row: RowProps = {
      apr: {
        apy: getDisplayApy(farm.apy),
        apr: getDisplayApr(farm.apr, farm.lpRewardsApr),
        multiplier: farm.multiplier,
        lpLabel,
        tokenAddress,
        quoteTokenAddress,
        cakePrice,
        originalValue: farm.apy,
      },
      farm: {
        label: lpLabel,
        pid: farm.pid,
        token: farm.token,
        quoteToken: farm.quoteToken,
      },
      earned: {
        earnings: getBalanceNumber(new BigNumber(farm.userData.earnings)),
        pid: farm.pid,
      },
      liquidity: {
        liquidity: farm.liquidity,
        userDataReady: userDataReady,
      },
      multiplier: {
        multiplier: farm.multiplier,
      },
      details: farm,
    };

    return row;
  });
  const handleSortKeyChange = (option: OptionProps): void => {
    if (option.side === ISortDir.default) {
      setSortKey('hot');
    } else {
      setSortKey(option.value);
    }
    setSortDir(option.side);
  };
  const renderContent = (): JSX.Element => {
    const columnSchema = DesktopColumnSchema;
    const columns = columnSchema.map((column) => ({
      id: column.id,
      name: column.name,
      label: column.label,
      sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
        switch (column.name) {
          case 'farm':
            return b.id - a.id;
          case 'apr':
            if (a.original.apr.apr && b.original.apr.apr) {
              return Number(a.original.apr.apr) - Number(b.original.apr.apr);
            }
            return 0;
          case 'earned':
            return a.original.earned.earnings - b.original.earned.earnings;
          default:
            return 1;
        }
      },
      sortable: column.sortable,
    }));
    return (
      <FarmTable
        onOptionChange={handleSortKeyChange}
        data={rowData}
        sortKey={sortKey}
        sortDir={sortDir}
        columns={columns}
        userDataReady={userDataReady}
      />
    );
  };

  return (
    <Page>
      <FarmBanner />
      {renderContent()}
      {/* {account && !userDataLoaded && (
        <Flex justifyContent="center">
          <Loading />
        </Flex>
      )} */}
      {/* <div ref={loadMoreRef} /> */}
    </Page>
  );
};

export default Farms;
