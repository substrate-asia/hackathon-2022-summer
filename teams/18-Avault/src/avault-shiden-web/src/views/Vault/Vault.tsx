import React, { useCallback, useState, useMemo, useRef } from 'react';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { RowType } from '@my/ui';
import Page from 'components/Layout/Page';
import { usePriceCakeBusd } from 'state/farms/hooks';
import { getBalanceNumber } from 'utils/formatBalance';
import { orderBy } from 'lodash';
import VaultTable from './components/VaultTable/VaultTable';

import { DesktopColumnSchema } from './components/types';
import { OptionProps } from 'components/Select/Select';
import { ISortDir } from 'components/SortIcon';
import { RowProps } from './components/VaultTable/Row';
import { useVault, useVaultUserData, usePollVaultData } from 'state/vault/hooks';
import { IVault } from 'state/vault/types';
import { usePrice } from 'state/price/hooks';
import PageLoader from 'components/Loader/PageLoader';
import { chainId } from 'config/constants/tokens';
import VaultBanner from './components/VaultBanner/VaultBanner';
// const StyledImage = styled(Image)`
//   margin-left: auto;
//   margin-right: auto;
//   margin-top: 58px;
// `;

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

const Vaults: React.FC = () => {
  const { data: vaultsLP, userDataLoaded } = useVault();
  const cakePrice = usePriceCakeBusd();
  const { account } = useWeb3React();
  const [sortKey, setSortKey] = useState('hot');
  const [sortDir, setSortDir] = useState(ISortDir.default);
  const chosenFarmsLength = useRef(0);

  const { priceVsBusdMap } = usePrice();
  const { data: vaults } = useVault();
  const userDataReady = !account || (!!account && userDataLoaded);
  usePollVaultData();
  useVaultUserData(vaults);
  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const vaultsList = useCallback(
    (vaultsToDisplay: IVault[]): IVault[] => {
      const vaultsToDisplayWithAPR: IVault[] = vaultsToDisplay.map((vault) => {
        const { farm } = vault;
        // if (!farm.lpTotalInQuoteToken) {
        //   return vault;
        // }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(
          priceVsBusdMap[farm.quoteToken.toLocaleLowerCase()],
        );

        // const currentSeconds = Math.floor(Date.now() / 1000);
        // // 86400s/day
        // const data = Math.ceil((currentSeconds - vault.online_at) / 86400) - 1;
        // // vault.online_at
        // const kacRewardsApr = (Number(vault.vault.lpToCLpRate) - 1) / data + 1;
        // const kacRewardApy = new BigNumber(kacRewardsApr).pow(365).times(100).minus(100).toFixed(2);

        return {
          ...vault,
          vault: {
            ...vault.vault,
          },
          farm: {
            ...vault.farm,
            // apr: `${kacRewardsApr}`,
            lpRewardsApr: `0`,
            liquidity: totalLiquidity.toString(),
            // apy: `${kacRewardApy}`,
          },
        };
      });

      return vaultsToDisplayWithAPR;
    },
    [priceVsBusdMap],
  );

  const chosenFarmsMemoized = useMemo(() => {
    let chosenFarms = [];

    const sortFarms = (vaults: IVault[]): IVault[] => {
      const side = sortDir === ISortDir.default || sortDir === ISortDir.down ? 'desc' : 'asc';
      switch (sortKey) {
        case 'apy':
          return orderBy(vaults, (vault: IVault) => Number(vault?.farm?.apy ?? '0'), side);
        case 'apr':
          return orderBy(vaults, (vault: IVault) => Number(vault.farm.apy), side);
        case 'multiplier':
          return orderBy(
            vaults,
            (vault: IVault) => (vault.farm.multiplier ? Number(vault.farm.multiplier.slice(0, -1)) : 0),
            side,
          );
        case 'earned':
          return orderBy(
            vaults,
            (vault: IVault) => (vault.farm.userData ? Number(vault.farm?.userData?.pendingReward ?? '0') : 0),
            side,
          );
        case 'liquidity':
          return orderBy(vaults, (vault: IVault) => Number(vault.vault.liquidity), side);
        default:
          return vaults;
      }
    };

    chosenFarms = vaultsList(vaultsLP);
    return sortFarms(chosenFarms);
  }, [sortKey, vaultsLP, vaultsList, sortDir]);
  chosenFarmsLength.current = chosenFarmsMemoized.length;

  const rowData = chosenFarmsMemoized.map((vault: IVault) => {
    const {
      vault: { token0Address, token1Address },
      farm: { userData = {} },
    } = vault;
    const _userDataKey = `${account}-${chainId}`;
    const _userData = userData[_userDataKey] ?? {
      account: '',
      allowance: '0',
      stakingTokenBalance: '0',
      stakedBalance: '0',
      pendingReward: '0',
      avaultAddressBalance: '0',
      userVaultSupply: '0',
    };
    //WAIT
    const row: RowProps = {
      apr: {
        apy: getDisplayApy(Number(vault.farm.apy)),
        apr: getDisplayApy(Number(vault.farm.apy)),
        multiplier: vault.farm.multiplier,
        vaultSymbol: vault.vault.symbol,
        lpLabel: vault.lpDetail.symbol,
        token0Address,
        token1Address,
        cakePrice,
        originalValue: Number(vault.farm.apy),
        fromSource: vault.fromSource,
      },
      vault: {
        label: vault.lpDetail.symbol,
        token0Address: token0Address,
        token1Address: token1Address,
      },
      earned: {
        earnings: getBalanceNumber(new BigNumber(_userData.pendingReward)),
        pid: vault.farm.pid,
      },
      liquidity: {
        liquidity: vault.vault.liquidity,
      },
      net: {
        net: '333',
      },
      multiplier: {
        multiplier: vault.farm.multiplier,
      },
      details: vault,
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
          case 'vault':
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
      <VaultTable
        onOptionChange={handleSortKeyChange}
        data={rowData}
        sortKey={sortKey}
        sortDir={sortDir}
        columns={columns}
        userDataReady={userDataReady}
        userDataLoaded={userDataLoaded}
      />
    );
  };

  return (
    <Page>
      <VaultBanner />
      {renderContent()}
      {/* <PageLoader /> */}
      {!rowData.length ? <PageLoader /> : null}
    </Page>
  );
};

export default Vaults;
