import { SupportedProvider } from "../baseContract/type";
import BaseContractClass from "../baseContract";
import { abi } from './abi.json'
import { IHandlePage, IProfileContract } from "./contract.type";

const ADDRESS = '0x93D2D7879674bBbe8EECF34281d0FAa550a75238';

class ProfileContract extends BaseContractClass implements IProfileContract {

    constructor(
        provider: SupportedProvider
    ) {
        super(ADDRESS, provider, abi);

        this.getAddressByHandle = this.getAddressByHandle.bind(this);
        this.createProfile = this.createProfile.bind(this);
        this.getHandlesByAddress = this.getHandlesByAddress.bind(this);
        this.getHandlePaginatedList = this.getHandlePaginatedList.bind(this);
        this.getTokenURIbyHandle = this.getTokenURIbyHandle.bind(this);
        this.getHandleCard = this.getHandleCard.bind(this);
    }

    public getAddressByHandle = async ( 
        handle: string
    ) => {
        try {
            const address = await this.contract.getAddressByHandle(`${handle}.RADI`);
            return address
        } catch (error: any) {
            console.log(error);
            return null;
        }
    }

    public getHandlesByAddress = async (
        address: string
    ): Promise<string[]> => {
        try {
            const response = await this.contract.getHandlesByAddress(address);

            return response;
        } catch (error) {
            console.log(error);
            throw(error);
        }
    }

    public getHandlePaginatedList = async (
        offset: number,
        limit: number
    ): Promise<IHandlePage> => {
        try {
            const response = await this.contract.getHandlePaginatedList(offset, limit);

            return response as IHandlePage;
        } catch (error) {
            console.log(error)
            throw(error)
        }
    }

    private parseDataUrl = (
        url: string,
        sub: number
    ): any => {
        return Buffer.from(url.substring(sub), "base64").toString();
    }

    public getHandleCard = async (
        handle: string
    ) => {
        const tokenUri = await this.getTokenURIbyHandle(handle);
        const jsonString = this.parseDataUrl(tokenUri, 29);
        const json = JSON.parse(jsonString);
        const cardSvg = this.parseDataUrl(json.image, 26);
        return cardSvg
    }

    public getTokenURIbyHandle = async (
        handle: string
    ) => {
        try {
            const response = await this.contract.getTokenURIbyHandle(handle);

            return response;
        } catch (error) {
            
        }
    }

    public createProfile = async (
        handle: string,
        color: string,
    ) => {
        const CONTENT_URL = '';
        const DOMAIN = 'RADI';
        const APP_ID = 0;
        try {
            const tx = await this.contract.createProfile(
                handle,
                DOMAIN,
                color,
                CONTENT_URL,
                APP_ID
            );
            return tx
        } catch (error) {
            console.log(error);
            throw(error)
        }   
    }
};

export default ProfileContract;