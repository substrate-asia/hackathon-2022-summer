// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type SendValueProps = Omit<SendValue, NonNullable<FunctionPropertyNames<SendValue>>>;

export class SendValue implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public recipient: string;

    public amount?: bigint;

    public contractAddress: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save SendValue entity without an ID");
        await store.set('SendValue', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove SendValue entity without an ID");
        await store.remove('SendValue', id.toString());
    }

    static async get(id:string): Promise<SendValue | undefined>{
        assert((id !== null && id !== undefined), "Cannot get SendValue entity without an ID");
        const record = await store.get('SendValue', id.toString());
        if (record){
            return SendValue.create(record as SendValueProps);
        }else{
            return;
        }
    }



    static create(record: SendValueProps): SendValue {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new SendValue(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
