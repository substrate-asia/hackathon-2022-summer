export interface IGovernanceUserData {
  AVATBalance: string;
  veAVATBalance: string;
  veAVATBalanceDisplay: string;
  AVATLocked: string;
  AVATLockedDisplay: string;
  remainderBlock: number;
  withdrawalDate: string;
  withdrawalDateDisplay: string;
  isApproved: boolean;
}
// only for ui modal
// 0: init;
// 1: add amount
// 2 change lock time
export enum ILockAVATModalState {
  INIT,
  ADDAMOUNT,
  CHANGELOCKTIME,
  WITHDRAW,
}
interface ISmybolToken {
  address?: string;
  decimals?: number;
  symbol?: string;
  name?: string;
}
export interface IGrassHouse {
  address: string;
  token: null | ISmybolToken;
  rewards?: string;
  apr?: string;
}
export enum ILockedState {
  init,
  locked,
  withdraw,
}
export interface GovernanceState {
  // 0: init;
  // 1: add amount
  // 2 change lock time
  lockAVATModalState: ILockAVATModalState;
  // 0: init;
  // 1: add amount
  // 2 change lock time
  lockedState: ILockedState;
  apy: string;
  tvlTotal: string;
  avarageLockTime: string;
  totalAVATLocked: string;

  userData: Record<string, IGovernanceUserData>;
  grassHouseList: IGrassHouse[];
  isUserLoaded: boolean;
}
