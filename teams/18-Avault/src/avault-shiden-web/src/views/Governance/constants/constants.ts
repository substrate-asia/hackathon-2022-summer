// https://github.com/AVaultFinance/avault-contractsV2/tree/main/contracts/governance

import { ChainId, Token } from '@my/sdk';
import { chainId } from 'config/constants/tokens';
import { IGrassHouse } from '../state/governance/types';

export const WEEKTimeStamp = 604800; // 24 * 60 * 60 * 7s
const _veAVAT: { [chainId: number]: Token } = {
  [ChainId.SDN_MAINNET]: new Token(
    ChainId.SDN_MAINNET as any,
    '0x1222d4e455c058A3e30dC5e81E0E2d90ac43c775',
    18,
    'veAVAT',
    'vote escrow AVAT',
  ),
};
// const CI3 = await ethers.getContractAt("GrassHouse", grassHouse, officialUser);
// const r3 = await CI3.callStatic.claim(officialAccount);
// GrassHouse.rewardToken().name()
const grassHouse01: IGrassHouse = {
  address: '0x94739452bcC6f99e7109387631d016aafa764138',
  token: null,
};
export const veAVAT = _veAVAT[chainId];
export const grassHouseListConfig: IGrassHouse[] = [grassHouse01];
