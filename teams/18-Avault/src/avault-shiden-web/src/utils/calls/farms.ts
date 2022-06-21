import BigNumber from 'bignumber.js';
import { DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE, DEFAULT_TOKEN_DECIMAL } from 'config';

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
  gasPrice: DEFAULT_GAS_PRICE,
};

export const depositWithPermit = async (
  masterChefContract: any,
  pid: number,
  amount: string,
  deadline: number,
  v: number,
  r: string,
  s: string,
) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();
  const tx = await masterChefContract.depositWithPermit(pid, value, deadline, v, r, s, options);
  const receipt = await tx.wait();
  return receipt.status;
};
export const stakeFarm = async (masterChefContract: any, pid: number, amount: string) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();
  const tx = await masterChefContract.deposit(pid, value, options);
  const receipt = await tx.wait();
  return receipt.status;
};
export const unstakeFarm = async (masterChefContract, pid, amount) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();
  const tx = await masterChefContract.withdraw(pid, value, options);
  const receipt = await tx.wait();
  return receipt.status;
};

export const harvestFarm = async (masterChefContract: any, pid: number) => {
  const tx = await masterChefContract.deposit(pid, '0', options);
  const receipt = await tx.wait();
  return receipt.status;
};
