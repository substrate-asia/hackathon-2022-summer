// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type StartGovernProps = Omit<StartGovern, NonNullable<FunctionPropertyNames<StartGovern>>>;

export class StartGovern implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public creator: string;

    public number?: bigint;

    public governType?: bigint;

    public startDate?: bigint;

    public endDate?: bigint;

    public uintValue?: bigint;

    public strValue?: string;

    public totalVoter?: bigint;

    public contractAddress: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save StartGovern entity without an ID");
        await store.set('StartGovern', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove StartGovern entity without an ID");
        await store.remove('StartGovern', id.toString());
    }

    static async get(id:string): Promise<StartGovern | undefined>{
        assert((id !== null && id !== undefined), "Cannot get StartGovern entity without an ID");
        const record = await store.get('StartGovern', id.toString());
        if (record){
            return StartGovern.create(record as StartGovernProps);
        }else{
            return;
        }
    }



    static create(record: StartGovernProps): StartGovern {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new StartGovern(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
