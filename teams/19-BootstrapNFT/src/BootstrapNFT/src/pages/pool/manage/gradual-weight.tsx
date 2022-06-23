import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import Modal from "@/components/modal";
import { useLoading } from "@/context/loading";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { getDenorm } from "@/util/weights";
import { Interface } from "ethers/lib/utils";
import BActionABI from "@/contract/pool/BAction.json";
import { Contract } from "ethers";
import DSProxyABI from "@/contract/pool/DSProxy.json";
import rinkeby from "@/config/rinkeby.json";
import { toWei } from "@/util/utils";

const GradualWeight = ({ changeBlockNum, proxyAddress, pool, close }: any) => {
    const BLOCK_BUFFER = 100;
    const divisor = 100 / 25;
    const maxPercentage = 100 - divisor;
    const [, setLoading] = useLoading();
    const { active, account, library } = useWeb3React();
    const [totalWeights, setTotalWeights] = useState(1);
    const [weights, setWeights] = useState<{ [key: string]: any }>({});
    const [initWeights, setInitWeights] = useState<{ [key: string]: any }>({});
    const [initialPercentages, setInitialPercentages] = useState<{
        [key: string]: any;
    }>({});
    const [currentBlock, setCurrentBlock] = useState(0);
    const [startBlock, setStartBlock] = useState(0);
    const [endBlock, setEndBlock] = useState(0);

    useEffect(() => {
        const w: { [key: string]: any } = {};
        pool.tokens.map(
            (token: any) =>
                (w[token.symbol] = divisor * parseFloat(token.denormWeight))
        );
        setWeights(w);
        setInitWeights(w);

        const initialPercentages: { [key: string]: any } = {};
        pool.tokens.map(
            (token: any) =>
                (initialPercentages[token.symbol] =
                    parseFloat(token.denormWeight) /
                    parseFloat(pool.totalWeight))
        );
        setInitialPercentages(initialPercentages);
        getBlockNumber();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getBlockNumber = async () => {
        const blockNum = await library.getBlockNumber();
        setCurrentBlock(blockNum);
        console.log("block number:", blockNum);
        setStartBlock(blockNum + BLOCK_BUFFER);
        const miniInterval = changeBlockNum ? parseInt(changeBlockNum) : 100;
        setEndBlock(blockNum + BLOCK_BUFFER + miniInterval);
    };

    useEffect(() => {
        let totalWeight = 0;
        Object.keys(weights).map(
            (key: string) => (totalWeight += weights[key])
        );
        if (totalWeight !== 0) {
            setTotalWeights(totalWeight);
        }
    }, [weights]);

    const handleUpdate = async () => {
        const newWeights: any = [];
        let totalWeight = 0;
        Object.keys(weights).map(
            (key: string) => (totalWeight += weights[key])
        );

        for (let i = 0; i < pool.tokens.length; i++) {
            const token = pool.tokens[i];
            // Denorm calculation matches the code in the validation above
            const w = getDenorm(
                (weights[token.symbol] / totalWeight) * 100,
                false
            );
            newWeights.push(toWei(w).toString());
        }

        console.log(
            "update ------",
            pool.console,
            newWeights,
            startBlock,
            endBlock,
            proxyAddress
        );

        try {
            const ifac = new Interface(BActionABI);
            const data = ifac.encodeFunctionData("updateWeightsGradually", [
                pool.controller,
                newWeights,
                startBlock,
                endBlock,
            ]);
            setLoading(true);
            const contract = new Contract(
                proxyAddress,
                DSProxyABI,
                library.getSigner()
            );
            const tx = await contract.execute(rinkeby.addresses.bActions, data);

            await tx
                .wait()
                .then((res: any) => {
                    console.log("update weight success", res);
                    setLoading(false);
                    close();
                })
                .catch((err: any) => {
                    console.log("update weight err", err);
                    setLoading(false);
                });
        } catch (e) {
            setLoading(false);
            console.log("increase weight err:", e);
        }
    };

    return (
        <Modal close={close} title="Edit token weights" maxW="max-w-lg">
            <div className="mt-4">
                <div className="mt-4">
                    <div className="flex text-center bg-purple-second bg-opacity-10 rounded py-2">
                        <div className="w-1/3">Tokens</div>
                        <div className="w-1/3">Weights</div>
                        <div className="w-1/3">Percent</div>
                    </div>
                    <div className="px-3">
                        {pool.tokens.map((token: any, index: number) => {
                            return (
                                <div
                                    className="flex text-center py-3 border-b border-purple-primary
                                        border-opacity-60"
                                    key={index}
                                >
                                    <div className="flex items-center gap-x-2 w-1/3 pl-3">
                                        <Jazzicon
                                            diameter={22}
                                            seed={jsNumberForAddress(
                                                token.address
                                            )}
                                        />
                                        <span>{token.symbol}</span>
                                    </div>
                                    <div className="w-1/3">
                                        <input
                                            className="border text-lg font-mono transition-colors w-20 px-2
                                                  border-lm-gray-300 rounded-sm  text-gray-700 bg-white focus:outline-none
                                                  focus:border-purple-primary focus:ring-0 text-center"
                                            type="number"
                                            value={weights[token.symbol] || 0}
                                            min="1"
                                            step="1"
                                            onChange={(e: any) => {
                                                const newWeights: {
                                                    [key: string]: any;
                                                } = { ...weights };
                                                newWeights[token.symbol] =
                                                    parseFloat(e.target.value);
                                                setWeights(newWeights);
                                            }}
                                        />
                                    </div>
                                    <div className="w-1/3">
                                        {(
                                            initialPercentages[token.symbol] *
                                            100
                                        ).toFixed(2)}{" "}
                                        % →
                                        {(
                                            (weights[token.symbol] /
                                                totalWeights) *
                                            100
                                        ).toFixed(2)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="p-4">
                        <div className="flex items-center gap-x-8">
                            <div className="text-lg w-[100px]">Start block</div>
                            <input
                                type="number"
                                className="input-second py-1"
                                value={startBlock || 0}
                                onChange={(e) => {
                                    const num = parseInt(e.target.value);
                                    if (num <= currentBlock + BLOCK_BUFFER) {
                                        return;
                                    }
                                    setStartBlock(parseInt(e.target.value));
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-x-8">
                            <div className="text-lg w-[100px]">End block</div>
                            <input
                                type="number"
                                className="input-second py-1"
                                value={endBlock || 0}
                                onChange={(e) => {
                                    const curr = parseInt(e.target.value);
                                    if (
                                        curr - startBlock <
                                        parseInt(changeBlockNum)
                                    ) {
                                        return;
                                    }
                                    setEndBlock(parseInt(e.target.value));
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center gap-x-4 mt-8">
                    <button
                        className="btn-primary bg-purple-primary bg-opacity-50"
                        onClick={close}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn-primary"
                        disabled={false}
                        onClick={handleUpdate}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default GradualWeight;
