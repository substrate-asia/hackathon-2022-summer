import { Fragment, useEffect, useState } from "react";
import arrowLeft from "@/assets/icon/arrow-down.svg";
import close from "@/assets/icon/close.svg";
import SelectToken from "@/pages/pool/create/select-token";
import tokenList from "@/config/tokens.json";
import rinkeby from "@/config/rinkeby.json";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, Contract, ethers } from "ethers";
import ERC20ABI from "@/contract/ERC20.json";
import DSProxyRegistryABI from "@/contract/pool/DSProxyRegistry.json";
import BActionABI from "@/contract/pool/BAction.json";
import DSProxyABI from "@/contract/pool/DSProxy.json";
import { Interface } from "ethers/lib/utils";
import { useLoading } from "@/context/loading";
import { useNavigate } from "react-router";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

const PoolCreate = () => {
    const [, setLoading] = useLoading();
    const navgator = useNavigate();
    const { account, library, active } = useWeb3React();
    const [proxyAddress, setProxyAddress] = useState("");
    const [tokensInfo, setTokensInfo] = useState<any[]>([]);
    const [selectTokens, setSelectTokens] = useState<any[]>([]);
    const [approveTokens, setApproveTokens] = useState<any[]>([]);
    const [selectTokenIndex, setSelectTokenIndex] = useState(0);
    const [showSelectToken, setShowSelectToken] = useState(false);
    const [weights, setWeights] = useState<{ [key: string]: any }>({});
    const [tokenPercent, setTokenPercent] = useState<{ [key: string]: any }>(
        {}
    );
    const [tokenAmount, setTokenAmount] = useState<{ [key: string]: any }>({});
    const [tokensBalance, setTokensBalance] = useState<{ [key: string]: any }>(
        {}
    );
    const [tokensAllowance, setTokensAllowance] = useState<{
        [key: string]: any;
    }>({});
    const [stepType, setStepType] = useState<"SetProxy" | "Approve" | "Create">(
        "SetProxy"
    );

    const [swapFees, setSwapFees] = useState(0.15);
    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [initSupply, setInitSupply] = useState(100);
    const [changeWightBlock, setChangeWightBlock] = useState(10);
    const [changeTokenBlock, setChangeTokenBlock] = useState(10);
    const [enableWhitelist, setEnableWhitelist] = useState(false);
    const [enablePauseSwap, setEnablePauseSwap] = useState(true);
    const [enableChangeFee, setEnableChangeFee] = useState(false);
    const [enableChangeSupply, setEnableChangeSupply] = useState(false);
    const [enableChangeToken, setEnableChangeToken] = useState(false);
    const [enableChangeWeights, setEnableChangeWeights] = useState(false);

    useEffect(() => {
        (async () => {
            console.log("SelectToken1");
            setLoading(true);
            const tokens = tokenList.tokens as unknown as {
                [key: string]: any;
            };
            const tokenInfo: any[] = [];
            Object.keys(tokens).forEach((key) => {
                tokenInfo.push(tokens[key] as any);
            });
            await getPrice(tokenInfo);
            await getProxyAddress();

            const balances: { [key: string]: any } = {};
            await Promise.all(
                tokenInfo.map(async (token: any) => {
                    await getBalance(token)
                        .then((balance: any) => {
                            balances[token.address] = ethers.utils.formatUnits(
                                balance,
                                token.decimals
                            );
                        })
                        .catch((err: any) => {
                            console.log("getBalance err", err);
                        });
                })
            )
                .then(() => {
                    setTokensBalance(balances);
                })
                .catch((err) => {
                    console.log("get balance err:", err);
                });
            setLoading(false);
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, account]);

    useEffect(() => {
        clacPercent();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weights]);

    useEffect(() => {
        console.log("set weight");
        selectTokens.forEach((token: any, index) => {
            if (!weights[token.id]) {
                weights[token.id] = index === 0 ? 10 : 40;
            }
            if (!tokenAmount[token.id]) {
                tokenAmount[token.id] = 0;
            }
        });
        setWeights(JSON.parse(JSON.stringify(weights)));
        setTokenAmount(JSON.parse(JSON.stringify(tokenAmount)));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectTokens]);

    useEffect(() => {
        (async () => {
            if (tokensInfo === [] || proxyAddress === "") {
                return;
            }
            await getTokensAllowance();
        })();
    }, [tokensInfo, proxyAddress]);

    useEffect(() => {
        console.log("set step==========:", proxyAddress);
        if (proxyAddress === "") {
            setStepType("SetProxy");
            return;
        }

        checkApprove();
    }, [proxyAddress, selectTokens, tokensAllowance]);

    const clacPercent = () => {
        console.log("clacPercent");
        const percent: { [key: string]: any } = {};
        selectTokens.forEach((token: any) => {
            percent[token.id] = getPercentage(token);
        });
        setTokenPercent(percent);
    };

    const getPrice = async (tokens: any[]) => {
        // document.title = "Create Pool";
        const idString = "weth,dai,usd-coin,balancer";
        const ENDPOINT = "https://api.coingecko.com/api/v3";
        const url = `${ENDPOINT}/simple/price?ids=${idString}&vs_currencies=usd`;
        const response = await fetch(url);
        const data = await response.json();
        console.log("price", data);
        const temp = tokens.map((token: any) => {
            token.price = data[token.id] ? data[token.id].usd : 0;
            return token;
        });
        setTokensInfo(temp);
        const selectTokens = temp.slice(0, 2);
        setSelectTokens(selectTokens);
    };

    const getBalance = async (token: any) => {
        const contract = new Contract(
            token.address,
            ERC20ABI,
            library.getSigner()
        );
        return await contract.balanceOf(account);
    };

    const showToken = (index: number) => {
        setSelectTokenIndex(index);
        setShowSelectToken(true);
    };

    const handleSelectToken = (token: any) => {
        const tokens = selectTokens;
        tokens[selectTokenIndex] = token;
        setSelectTokens([...tokens]);
        setShowSelectToken(false);
    };

    const addToken = () => {
        const tokens = tokensInfo.filter((token: any) => {
            return !selectTokens.some((t: any) => {
                return t.id === token.id;
            });
        });
        if (tokens.length === 0) {
            return;
        }
        setSelectTokens([...selectTokens, tokens[0]]);
    };

    const getProxyAddress = async () => {
        if (!active) {
            return;
        }
        const contract = new Contract(
            rinkeby.addresses.dsProxyRegistry,
            DSProxyRegistryABI,
            library.getSigner()
        );
        await contract.proxies(account).then((res: any) => {
            console.log("proxy", res);
            if (res === "0x0000000000000000000000000000000000000000") {
                return;
            }
            setProxyAddress(res);
        });
    };

    const setupProxy = async () => {
        const contract = new Contract(
            rinkeby.addresses.dsProxyRegistry,
            DSProxyRegistryABI,
            library.getSigner()
        );
        const tx = await contract.build();
        await tx.wait().then((res: any) => {
            setProxyAddress(res);
            console.log("set up proxy:", res);
        });
    };

    const getTokensAllowance = async () => {
        console.log("get token list allowance:", tokensInfo);
        const tokensAllowance: { [key: string]: any } = {};
        await Promise.all(
            tokensInfo.map(async (token: any, index: number) => {
                console.log("allow ==== address", token.address);
                const contract = new Contract(
                    token.address,
                    ERC20ABI,
                    library.getSigner()
                );
                await contract
                    .allowance(account, proxyAddress)
                    .then((res: any) => {
                        console.log("get token allow result:", res);
                        tokensAllowance[token.id] = ethers.utils.formatUnits(
                            res,
                            token.decimals
                        );
                    })
                    .catch((err: any) => {
                        console.log(`tokensAllowance err: ${index}:`, err);
                    });
            })
        )
            .then(() => {
                console.log("tokensAllowance result -------", tokensAllowance);
                setTokensAllowance(tokensAllowance);
            })
            .catch((err) => {
                console.log("get tokens all allowance err", err);
            });
    };

    const checkApprove = () => {
        if (Object.keys(tokensAllowance).length === 0) {
            return;
        }
        console.log("checkApprove----", proxyAddress);
        const unApproveToken: any[] = [];
        selectTokens.forEach((token: any) => {
            if (!tokensAllowance[token.id]) {
                unApproveToken.push(token);
            }
            if (!(parseFloat(tokensAllowance[token.id]) > 0)) {
                unApproveToken.push(token);
            }
        });
        if (unApproveToken.length > 0) {
            setStepType("Approve");
        } else {
            setStepType("Create");
        }
        setApproveTokens(unApproveToken);
    };

    const approve = async (token: any) => {
        const contract = new Contract(
            token.address,
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
                console.log("approve:", res);
                getTokensAllowance();
            })
            .catch((err: any) => {
                console.log("approve error:", err);
            });
    };

    const clacAmount = (token: any) => {
        if (tokenAmount[token.id] === 0) {
            return;
        }
        const unit =
            (tokenAmount[token.id] * token.price) / tokenPercent[token.id];
        const amount = tokenAmount;
        Object.keys(amount).forEach((key: string) => {
            if (key !== token.id) {
                const token = tokensInfo.find((t: any) => t.id === key);
                amount[key] = (
                    (unit * tokenPercent[key]) /
                    token.price
                ).toFixed(5);
            }
        });
        setTokenAmount(JSON.parse(JSON.stringify(amount)));
    };

    const createPool = async () => {
        const NUMERIC_PRECISION = BigNumber.from(1e12);
        console.log("createPool", NUMERIC_PRECISION.toString(), selectTokens);

        const weights = selectTokens.map((token: any) => {
            const weight =
                Math.round(
                    Number(tokenPercent[token.id]) *
                        NUMERIC_PRECISION.toNumber()
                ) / NUMERIC_PRECISION.mul(2).toNumber();
            return ethers.utils.parseEther(weight.toString()).toString();
        });

        const poolTokenSymbol = tokenSymbol.toUpperCase();
        const poolTokenName = tokenName;
        const minimumWeightChangeBlockPeriod = changeWightBlock;
        const addTokenTimeLockInBlocks = changeTokenBlock;
        const initialSupply = ethers.utils
            .parseEther(initSupply + "")
            .toString();
        const swapFee = ethers.utils
            .parseEther(swapFees + "")
            .div(100)
            .toString();

        // const tokenBal = [ethers.utils.parseEther("100").toString(), "399600798"];
        const tokenBal = selectTokens.map((token) => {
            return tranAmount(token.id);
        });

        // const tokens = [selectTokens[0].address, selectTokens[1].address];
        const tokens = selectTokens.map((token) => token.address);

        const rights = {
            canAddRemoveTokens: enableChangeToken,
            canChangeCap: enableChangeSupply,
            canChangeSwapFee: enableChangeFee,
            canChangeWeights: enableChangeWeights,
            canPauseSwapping: enablePauseSwap,
            canWhitelistLPs: enableWhitelist,
        };

        const crpParams = {
            initialSupply,
            minimumWeightChangeBlockPeriod,
            addTokenTimeLockInBlocks,
        };

        const poolParams = {
            poolTokenSymbol,
            poolTokenName,
            constituentTokens: tokens,
            tokenBalances: tokenBal,
            tokenWeights: weights,
            swapFee: swapFee,
        };

        const crpFactory = rinkeby.addresses.crpFactory;
        const bFactory = rinkeby.addresses.bFactory;
        const ifac = new Interface(BActionABI);
        console.log("ifac", [
            crpFactory,
            bFactory,
            poolParams,
            crpParams,
            rights,
        ]);
        const data = ifac.encodeFunctionData("createSmartPool", [
            crpFactory,
            bFactory,
            poolParams,
            crpParams,
            rights,
        ]);

        setLoading(true);
        console.log("proxy address", proxyAddress, rinkeby.addresses.bActions);
        const contract = new Contract(
            proxyAddress,
            DSProxyABI,
            library.getSigner()
        );
        const tx = await contract.execute(rinkeby.addresses.bActions, data);

        await tx
            .wait()
            .then((res: any) => {
                setLoading(false);
                navgator("/pool/explore");
                console.log("createPool:", res);
            })
            .catch((err: any) => {
                setLoading(false);
                console.log("createPool error:", err);
            });
    };

    const getPercentage = (token: any) => {
        let totalWeight = 0;
        Object.keys(weights).forEach((key: string) => {
            totalWeight += weights[key];
        });
        const tWeight = totalWeight;
        return tWeight === 0
            ? 0
            : ((weights[token.id] / tWeight) * 100).toFixed(2);
    };

    const changeAmount = (val: string, changeToken: any) => {
        let value = val === "" ? 0 : parseInt(val);
        if (value <= 0) {
            return;
        }
        console.log("tokenAmount", value);
        const amount = tokenAmount;
        amount[changeToken.id] = value;
        Object.keys(amount).forEach((key: string) => {
            if (key !== changeToken.id) {
                const token = tokensInfo.find((t: any) => t.id === key);
                amount[key] = (
                    (((amount[changeToken.id] * changeToken.price) /
                        tokenPercent[changeToken.id]) *
                        tokenPercent[key]) /
                    token.price
                ).toFixed(5);
            }
        });
        console.log("tokenAmount", amount, selectTokens);
        setTokenAmount(JSON.parse(JSON.stringify(amount)));
    };

    const removeToken = (token: any) => {
        const tokens = selectTokens.filter((t: any) => t.id !== token.id);
        setSelectTokens([...tokens]);
        const weight: { [key: string]: any } = {};
        Object.keys(weights).forEach((key: string) => {
            if (key !== token.id) {
                weight[key] = weights[key];
            }
        });
        setWeights(weight);

        const amounts: { [key: string]: any } = {};
        Object.keys(tokenAmount).forEach((key: string) => {
            if (key !== token.id) {
                amounts[key] = tokenAmount[key];
            }
        });
        setTokenAmount(amounts);
    };

    const tranAmount = (key: string) => {
        const amount = tokenAmount[key];
        const decimals = selectTokens.find((t: any) => t.id === key).decimals;
        const res = amount * Math.pow(10, decimals);
        console.log("tranAmount", key, amount, decimals, res, selectTokens);
        return BigNumber.from(res + "").toString();
    };

    const addNewToken = (token: any, balance: any) => {
        console.log("add new token:", token, balance);
        tokensInfo.push(token);
        setTokensInfo([...tokensInfo]);
        tokensBalance[token.address] = balance;
        setTokensBalance({ ...tokensBalance });
        getTokensAllowance();
    };

    return (
        <Fragment>
            <main className="flex-1 flex flex-col px-4 xl:px-8 2xl:p-12 pt-12 pb-28 text-purple-second">
                <section>
                    <header>
                        <h1 className="font-bold text-3xl mb-2">Create Pool</h1>
                        <p className="mb-4">create pool.</p>
                    </header>
                    <div className="bg-gradient-to-r from-transparent to-purple-primary h-px mb-4"></div>
                    <div className="rounded mt-6 mb-12 p-6 bg-blue-primary">
                        <table className="w-full">
                            <thead className="bg-purple-second bg-opacity-10">
                                <tr className="text-sm font-light">
                                    <th className="text-left w-1/3 h-12 pl-4 rounded-l-lg">
                                        Assets
                                    </th>
                                    <th className="text-right">My Balance</th>
                                    <th className="text-right">Weights</th>
                                    <th className="text-right">Percent</th>
                                    <th className="text-right">Amount</th>
                                    <th className="text-right">Price</th>
                                    <th className="text-right">Total Value</th>
                                    <th className="text-right pr-4 rounded-r-lg"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectTokens.map((token: any, index) => (
                                    <tr
                                        className="text-sm font-light border-b border-purple-second border-opacity-50"
                                        key={index}
                                    >
                                        <td className="text-left w-1/2 h-12 pl-4 flex gap-x-3 items-center">
                                            <span>
                                                {token.logoUrl ? (
                                                    <img
                                                        src={token.logoUrl}
                                                        className="w-5 h-5"
                                                        alt=""
                                                    />
                                                ) : (
                                                    <Jazzicon
                                                        diameter={18}
                                                        seed={jsNumberForAddress(
                                                            token.address
                                                        )}
                                                    />
                                                )}
                                            </span>
                                            <span>{token.symbol}</span>
                                            <span
                                                className="cursor-pointer"
                                                onClick={() => showToken(index)}
                                            >
                                                <img
                                                    src={arrowLeft}
                                                    alt=""
                                                    className="w-3 h-3"
                                                />
                                            </span>
                                        </td>
                                        <td className="text-right px-4">
                                            {tokensBalance
                                                ? tokensBalance[token.address]
                                                : 0.0}
                                        </td>
                                        <td className="text-right">
                                            <input
                                                className="border text-lg font-mono transition-colors w-20 px-2
                                                  border-lm-gray-300 rounded-sm  text-gray-700 bg-white focus:outline-none
                                                  focus:border-purple-primary focus:ring-0 text-center"
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={weights[token.id] || 0}
                                                onChange={(e) => {
                                                    const w = weights;
                                                    const val = parseInt(
                                                        e.target.value
                                                    );
                                                    w[token.id] =
                                                        val < 1 ? 1 : val;
                                                    setWeights(
                                                        JSON.parse(
                                                            JSON.stringify(w)
                                                        )
                                                    );
                                                    clacAmount(token);
                                                }}
                                            />
                                        </td>
                                        <td className="text-right">
                                            {tokenPercent[token.id]} %
                                        </td>
                                        <td className="text-right">
                                            <input
                                                className="border text-lg font-mono transition-colors w-20 px-2
                                                  border-lm-gray-300 rounded-sm  text-gray-700 bg-white focus:outline-none
                                                  focus:border-purple-primary focus:ring-0 text-center"
                                                type="number"
                                                min="1"
                                                value={
                                                    tokenAmount[token.id] || 0
                                                }
                                                onChange={(e) =>
                                                    changeAmount(
                                                        e.target.value,
                                                        token
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="text-right">
                                            $
                                            {token.price && token.price > 0 ? (
                                                token.price
                                            ) : (
                                                <input
                                                    className="border text-lg font-mono transition-colors w-20 px-2
                                                                border-lm-gray-300 rounded-sm  text-gray-700 bg-white focus:outline-none
                                                                focus:border-purple-primary focus:ring-0 text-center"
                                                    type="number"
                                                    min="0.000000000000001"
                                                    defaultValue={1}
                                                    onChange={(e) => {
                                                        token.price =
                                                            parseFloat(
                                                                e.target.value
                                                            );
                                                        setTokensInfo([
                                                            ...tokensInfo,
                                                        ]);
                                                    }}
                                                />
                                            )}
                                        </td>
                                        <td className="text-right px-4 w-1/5">
                                            ${" "}
                                            {token.price *
                                                tokenAmount[token.id]}
                                        </td>
                                        <td className="text-right px-3">
                                            {selectTokens.length > 1 && (
                                                <img
                                                    src={close}
                                                    alt=""
                                                    className="w-5 h-5 cursor-pointer"
                                                    onClick={() =>
                                                        removeToken(token)
                                                    }
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <button className="btn-primary mt-6" onClick={addToken}>
                            Add Token
                        </button>

                        <div className="flex items-center gap-x-8 mt-10">
                            <div>
                                <h1>Swap fee (%)</h1>
                                <input
                                    className="input-second"
                                    value={swapFees}
                                    type="number"
                                    step="0.0001"
                                    min="0.0001"
                                    max="10"
                                    onChange={(e) => {
                                        if (e.target.value === "") {
                                            return;
                                        }
                                        const val = parseFloat(e.target.value);
                                        setSwapFees(val > 10 ? 10 : val);
                                    }}
                                />
                            </div>
                            <div>
                                <h1>Token symbol</h1>
                                <input
                                    className="input-second"
                                    placeholder="BPT"
                                    onChange={(e) =>
                                        setTokenSymbol(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <h1>Token name</h1>
                                <input
                                    className="input-second"
                                    placeholder="Balance S"
                                    onChange={(e) =>
                                        setTokenName(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <h1>Initial supply</h1>
                                <input
                                    className="input-second"
                                    value={initSupply}
                                    type="number"
                                    min="100"
                                    max="1000000000"
                                    step="100"
                                    onChange={(e) => {
                                        let val = parseInt(e.target.value);
                                        if (val < 100) {
                                            val = 100;
                                        } else {
                                            const v = val % 100;
                                            if (v !== 0) {
                                                val = val - v;
                                            }
                                        }
                                        setInitSupply(val);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="mt-2">
                            <h1 className="mb-2">Rights</h1>
                            <button className="btn-check-box">
                                <label className="cursor-pointer inline-flex items-center select-none text-sm w-full">
                                    <input
                                        type="checkbox"
                                        className="check-box-primary"
                                        onChange={(e) =>
                                            setEnablePauseSwap(e.target.checked)
                                        }
                                    />
                                    <span className="ml-2 overflow-hidden">
                                        Can pause swapping
                                    </span>
                                </label>
                            </button>
                            <button className="btn-check-box">
                                <label className="cursor-pointer inline-flex items-center select-none text-sm w-full">
                                    <input
                                        type="checkbox"
                                        className="check-box-primary"
                                        onChange={(e) =>
                                            setEnableChangeFee(e.target.checked)
                                        }
                                    />
                                    <span className="ml-2 overflow-hidden">
                                        Can change swap fee
                                    </span>
                                </label>
                            </button>
                            <button className="btn-check-box">
                                <label className="cursor-pointer inline-flex items-center select-none text-sm w-full">
                                    <input
                                        type="checkbox"
                                        className="check-box-primary"
                                        onChange={(e) =>
                                            setEnableWhitelist(e.target.checked)
                                        }
                                    />
                                    <span className="ml-2 overflow-hidden">
                                        Restrict LPs to a whitelist
                                    </span>
                                </label>
                            </button>
                            <button className="btn-check-box">
                                <label className="cursor-pointer inline-flex items-center select-none text-sm w-full">
                                    <input
                                        type="checkbox"
                                        className="check-box-primary"
                                        onChange={(e) =>
                                            setEnableChangeSupply(
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <span className="ml-2 overflow-hidden">
                                        Can limit total BPT supply
                                    </span>
                                </label>
                            </button>
                        </div>
                        <div className="mt-6">
                            <button className="btn-check-box">
                                <label className="cursor-pointer inline-flex items-center select-none text-sm w-full">
                                    <input
                                        type="checkbox"
                                        className="check-box-primary"
                                        onChange={(e) =>
                                            setEnableChangeWeights(
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <span className="ml-2 overflow-hidden">
                                        Can change weights
                                    </span>
                                </label>
                            </button>
                            {enableChangeWeights && (
                                <div className="mt-1">
                                    <span className="text-sm block">
                                        Minimum gradual update duration (in
                                        blocks)
                                    </span>
                                    <input
                                        className="input-second py-1"
                                        type="number"
                                        min="0"
                                        step="10"
                                        defaultValue="10"
                                        onChange={(e) =>
                                            setChangeWightBlock(
                                                parseInt(e.target.value)
                                            )
                                        }
                                    />
                                </div>
                            )}
                        </div>
                        <div className="mt-6">
                            <button className="btn-check-box">
                                <label className="cursor-pointer inline-flex items-center select-none text-sm w-full">
                                    <input
                                        type="checkbox"
                                        className="check-box-primary"
                                        onChange={(e) =>
                                            setEnableChangeToken(
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <span className="ml-2 overflow-hidden">
                                        Can change tokens
                                    </span>
                                </label>
                            </button>
                            {enableChangeToken && (
                                <div className="mt-1">
                                    <span className="text-sm block">
                                        Add token time lock (in blocks)
                                    </span>
                                    <input
                                        className="input-second py-1"
                                        type="number"
                                        min="0"
                                        step="10"
                                        defaultValue="10"
                                        onChange={(e) =>
                                            setChangeTokenBlock(
                                                parseInt(e.target.value)
                                            )
                                        }
                                    />
                                </div>
                            )}
                        </div>

                        <div className="pt-5 pb-28">
                            {stepType === "SetProxy" && (
                                <button
                                    className="btn-primary px-4 py-3"
                                    onClick={setupProxy}
                                >
                                    Setup Proxy
                                </button>
                            )}
                            {stepType === "Approve" &&
                                approveTokens.length > 0 && (
                                    <button
                                        className="btn-primary px-4 py-3"
                                        onClick={() =>
                                            approve(approveTokens[0])
                                        }
                                    >
                                        Approve {approveTokens[0].name}
                                    </button>
                                )}
                            {stepType === "Create" && (
                                <button
                                    className="btn-primary px-4 py-3"
                                    onClick={createPool}
                                >
                                    Create
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {showSelectToken && (
                <SelectToken
                    tokensInfo={tokensInfo}
                    addNewToken={addNewToken}
                    close={() => setShowSelectToken(false)}
                    selectedToken={handleSelectToken}
                />
            )}
        </Fragment>
    );
};

export default PoolCreate;
