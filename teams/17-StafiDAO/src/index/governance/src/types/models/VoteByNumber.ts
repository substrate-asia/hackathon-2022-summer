// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type VoteByNumberProps = Omit<VoteByNumber, NonNullable<FunctionPropertyNames<VoteByNumber>>>;

export class VoteByNumber implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public votor: string;

    public number?: bigint;

    public governType?: bigint;

    public state?: bigint;

    public voters?: bigint;

    public contractAddress: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save VoteByNumber entity without an ID");
        await store.set('VoteByNumber', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove VoteByNumber entity without an ID");
        await store.remove('VoteByNumber', id.toString());
    }

    static async get(id:string): Promise<VoteByNumber | undefined>{
        assert((id !== null && id !== undefined), "Cannot get VoteByNumber entity without an ID");
        const record = await store.get('VoteByNumber', id.toString());
        if (record){
            return VoteByNumber.create(record as VoteByNumberProps);
        }else{
            return;
        }
    }



    static create(record: VoteByNumberProps): VoteByNumber {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new VoteByNumber(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
