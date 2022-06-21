import useActiveWeb3React from 'hooks/useActiveWeb3React';
import addresses from 'config/constants/contracts';
import multicall from 'utils/multicall';

import { BIG_TEN } from './../../../utils/bigNumber';
import RealBigNumber from 'bignumber.js';

import masterchefABI from 'config/abi/masterchef.json';
import masterchefSdnABI from 'config/abi/masterchef_Shiden.json';

import { useEffect, useState } from 'react';
import { chainKey } from 'config';
import { CHAINKEY } from '@my/sdk';

const base = BIG_TEN.pow(new RealBigNumber(18));

const useKacPerBlock = (): RealBigNumber => {
  const { chainId } = useActiveWeb3React();
  const [kacPerBlock, setKacPerBlock] = useState<RealBigNumber>(new RealBigNumber(0.377358490566));

  useEffect(() => {
    const _masterchefABI = chainKey === CHAINKEY.SDN ? masterchefSdnABI : masterchefABI;
    multicall(_masterchefABI, [
      {
        address: addresses.masterChef[chainId],
        name: chainKey === CHAINKEY.SDN ? 'kacPerShidenBlock' : 'kacPerBlock',
      },
    ]).then(([kacPerBlock]) => setKacPerBlock(new RealBigNumber(kacPerBlock.toString()).div(base)));
  }, [chainId]);

  return kacPerBlock;
};
export default useKacPerBlock;
