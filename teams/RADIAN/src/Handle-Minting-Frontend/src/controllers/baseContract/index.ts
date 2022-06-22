import { ethers, Contract, EventFilter, Event } from "ethers";
import { IBaseContract, IContractError, SupportedProvider } from "./type";

abstract class BaseContractClass implements IBaseContract {

    provider: SupportedProvider;
    abi: any;
    contract: Contract;
    address: string

    constructor(
        address: string,
        provider: SupportedProvider,
        abi: any
    ) {
        this.provider = provider;
        this.address = address;
        this.contract = new ethers.Contract(address, abi, provider);
    }

    private errorHandler = (code: number) : IContractError => {

        let message: string;
        switch(code) {
            case 5000:
                message = 'Block range too large. Maximum is 3500';
                break;
            default:
                message = 'something went wrong';
        }
        return {code, message};
    };
};

export default BaseContractClass;