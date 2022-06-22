import { FarmConfig } from 'config/constants/types';
import { Farm } from 'state/types';
import { IVault } from 'state/vault/types';
import fetchFarm from './fetchFarm';
import { PublicFarmData } from './fetchPublicFarmData';

const fetchFarms = async (
  farmsToFetch: FarmConfig[],
  priceVsBusdMap: Record<string, string>,
  vaultData: IVault[],
): Promise<(Farm & PublicFarmData)[]> => {
  const data = await Promise.all(
    farmsToFetch.map(async (farmConfig) => {
      const farm = await fetchFarm(farmConfig, priceVsBusdMap, vaultData);
      return farm;
    }),
  );
  return data;
};

export default fetchFarms;
