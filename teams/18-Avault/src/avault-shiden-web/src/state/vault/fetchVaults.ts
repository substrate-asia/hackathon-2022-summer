import fetchVault from './fetchVault';
import { IVault, IVaultConfigItem } from './types';
import BigNumber from 'bignumber.js';
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber';
import { isNaNString } from 'views/Vault/utils';

const fetchVaults = async (
  account: string,
  vaults: IVaultConfigItem[],
  priceVsBusdMap: Record<string, string>,
  vaultsData: IVault[],
): Promise<[IVault[], string]> => {
  const data = await Promise.all(
    vaults.map(async (vaultConfig, index) => {
      const vault = await fetchVault(account, vaultConfig, priceVsBusdMap, vaultsData[index]);
      return vault;
    }),
  );
  let _total = BIG_ZERO;
  const _data = [];
  for (let i = 0; i < data.length; i++) {
    const v = data[i];
    if (v.farm.lpTokenPrice) {
      const _liquidity = new BigNumber(v.vault.wantLockedTotal)
        .div(BIG_TEN.pow(new BigNumber(v.vault.decimals)))
        .times(Number(v.farm.lpTokenPrice))
        .toNumber();
      _total = _total.plus(_liquidity);
      _data.push({
        ...v,
        vault: {
          ...v.vault,
          liquidity: _liquidity.toLocaleString('en-US', {
            maximumFractionDigits: 2,
          }),
        },
      });
    } else {
      _data.push(v);
    }
  }
  const total = isNaNString(_total.toString());
  return [_data, total];
};
export default fetchVaults;
