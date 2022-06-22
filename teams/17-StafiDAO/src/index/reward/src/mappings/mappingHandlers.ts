import { SendValue } from "../types";
import { FrontierEvmEvent } from '@subql/contract-processors/dist/frontierEvm';
import { BigNumber } from "ethers";

// Setup types from ABI
type RewardEventArgs = [string, BigNumber] & {recipient: string; amount: BigNumber; };

export async function handleRewardEvmEvent(event: FrontierEvmEvent<RewardEventArgs>): Promise<void> {
    const sendValue = new SendValue(event.transactionHash);

    sendValue.recipient = event.args.recipient;
    sendValue.amount = event.args.amount.toBigInt();
    sendValue.contractAddress = event.address;

    await sendValue.save();
}

