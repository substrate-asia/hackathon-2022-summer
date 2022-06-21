import BN from 'bn.js';
import type { Signer } from '@polkadot/api/types';
import type { SignerOptions } from '@polkadot/api/submittable/types';
import type { IKeyringPair } from '@polkadot/types/types';
import type { RegistryTypes } from '@polkadot/types/types/registry';
import envs from './envs.json';
import * as definitions from './interfaces/definitions';
type EnvNames = keyof typeof envs;
export const getEnv = (envName: any) => {
  if (!envName) {
    throw new Error(`no envName: ${envName}`);
  }
  const env = envs[envName as EnvNames];
  if (!env) {
    throw new Error(`undefined env: ${envName}`);
  }
  return env;
};

export const buildTypes = () => {
  const types: RegistryTypes = {
    AccountInfo: 'AccountInfoWithDualRefCount',
  };
  for (const [n, t] of Object.values(definitions).flatMap((d) => Object.entries(d.types))) {
    types[n] = t;
  }
  return types;
};

export type KeyringPairOrAddressAndSigner = IKeyringPair | { addrss: string; signer: Signer };

export const extractTxArgs = (account: KeyringPairOrAddressAndSigner, powSolution?: BN) => {
  let pairOrAddress: IKeyringPair | string;
  const options: Partial<SignerOptions> = {};
  if ('signer' in account) {
    pairOrAddress = account.addrss;
    options.signer = account.signer;
  } else {
    pairOrAddress = account;
  }
  if (powSolution) {
    options.tip = new BN(1).shln(127).add(powSolution);
  }
  return [pairOrAddress, options] as const;
};

export const withToggleAsync = async <T>(toggle: (b: boolean) => void, main: () => Promise<T>) => {
  toggle(true);
  const result = await main();
  toggle(false);
  return result;
};
