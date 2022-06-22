import { Event, ethers } from "ethers";

export type SupportedProvider = ethers.providers.Web3Provider | ethers.providers.JsonRpcSigner;

export interface IContractError {
    code: number;
    message: string;
}

export interface IBaseContract {
    address: string,
    provider: SupportedProvider,
}