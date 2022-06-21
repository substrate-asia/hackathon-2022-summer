import ethers, {
  Contract,
  ContractFunction,
  BigNumberish,
  CallOverrides,
  Overrides,
  ContractTransaction,
} from 'ethers';
import { BytesLike } from '@ethersproject/bytes';
export type MultiCallResponse<T> = T | null;

// Predictions
export type PredictionsClaimableResponse = boolean;

export interface PredictionsLedgerResponse {
  position: 0 | 1;
  amount: ethers.BigNumber;
  claimed: boolean;
}

export type PredictionsRefundableResponse = boolean;

export interface PredictionsRoundsResponse {
  epoch: ethers.BigNumber;
  startBlock: ethers.BigNumber;
  lockBlock: ethers.BigNumber;
  endBlock: ethers.BigNumber;
  lockPrice: ethers.BigNumber;
  closePrice: ethers.BigNumber;
  totalAmount: ethers.BigNumber;
  bullAmount: ethers.BigNumber;
  bearAmount: ethers.BigNumber;
  rewardBaseCalAmount: ethers.BigNumber;
  rewardAmount: ethers.BigNumber;
  oracleCalled: boolean;
}

export interface PredictionsContract extends Contract {
  claimable: ContractFunction<PredictionsClaimableResponse>;
  ledger: ContractFunction<PredictionsLedgerResponse>;
  refundable: ContractFunction<PredictionsRefundableResponse>;
  rounds: ContractFunction<PredictionsRoundsResponse>;
}

// Chainlink Orance
export type ChainLinkOracleLatestAnswerResponse = ethers.BigNumber;

export interface ChainLinkOracleContract extends Contract {
  latestAnswer: ContractFunction<ChainLinkOracleLatestAnswerResponse>;
}

// Farm Auction

// Note: slightly different from AuctionStatus used thoughout UI
export enum FarmAuctionContractStatus {
  Pending,
  Open,
  Close,
}

export interface AuctionsResponse {
  status: FarmAuctionContractStatus;
  startBlock: ethers.BigNumber;
  endBlock: ethers.BigNumber;
  initialBidAmount: ethers.BigNumber;
  leaderboard: ethers.BigNumber;
  leaderboardThreshold: ethers.BigNumber;
}

export interface BidsPerAuction {
  account: string;
  amount: ethers.BigNumber;
}

export type ViewBidsPerAuctionResponse = [BidsPerAuction[], ethers.BigNumber];

// [auctionId, bids, claimed, nextCursor]
export type ViewBidderAuctionsResponse = [ethers.BigNumber[], ethers.BigNumber[], boolean[], ethers.BigNumber];

type GetWhitelistedAddressesResponse = [
  {
    account: string;
    lpToken: string;
    token: string;
  }[],
  ethers.BigNumber,
];

interface AuctionsHistoryResponse {
  totalAmount: ethers.BigNumber;
  hasClaimed: boolean;
}

export interface FarmAuctionContract extends Contract {
  currentAuctionId: ContractFunction<ethers.BigNumber>;
  viewBidders: ContractFunction<[string[], ethers.BigNumber]>;
  totalCollected: ContractFunction<ethers.BigNumber>;
  auctions: ContractFunction<AuctionsResponse>;
  claimable: ContractFunction<boolean>;
  viewBidsPerAuction: ContractFunction<ViewBidsPerAuctionResponse>;
  viewBidderAuctions: ContractFunction<ViewBidderAuctionsResponse>;
  whitelisted: ContractFunction<boolean>;
  getWhitelistedAddresses: ContractFunction<GetWhitelistedAddressesResponse>;
  auctionsHistory: ContractFunction<AuctionsHistoryResponse>;
}

export interface IMerkleDistributorInterface extends Contract {
  claim(
    index: BigNumberish,
    account: string,
    amount: BigNumberish,
    merkleProof: BytesLike[],
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  isClaimed(index: BigNumberish, overrides?: CallOverrides): Promise<[boolean]>;

  merkleRoot(overrides?: CallOverrides): Promise<[string]>;

  token(overrides?: CallOverrides): Promise<[string]>;
}
export interface IDappStakingInterface extends Contract {
  // 100000000  precision: 0.00000001
  RATIO_PRECISION(overrides?: CallOverrides): Promise<[ethers.BigNumber]>;
  // 10000
  FEE_PRECISION(overrides?: CallOverrides): Promise<[ethers.BigNumber]>;
  // unit: 0.0001
  fee(overrides?: CallOverrides): Promise<[ethers.BigNumber]>;
  feeTo(overrides?: CallOverrides): Promise<[string]>;
  // unbondingPeriod 区块的数量  7200 | 14000   倒计快
  unbondingPeriod(overrides?: CallOverrides): Promise<[ethers.BigNumber]>;
  lastClaimedEra(overrides?: CallOverrides): Promise<[ethers.BigNumber]>;
  // ratio 量
  ratio(overrides?: CallOverrides): Promise<[ethers.BigNumber]>;
  recordsIndex(overrides?: CallOverrides): Promise<[ethers.BigNumber]>;
  toWithdrawSDN(overrides?: CallOverrides): Promise<[ethers.BigNumber]>;

  records(overrides?: CallOverrides): Promise<[IWithdrawRecordItem[]]>;

  // event   uint _recordsIndex, uint _ksdn, uint _ratio
  PoolUpdate(overrides?: CallOverrides): Promise<[ethers.BigNumber, ethers.BigNumber, ethers.BigNumber]>;

  getWithdrawRecords(
    // page
    startIndex: BigNumberish,
    // size
    capacity: BigNumberish,
  ): Promise<IWithdrawRecordItem[]>;
  // Allow a user to deposit underlying tokens and mint the corresponding number of wrapped tokens.
  depositFor(account: string, overrides?: CallOverrides): Promise<ContractTransaction>;
  // Allow a user to burn a number of wrapped tokens and withdraw the corresponding number of underlying tokens.
  withdrawTo(account: string, ksdnAmount: BigNumberish): Promise<ContractTransaction>;
  calcDailyApr(): Promise<[ethers.BigNumber]>;
}
export interface IWithdrawRecordItem {
  era: BigNumberish;
  address: string;
  amount: BigNumberish;
  status?: number;
  unbonding?: number;
}
