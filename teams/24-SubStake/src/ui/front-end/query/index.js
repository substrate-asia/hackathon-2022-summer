import { ethers } from 'ethers';
import { useQuery } from 'react-query';
import { useAsyncStorage } from '../components/Context/AsyncStorage';
import { useMoonbeam } from '../components/Context/MoonbeamContext';
import { useWestend } from '../components/Context/WestendContext';

export function getTransferrableBalance(free, lock) {
  if (lock === '0,000,000,000,000') {
    return free;
  }
  const freeBalance = parseFloat(free.replace(/,/g, ''));
  const lockBalance = parseFloat(lock.replace(/,/g, ''));
  return (freeBalance - lockBalance).toString();
}

export const balanceQuery = async (api, provider, accounts, currentIndex) => {
  if (accounts.length === 0) return { moonbeamBalance: 0, westendBalance: 0 };

  const publicKey = { sr25519: accounts[currentIndex].sr25519, bip39: accounts[currentIndex].bip39 };

  const account = await api.query.system.account(publicKey.sr25519);
  const locks = await api.query.balances.locks(publicKey.sr25519);
  const info = locks.toHuman()[0];

  const lockAmount = info === undefined ? '0,000,000,000,000' : info.amount;
  const lockID = info === undefined ? 'None' : info.id;

  const freeBalance = account.data.free.toHuman();
  const reservedBalance = account.data.reserved.toHuman();
  const feeFrozenBalance = account.data.feeFrozen.toHuman();
  const transferrableBalance = getTransferrableBalance(freeBalance, lockAmount);

  // const moonbeamRawBalance = await provider.getBalance(publicKey.bip39);
  // const moonbeamBalance = ethers.utils.formatEther(moonbeamRawBalance);

  return {
    moonbeamBalance: 0,
    westendBalance: { freeBalance, reservedBalance, feeFrozenBalance, transferrableBalance, lockAmount },
  };
};

export const useUserBalance = () => {
  const { accounts, currentIndex } = useAsyncStorage();
  const { provider } = useMoonbeam();
  const { api } = useWestend();

  return useQuery(['userBalance', currentIndex], () => balanceQuery(api, provider, accounts, currentIndex), {
    enabled: !!api && !!provider && !!accounts,
  });
};
