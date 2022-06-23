import Modal from "@/components/modal";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import closeIcon from "@/assets/icon/close.svg";
import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import ERC20ABI from "@/contract/ERC20.json";
import { useWeb3React } from "@web3-react/core";
import { calcPoolInGivenTokenRemove } from "@/util/math";
import { Interface } from "ethers/lib/utils";
import BActionABI from "@/contract/pool/BAction.json";
import DSProxyABI from "@/contract/pool/DSProxy.json";
import rinkeby from "@/config/rinkeby.json";
import { useLoading } from "@/context/loading";
import { bnum } from "@/util/utils";

const ChangeToken = ({
    totalShares,
    proxyAddress,
    controller,
    symbol,
    totalWeight,
    tokens,
    close,
}: any) => {
    const [, setLoading] = useLoading();
    const [amount, setAmount] = useState(0);
    const { account, active, library } = useWeb3React();
    const [allowance, setAllowance] = useState(false);
    const [removeToken, setRemoveToken] = useState<any>(undefined);

    useEffect(() => {
        console.log("ChangeToken", totalShares, totalWeight);
        checkApprove();
    }, []);

    const calcAmount = async (token: any) => {
        setRemoveToken(token);
        const res = calcPoolInGivenTokenRemove(
            bnum(ethers.utils.parseEther(totalWeight.toString()).toString()),
            bnum(ethers.utils.parseEther(totalShares.toString()).toString()),
            bnum(
                ethers.utils
                    .parseEther(token.denormWeight.toString())
                    .toString()
            )
        );
        setAmount(parseInt(ethers.utils.formatEther(res.toString())));
    };

    const checkApprove = async () => {
        const contract = new Contract(
            controller,
            ERC20ABI,
            library.getSigner()
        );
        await contract
            .allowance(account, proxyAddress)
            .then((res: any) => {
                if (res > 0) {
                    setAllowance(true);
                }
            })
            .catch((err: any) => {
                console.log("tokensAllowance err", err);
            });
    };

    const approve = async () => {
        setLoading(true);
        const contract = new Contract(
            controller,
            ERC20ABI,
            library.getSigner()
        );
        const tx = await contract.approve(
            proxyAddress,
            ethers.constants.MaxUint256
        );
        await tx
            .wait()
            .then((res: any) => {
                setAllowance(true);
                setLoading(false);
                console.log("approve:", res);
            })
            .catch((err: any) => {
                setLoading(false);
                console.log("approve error:", err);
            });
    };

    const handleRemoveToken = async () => {
        if (!active) {
            return;
        }
        setLoading(true);

        const ifac = new Interface(BActionABI);
        const data = ifac.encodeFunctionData("removeToken", [
            controller,
            removeToken.address,
            ethers.utils.parseEther(amount.toString()),
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
                console.log("remove token success", res);
                setLoading(false);
                close();
            })
            .catch((err: any) => {
                console.log("remove token err", err);
                setLoading(false);
            });
    };

    return (
        <Modal close={close} title="Add and remove tokens" maxW="max-w-lg">
            <div className="mt-4">
                {removeToken ? (
                    <div className="mt-4">
                        <h1 className="text-white font-medium text-lg text-center px-6">
                            Are you sure you want to remove the token BAL from
                            the pool?
                        </h1>
                        <div className="mt-2 text-center">
                            This operation will burn {amount} {symbol}.
                        </div>
                        {!allowance && (
                            <div className="text-center mt-2">
                                <button
                                    className="btn-primary"
                                    onClick={approve}
                                >
                                    Unlock
                                </button>
                            </div>
                        )}
                        <ul className="text-emerald-primary mt-2 text-sm px-6">
                            <li>
                                1. Removing a token will redeem BPTs for the
                                balance
                            </li>
                            <li>
                                2. If you remove all tokens, the pool will be
                                irrevocably destroyed
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="mt-4">
                        <div className="flex text-center bg-purple-second bg-opacity-10 rounded py-2">
                            <div className="w-1/3">Tokens</div>
                            <div className="w-1/3">Balance</div>
                            <div className="w-1/5"></div>
                        </div>
                        <div className="px-3">
                            {tokens.map((token: any, index: number) => {
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
                                            {parseFloat(token.balance).toFixed(
                                                2
                                            )}
                                        </div>
                                        <div className="w-1/5 text-right flex justify-end">
                                            {token.balance > 0 && (
                                                <img
                                                    src={closeIcon}
                                                    alt=""
                                                    className="w-5 h-5 cursor-pointer"
                                                    onClick={() =>
                                                        calcAmount(token)
                                                    }
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                <div className="flex justify-center gap-x-4 mt-8">
                    <button
                        className="btn-primary bg-purple-primary bg-opacity-50"
                        onClick={close}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn-primary"
                        disabled={!removeToken && allowance}
                        onClick={handleRemoveToken}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ChangeToken;
