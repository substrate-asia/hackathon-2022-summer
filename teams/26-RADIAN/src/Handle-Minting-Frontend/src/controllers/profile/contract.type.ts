import { IBaseContract } from "../baseContract/type";

export interface IHandlePage {
    meta: {
        count: number,
        offset: number,
        limit: number
    },
    results: string[],
}

export interface IProfileContract extends IBaseContract {
    getAddressByHandle(
        handle: string
    ): Promise<string | null>;

    createProfile(
        handle: string,
        color: string
    ): Promise<void>;

    getHandlesByAddress(
        address: string
    ): Promise<string[]>;

    getHandlePaginatedList(
        offset: number,
        limit: number
    ): Promise<IHandlePage>;

    getTokenURIbyHandle(
        handle: string,
    ): Promise<string>,

    getHandleCard(
        handle: string,
    ): Promise<string>,
}