import { ChainId } from '@my/sdk';
import { chainId } from 'config/constants/tokens';

// export const idoStartTime = '2023-01-18 23:59:59';
// export const idoEndDate = '2023-01-18 23:59:59';
const _idoContractAddress: { [chainId: number]: string } = {
  [ChainId.SDN_MAINNET]: '0x47f11B0d62ef83510e8FCD6BFb21847355992C49',
};
export const idoContractAddress = _idoContractAddress[chainId];
export const AVATdonation = 100;
