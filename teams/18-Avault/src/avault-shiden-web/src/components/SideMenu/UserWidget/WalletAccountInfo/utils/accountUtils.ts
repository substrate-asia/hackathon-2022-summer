import { u8aToHex, u8aWrapBytes } from '@polkadot/util';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { Account } from './types';

export const setupExtension = async () => {
  const extensions = await web3Enable('polkadot-js/apps');
  if (extensions.length === 0) {
    return {
      kind: 'ng' as const,
      message: 'Please install Polkadot{.js} extension and try again.',
    };
  }
  const injectedAccounts = await web3Accounts({ ss58Format: 5 });
  if (injectedAccounts.length === 0) {
    return {
      kind: 'ng' as const,
      message: 'Please add at least one account on the Polkadot{.js} extension and try again.',
    };
  }
  return {
    kind: 'ok' as const,
    injectedAccounts,
  };
};
export const setupAccounts = async (account: Account | null) => {
  const ext = await setupExtension();
  if (ext.kind === 'ng') {
    return ext;
  }
  const injectedAccounts = ext.injectedAccounts;
  if (account && injectedAccounts.map((a) => a.address).includes(account.player.address)) {
  } else {
    console.log(injectedAccounts);
  }
  return {
    kind: 'ok' as const,
    injectedAccounts,
  };
};
export const polkadotSignMessage = async (evmAddress: string, polkadotAddress: string): Promise<string> => {
  const wrapped = u8aWrapBytes(evmAddress.toLowerCase());
  const injected: any = await web3Enable('clv');

  const currentInjected = injected[0];
  const ret = await currentInjected.signer.signRaw({
    data: u8aToHex(wrapped),
    address: polkadotAddress,
    type: 'bytes',
  });
  return ret.signature;
};
