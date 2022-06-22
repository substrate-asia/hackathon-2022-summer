import { Farm } from 'state/types';
import { IVault } from 'state/vault/types';
import fetchPublicFarmData, { PublicFarmData } from './fetchPublicFarmData';

const fetchFarm = async (
  farm: Farm,
  priceVsBusdMap: Record<string, string>,
  vaultData: IVault[],
): Promise<Farm & PublicFarmData> => {
  const farmPublicData = await fetchPublicFarmData(farm, priceVsBusdMap, vaultData);

  return { ...farm, ...farmPublicData };
};

export default fetchFarm;
