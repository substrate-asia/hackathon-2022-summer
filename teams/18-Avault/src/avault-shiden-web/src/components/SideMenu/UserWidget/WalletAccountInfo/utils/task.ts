import { setupAccounts } from './accountUtils';
import { Account } from './types';
import { getSignAddress, postSignAddress } from './api';
export const withToggleAsync = async <T>(toggle: (b: boolean) => void, main: () => Promise<T>) => {
  toggle(true);
  const result = await main();
  toggle(false);
  return result;
};

export const setup = (setWaiting: (b: boolean) => void, account: Account | null) =>
  withToggleAsync(setWaiting, async () => {
    const [accounts] = await Promise.all([setupAccounts(account)]);

    return {
      ...accounts,
    };
  });

export const getSignStatus = (setWaiting: (b: boolean) => void, publickeys: string[]) =>
  withToggleAsync(setWaiting, async () => {
    const signStatus = await getSignAddress(publickeys);
    return signStatus;
  });

export const postSignStatus = (
  setWaiting: (b: boolean) => void,
  sigInfos: {
    polkadotKey: string;
    evmAddress: string;
    signature: string;
  }[],
) =>
  withToggleAsync(setWaiting, async () => {
    const signStatus = await postSignAddress(sigInfos);
    return signStatus;
  });
