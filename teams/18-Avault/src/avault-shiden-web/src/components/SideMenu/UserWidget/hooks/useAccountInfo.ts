import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import headerDefault from '../../imgs/header_default.jpg';
import { sortName } from 'utils';

export const useAccountInfo = (): [string, string] => {
  const { account } = useWeb3React();
  // const karsierContract = useKarsierContract();
  const karsierContract = null;
  // const [karsierNfts, setKarsierNfts] = useState([]);
  const [karsierNft, setKarsierNft] = useState('');
  const [accountSort, setAccountSort] = useState<string | undefined>();
  useEffect(() => {
    (async () => {
      if (account && !accountSort) {
        setAccountSort(sortName(account));
      }
      if (account && karsierContract && karsierContract.walletOfOwner && !karsierNft) {
        const _arr = await karsierContract.walletOfOwner(account);
        if (_arr.length) {
          const _kArr = _arr.map((v: BigNumber) => v.toNumber());
          // setKarsierNfts(_kArr);
          const uri = await karsierContract.tokenURI(_kArr[0]);
          const res = await fetch(uri);
          const info = await res.json();

          setKarsierNft(info.image || '');
        }
      }
    })();
  }, [account, karsierContract, accountSort, karsierNft]);

  return [accountSort, karsierNft ? karsierNft : headerDefault];
};
