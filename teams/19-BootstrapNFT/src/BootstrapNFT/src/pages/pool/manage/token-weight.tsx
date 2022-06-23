import { useEffect, useState } from "react";
import Modal from "@/components/modal";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { Contract } from "ethers";
import {
    calcPoolInGivenWeightDecrease,
    calcSingleInGivenWeightIncrease,
} from "@/util/math";
import { ethers } from "ethers/lib.esm";
import { Interface } from "ethers/lib/utils";
import BActionABI from "@/contract/pool/BAction.json";
import DSProxyABI from "@/contract/pool/DSProxy.json";
import rinkeby from "@/config/rinkeby.json";
import { useLoading } from "@/context/loading";
import { useWeb3React } from "@web3-react/core";
import { bnum, scale, toWei } from "@/util/utils";
import BigNumber from "@/util/bignumber";
import rinkebey from "@/config/rinkeby.json";
import ERC20ABI from "@/contract/ERC20.json";

const ChangeTokenWeight = ({ totalShares, proxyAddress, pool, close }: any) => {
    const divisor = 100 / 25;
    const maxPercentage = 100 - divisor;
    const [, setLoading] = useLoading();
    const { active, account, library } = useWeb3React();
    const [isApproved, setIsApproved] = useState(false);
    const [totalWeights, setTotalWeights] = useState(1);
    const [changeTokenIndex, setChangeTokenIndex] = useState(-1);
    const [weights, setWeights] = useState<{ [key: string]: any }>({});
    const [initWeights, setInitWeights] = useState<{ [key: string]: any }>({});
    const [initialPercentages, setInitialPercentages] = useState<{
        [key: string]: any;
    }>({});

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
        checkApprove();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        console.log("update", pool, weights);
        if (changeTokenIndex < 0) {
            return;
        }

        const token = pool.tokens[changeTokenIndex];

        if (weights[token.symbol] > initWeights[token.symbol]) {
            increaseWeight(token);
        } else if (weights[token.symbol] < initWeights[token.symbol]) {
            decreaseWeight(token);
        }
    };

    const increaseWeight = async (token: any) => {
        const tokenWeiAmountIn = calcSingleInGivenWeightIncrease(
            scale(bnum(token.balance), token.decimals),
            toWei(token.denormWeight),
            toWei(weights[token.symbol])
        );

        console.log("update", tokenWeiAmountIn.toString());

        // const newWeight = ethers.utils.parseEther(
        //     weights[token.symbol].toString()
        // );
        console.log(initialPercentages);

        const newWeight = bnum((weights[token.symbol] / totalWeights) * 100)
            .times(new BigNumber(1e12))
            .integerValue(BigNumber.ROUND_DOWN)
            .div(new BigNumber(1e12).times(divisor));

        console.log("newWeight:", newWeight);

        const tokenAddress = ethers.utils.getAddress(token.address);

        console.log(
            "res",
            pool.controller,
            tokenAddress,
            newWeight.toString(),
            tokenWeiAmountIn.toString()
        );

        try {
            const ifac = new Interface(BActionABI);
            const data = ifac.encodeFunctionData("increaseWeight", [
                pool.controller,
                tokenAddress,
                ethers.utils.parseEther(newWeight.toString()),
                tokenWeiAmountIn.toString(),
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
            console.log("increase weight err:", e);
        }

        console.log(
            "res",
            pool.controller,
            tokenAddress,
            newWeight,
            tokenWeiAmountIn
        );
    };

    const decreaseWeight = async (token: any) => {
        const tw =
            totalWeights +
            divisor * parseFloat(token.denormWeight) -
            parseFloat(weights[token.symbol]);
        const poolAmountIn = calcPoolInGivenWeightDecrease(
            toWei(bnum(tw)),
            toWei((token.denormWeight * divisor).toString()),
            toWei(weights[token.symbol]),
            bnum(totalShares)
        );

        const newWeight = bnum((weights[token.symbol] / totalWeights) * 100)
            .times(new BigNumber(1e12))
            .integerValue(BigNumber.ROUND_DOWN)
            .div(new BigNumber(1e12).times(divisor));

        console.log(
            "newWeight:",
            newWeight.toString(),
            poolAmountIn.toString(),
            tw,
            totalShares,
            pool.controller,
            token.address
        );

        const tokenAddress = ethers.utils.getAddress(token.address);

        try {
            const ifac = new Interface(BActionABI);
            const data = ifac.encodeFunctionData("decreaseWeight", [
                ethers.utils.getAddress(pool.controller),
                tokenAddress,
                ethers.utils.parseEther(newWeight.toString()),
                poolAmountIn.toString(),
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
                    console.log("update weight decrease success", res);
                    setLoading(false);
                    close();
                })
                .catch((err: any) => {
                    console.log("update weight decrease err", err);
                    setLoading(false);
                });
        } catch (e) {
            setLoading(false);
            console.log("decreaseWeight err:", e);
        }
    };

    const checkApprove = async () => {
        const contract = new Contract(
            pool.controller,
            ERC20ABI,
            library.getSigner()
        );
        await contract
            .allowance(account, proxyAddress)
            .then((res: any) => {
                if (res > 0) {
                    setIsApproved(true);
                }
            })
            .catch((err: any) => {
                console.log("tokensAllowance err", err);
            });
    };

    const approve = async () => {
        setLoading(true);
        const contract = new Contract(
            pool.controller,
            ERC20ABI,
            library.getSigner()
        );
        try {
            const tx = await contract.approve(
                proxyAddress,
                ethers.constants.MaxUint256
            );
            await tx
                .wait()
                .then((res: any) => {
                    setIsApproved(true);
                    setLoading(false);
                    console.log("approve:", res);
                })
                .catch((err: any) => {
                    setLoading(false);
                    console.log("approve error:", err);
                });
        } catch (e) {
            console.log("approve err:", e);
            setLoading(false);
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
                                                setChangeTokenIndex(index);
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
                </div>
                <div className="flex justify-center gap-x-4 mt-8">
                    <button
                        className="btn-primary bg-purple-primary bg-opacity-50"
                        onClick={close}
                    >
                        Cancel
                    </button>
                    {changeTokenIndex >= 0 &&
                        (weights[pool.tokens[changeTokenIndex].symbol] >
                        initWeights[pool.tokens[changeTokenIndex].symbol] ? (
                            <button
                                className="btn-primary"
                                disabled={false}
                                onClick={handleUpdate}
                            >
                                Confirm
                            </button>
                        ) : isApproved ? (
                            <button
                                className="btn-primary"
                                disabled={false}
                                onClick={handleUpdate}
                            >
                                Confirm
                            </button>
                        ) : (
                            <button className="btn-primary" onClick={approve}>
                                Unlock
                            </button>
                        ))}
                </div>
            </div>
        </Modal>
    );
};

export default ChangeTokenWeight;
