export enum IIdoStateEnum {
  INIT = 'INIT',
  PROCING = 'PROCING',
  WAITINGGETLP = 'WAITINGGETLP',
  END = 'END',
}
export interface IIdoState {
  idoState: IIdoStateEnum;
  isUserLoaded: boolean;
  avatEstimatedPrice: string;
  maxASTRBalance: Record<string, string>;
  mainTokenPrice: string;
  startTime: number;
  endTime: number;
  idoInAstrBalance: string;
  apr: string;
  countedAstrAmount: string;
  rewards: string;
  lpTotalBalance: string;
  lpBalance: Record<string, string>;
}

export interface IFetchIdoCallback {
  maxASTRBalance?: Record<string, string>;
  idoInAstrBalance?: string;
  lpTotalBalance?: string;
  idoState?: string;
  endTime?: string;
  startTime?: string;
  countedAstrAmount?: string;
  rewards?: string;
}
