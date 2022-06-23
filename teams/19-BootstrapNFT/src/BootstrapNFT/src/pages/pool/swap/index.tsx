import arrowDown from "@/assets/icon/arrow-down.svg";
import { useEffect, useMemo, useState } from "react";
import tokenList from "@/config/tokens.json";
import SwapSelectToken from "@/pages/pool/swap/select-token";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { Contract, ethers } from "ethers";
import ERC20ABI from "@/contract/ERC20.json";
import { useWeb3React } from "@web3-react/core";
import rinkebey from "@/config/rinkeby.json";
import { gql, request } from "graphql-request";
import { SOR } from "@balancer-labs/sor";
import { Swap, Pool } from "@balancer-labs/sor/dist/types";
import { scale } from "@/util/utils";

import BN from "bignumber.js";
import Helper from "@/util/help";
import Swapper from "@/util/swapper";
import { useLoading } from "@/context/loading";

let sor: SOR | undefined = undefined;
const PoolSwap = () => {
    const ETH_KEY = "ether";
    const assetInDefaultAddress = "0x6C97D2dda691c7eeeffCF7FF561D9CC596c94739";
    const assetOutDefaultAddress = "0xa3FcE8597Ae238f1050c382f1f94Db8c646529A9";
    const GAS_PRICE = process.env.APP_GAS_PRICE || "100000000000";
    const MAX_POOLS = 4;
    // const sor = useRef<SOR | undefined>(undefined);
    const { active, account, library } = useWeb3React();
    const [, setLoading] = useLoading();
    const [swaps, setSwaps] = useState<Swap[][]>([]);
    const [approves, setApproves] = useState<{ [key: string]: any }>({});
    const [slippage, setSlippage] = useState<any>(0);
    const [swapToAmount, setSwapToAmount] = useState("0.00");
    const [swapFromAmount, setSwapFromAmount] = useState("0.00");
    const [assetInAddress, setAssetInAddress] = useState("");
    const [assetOutAddress, setAssetOutAddress] = useState("");
    const [changeTokenIndex, setChangeTokenIndex] = useState(0);
    const [showSelectToken, setShowSelectToken] = useState(false);
    const [tokenInfoList, setTokenInfoList] = useState<any[]>([]);
    const [swapToToken, setSwapToToken] = useState<{ [key: string]: any }>({});
    const [swapFromToken, setSwapFromToken] = useState<{ [key: string]: any }>(
        {}
    );
    const [tokensBalance, setTokensBalance] = useState<{ [key: string]: any }>(
        {}
    );
    const [balanceInterval, setBalanceInterval] = useState<any>();
    const [sorInterval, setSorInterval] = useState<any>();

    // useMemo(() => {
    //     console.log("callback==========");
    //     if (!sorInterval) {
    //         const sorVal = setInterval(async () => {
    //             if (sor) {
    //                 console.log('[SOR Interval] fetchPools', assetInAddress, assetOutAddress);
    //                 await sor.fetchPools();
    //                 await onInAmountChange(swapFromAmount);
    //             }
    //         }, 60 * 1000);
    //         setSorInterval(sorVal);
    //     }
    //
    //     if (!balanceInterval) {
    //         const balanceVal = setInterval(async () => {
    //             if (active) {
    //                 getBalances();
    //             }
    //         }, 5 * 60 * 1000);
    //         setBalanceInterval(balanceVal);
    //     }
    //
    //     return () => {
    //         if (sorInterval) {
    //             clearInterval(sorInterval);
    //         }
    //         if (balanceInterval) {
    //             clearInterval(balanceInterval);
    //         }
    //     };
    // }, []);

    useEffect(() => {
        (async () => {
            sor = undefined;
            const tokens = tokenList.tokens as unknown as {
                [key: string]: any;
            };
            const tokenInfo: any[] = [];
            Object.keys(tokens).forEach((key) => {
                tokenInfo.push(tokens[key] as any);
            });
            console.log("tokenInfo", tokenInfo);
            await getPrice(tokenInfo);
            setTimeout(() => {
                initSor();
            }, 1000);
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!active || tokenInfoList.length === 0) {
            return;
        }
        getBalances();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, account, tokenInfoList]);

    const getBalances = async () => {
        const balances: { [key: string]: any } = {};
        await Promise.all(
            tokenInfoList.map(async (token: any) => {
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
        ).then(() => {
            setTokensBalance(balances);
        });
    };

    useEffect(() => {
        if (assetInAddress) {
            getApprove();
        }

        if (assetInAddress && sor) {
            console.log("effect asset in address change===========");
            onOutAmountChange(swapToAmount);
        }
    }, [assetInAddress]);

    useEffect(() => {
        (async () => {
            if (assetInAddress && sor) {
                console.log("effect asset out address change===========");
                const address =
                    assetOutAddress === ETH_KEY
                        ? rinkebey.addresses.weth
                        : assetOutAddress;
                console.log("handle select token address", address);
                await sor.setCostOutputToken(address);
                onInAmountChange(swapFromAmount);
            }
        })();
    }, [assetOutAddress]);

    const changeToken = (index: number) => {
        setChangeTokenIndex(index);
        setShowSelectToken(true);
    };

    const getPrice = async (tokens: any[]) => {
        // document.title = "Create Pool";
        const idString = "weth,dai,usd-coin,balancer";
        const ENDPOINT = "https://api.coingecko.com/api/v3";
        const url = `${ENDPOINT}/simple/price?ids=${idString}&vs_currencies=usd`;
        const response = await fetch(url);
        const data = await response.json();
        const temp = tokens.map((token: any) => {
            token.price = data[token.id] ? data[token.id].usd : 0;
            return token;
        });
        setTokenInfoList(temp);
        temp.forEach((token: any) => {
            if (token.address === assetInDefaultAddress) {
                setSwapFromToken(token);
                setAssetInAddress(token.address);
            } else if (token.address === assetOutDefaultAddress) {
                setSwapToToken(token);
                setAssetOutAddress(token.address);
            }
        });
    };

    const handleSelectToken = async (token: any) => {
        if (changeTokenIndex === 1) {
            setAssetInAddress(token.address);
            setSwapFromToken({ ...token });
            setSwapFromAmount("0.00");
        } else if (changeTokenIndex === 2) {
            setSwapToToken({ ...token });
            setAssetOutAddress(token.address);
            setSwapToAmount("0.00");
        }
        setChangeTokenIndex(0);
    };

    const getBalance = async (token: any) => {
        const contract = new Contract(
            token.address,
            ERC20ABI,
            library.getSigner()
        );
        return await contract.balanceOf(account);
    };

    const initSor = async () => {
        const poolsUrl = `${
            rinkebey.subgraphBackupUrl
        }?timestamp=${Date.now()}`;
        //TODO read from subgraph
        const pools = await getPools({});
        sor = new SOR(
            library,
            new BN(GAS_PRICE),
            MAX_POOLS,
            rinkebey.chainId,
            poolsUrl
        );

        sor.pools.getAllPublicSwapPools = function (url: any): any {
            return { pools };
        };

        console.log("pools==========", pools, rinkebey.addresses.sorMulticall);
        if (rinkebey.addresses.sorMulticall) {
            sor.MULTIADDR[rinkebey.chainId] = rinkebey.addresses.sorMulticall;
        }
        console.time(`[SOR] setCostOutputToken: ${assetOutAddress}`);
        await sor.setCostOutputToken(assetOutAddress);
        console.timeEnd(`[SOR] setCostOutputToken: ${assetOutAddress}`);
        console.time(
            `[SOR] fetchFilteredPairPools: ${assetInAddress}, ${assetOutAddress}`
        );
        await sor.fetchFilteredPairPools(assetInAddress, assetOutAddress);
        console.timeEnd(
            `[SOR] fetchFilteredPairPools: ${assetInAddress}, ${assetOutAddress}`
        );
        await onInAmountChange(swapFromAmount);
        console.time("[SOR] fetchPools");
        await sor.fetchPools();
        console.timeEnd("[SOR] fetchPools");
        await onInAmountChange(swapFromAmount);
        pools.value = sor.onChainCache.pools;
        console.log("init sor", sor);
    };

    const onInAmountChange = async (amount: string) => {
        console.log("on in amount change");
        if (isWrapPair(assetInAddress, assetOutAddress)) {
            setSwapFromAmount(amount);
            setSwaps([]);
            return;
        }

        const inAddress =
            assetInAddress === ETH_KEY
                ? rinkebey.addresses.weth
                : assetInAddress;
        const outAddress =
            assetOutAddress === ETH_KEY
                ? rinkebey.addresses.weth
                : assetOutAddress;

        if (assetInAddress === assetOutAddress) {
            console.log(
                "in amount address eq",
                assetInAddress,
                assetOutAddress
            );
            return;
        }

        if (!sor || !sor.hasDataForPair(inAddress, outAddress)) {
            // swapsLoading.value = true;
            return;
        }

        if (sor) {
            console.log("sor=======", sor);
        }

        const assetInDecimals = swapFromToken.decimals;
        const assetOutDecimals = swapToToken.decimals;

        // swapsLoading.value = true;
        const assetInAmountRaw = new BN(amount);
        const assetInAmount = scale(assetInAmountRaw, assetInDecimals);

        console.log("assetInAmount", assetInAmount);

        console.time(
            `[SOR] getSwaps ${assetInAddress} ${assetOutAddress} exactIn`
        );
        const [tradeSwaps, tradeAmount, spotPrice] = await sor.getSwaps(
            assetInAddress,
            assetOutAddress,
            "swapExactIn",
            assetInAmount
        );
        console.log(
            "tradeSwaps",
            tradeSwaps,
            tradeAmount.toString(),
            spotPrice.toString()
        );
        console.timeEnd(
            `[SOR] getSwaps ${assetInAddress} ${assetOutAddress} exactIn`
        );
        setSwaps(tradeSwaps);
        const assetOutAmountRaw = scale(tradeAmount, -assetOutDecimals);
        const assetOutPrecision = rinkebey.defaultPrecision;
        console.log(
            "assetOutAmountRaw===",
            assetOutAmountRaw.toFixed(assetOutPrecision, BN.ROUND_DOWN)
        );
        setSwapToAmount(
            assetOutAmountRaw.toFixed(assetOutPrecision, BN.ROUND_DOWN)
        );
        if (tradeSwaps.length === 0) {
            setSlippage(0);
        } else {
            const price = assetInAmount.div(tradeAmount).times("1e18");
            const slippageNumber = price.div(spotPrice).minus(1);
            setSlippage(
                slippageNumber.isNegative()
                    ? 0.00001
                    : slippageNumber.toNumber()
            );
        }
        // swapsLoading.value = false;
    };

    const onOutAmountChange = async (amount: string) => {
        if (isWrapPair(assetInAddress, assetOutAddress)) {
            setSwapToAmount(amount);
            setSwaps([]);
            return;
        }

        const inAddress =
            assetInAddress === ETH_KEY
                ? rinkebey.addresses.weth
                : assetInAddress;
        const outAddress =
            assetOutAddress === ETH_KEY
                ? rinkebey.addresses.weth
                : assetOutAddress;

        if (assetInAddress === assetOutAddress) {
            console.log("out amount address eq");
            return;
        }

        if (!sor || !sor.hasDataForPair(inAddress, outAddress)) {
            // swapsLoading.value = true;
            return;
        }

        const assetInDecimals = swapFromToken.decimals;
        const assetOutDecimals = swapToToken.decimals;

        // swapsLoading.value = true;
        const assetOutAmountRaw = new BN(amount);
        const assetOutAmount = scale(assetOutAmountRaw, assetOutDecimals);

        console.time(
            `[SOR] getSwaps ${assetInAddress} ${assetOutAddress} exactOut`
        );
        const [tradeSwaps, tradeAmount, spotPrice] = await sor.getSwaps(
            assetInAddress,
            assetOutAddress,
            "swapExactOut",
            assetOutAmount
        );
        console.timeEnd(
            `[SOR] getSwaps ${assetInAddress} ${assetOutAddress} exactOut`
        );
        console.log(
            "out amount change:",
            tradeSwaps,
            tradeAmount.toString(),
            spotPrice.toString()
        );
        setSwaps(tradeSwaps);
        const assetInAmountRaw = scale(tradeAmount, -assetInDecimals);
        const assetInPrecision = rinkebey.defaultPrecision;
        setSwapFromAmount(
            assetInAmountRaw.toFixed(assetInPrecision, BN.ROUND_UP)
        );
        console.log(
            "amount out",
            assetInAmountRaw.toFixed(assetInPrecision, BN.ROUND_UP)
        );

        if (tradeSwaps.length === 0) {
            setSlippage(0);
        } else {
            const price = tradeAmount.div(assetOutAmount).times("1e18");
            const slippageNumber = price.div(spotPrice).minus(1);
            setSlippage(
                slippageNumber.isNegative()
                    ? 0.00001
                    : slippageNumber.toNumber()
            );
        }
        // swapsLoading.value = false;
    };

    function isWrapPair(assetIn: string, assetOut: string): boolean {
        if (assetIn === ETH_KEY && assetOut === rinkebey.addresses.weth) {
            return true;
        }
        if (assetOut === ETH_KEY && assetIn === rinkebey.addresses.weth) {
            return true;
        }
        return false;
    }

    async function getPools(payload: any): Promise<any> {
        const {
            first = 20,
            page = 1,
            orderBy = "liquidity",
            orderDirection = "desc",
            where = {},
        } = payload;

        const skip = (page - 1) * first;

        const ts = Math.round(new Date().getTime() / 1000);
        const tsYesterday = ts - 24 * 3600;
        // Round timestamp by hour to leverage subgraph cache
        const tsYesterdayRounded = Math.round(tsYesterday / 3600) * 3600;

        const query = gql`
            query {
                pools(
                    where: { active: true, tokensCount_gt: 1 }
                    first: 20
                    skip: 0
                    orderBy: "liquidity"
                    orderDirection: "desc"
                ) {
                    id
                    publicSwap
                    finalized
                    crp
                    rights
                    swapFee
                    totalWeight
                    totalShares
                    totalSwapVolume
                    liquidity
                    tokensList
                    swapsCount
                    tokens(orderBy: "denormWeight", orderDirection: "desc") {
                        id
                        address
                        balance
                        decimals
                        symbol
                        denormWeight
                    }
                }
            }
        `;
        // commit('GET_POOLS_REQUEST');
        try {
            const res = await request(rinkebey.subgraphUrl, query);
            const pools = res.pools.map((pool: any) => formatPool(pool));
            return pools;
        } catch (e) {
            console.error(e);
        }
    }

    const formatPool = (pool: any) => {
        // let colorIndex = 0;
        pool.tokens = pool.tokens.map((token: any) => {
            token.checksum = ethers.utils.getAddress(token.address);
            token.weightPercent = (100 / pool.totalWeight) * token.denormWeight;
            return token;
        });
        if (pool.shares) pool.holders = pool.shares.length;
        //pool.tokensList = pool.tokensList.map((token: any) => getAddress(token));
        pool.lastSwapVolume = 0;
        const poolTotalSwapVolume =
            pool.swaps && pool.swaps[0] && pool.swaps[0].poolTotalSwapVolume
                ? parseFloat(pool.swaps[0].poolTotalSwapVolume)
                : 0;
        pool.lastSwapVolume =
            parseFloat(pool.totalSwapVolume) - poolTotalSwapVolume;
        return pool;
    };

    const swap = async () => {
        const assetInAmount = scale(
            new BN(swapFromAmount),
            swapFromToken.decimals
        );
        if (isWrapPair(assetInAddress, assetOutAddress)) {
            if (assetInAddress === ETH_KEY) {
                const tx = await Helper.wrap(library, assetInAmount);
                const text = "Wrap ether";
                await handleTransaction(tx, text);
            } else {
                const tx = await Helper.unwrap(library, assetInAmount);
                const text = "Unwrap ether";
                await handleTransaction(tx, text);
            }
            return;
        }

        const assetInSymbol = swapFromToken.symbol;
        const assetOutSymbol = swapToToken.symbol;
        const text = `Swap ${assetInSymbol} for ${assetOutSymbol}`;

        const assetOutAmount = scale(
            new BN(swapToAmount),
            swapToToken.decimals
        );
        const minAmount = assetOutAmount
            .div(1 + slippage)
            .integerValue(BN.ROUND_DOWN);
        try {
            setLoading(true);
            const tx = await Swapper.swapIn(
                library,
                swaps,
                assetInAddress,
                assetOutAddress,
                assetInAmount,
                minAmount
            );
            await handleTransaction(tx, text);
            setSwapFromAmount("0.00");
            setSwapToAmount("0.00");
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.log("swap err:", e);
        }
    };

    const handleTransaction = async (transaction: any, text: string) => {
        if (transaction.code) {
            if (transaction.code === "UNPREDICTABLE_GAS_LIMIT") {
                console.log("warning", text);
            }
            return;
        }

        console.log("保存交易：", transaction, text);

        const transactionReceipt = await library.waitForTransaction(
            transaction.hash,
            1
        );

        console.log(
            "saveMinedTransaction receipt:",
            transactionReceipt,
            Date.now()
        );

        const type = transactionReceipt.status === 1 ? "success" : "error";
    };

    const isApprove = () => {
        if (!assetInAddress) {
            return true;
        }
        if (assetInAddress === ETH_KEY) {
            return true;
        }
        if (isWrapPair(assetInAddress, assetOutAddress)) {
            return true;
        }

        const ap = approves[swapFromToken.symbol];
        if (ap) {
            return ap.isApprove;
        }
        return false;
    };

    const getApprove = async () => {
        const exchangeProxyAddress = rinkebey.addresses.exchangeProxy;
        const contract = new Contract(
            assetInAddress,
            ERC20ABI,
            library.getSigner()
        );
        await contract
            .allowance(account, exchangeProxyAddress)
            .then((res: any) => {
                const approveItem = {
                    isApprove: res > 0,
                    limit: res,
                };
                const tempApproves = approves;
                tempApproves[swapFromToken.symbol] = approveItem;
                setApproves({ ...tempApproves });
            })
            .catch((err: any) => {
                console.log("tokensAllowance err", err);
            });
    };

    const approve = async () => {
        setLoading(true);
        const exchangeProxyAddress = rinkebey.addresses.exchangeProxy;
        const contract = new Contract(
            assetInAddress,
            ERC20ABI,
            library.getSigner()
        );
        try {
            const tx = await contract.approve(
                exchangeProxyAddress,
                ethers.constants.MaxUint256
            );
            await tx
                .wait()
                .then((res: any) => {
                    const approveItem = {
                        isApprove: true,
                        limit: ethers.constants.MaxUint256,
                    };
                    const tempApproves = approves;
                    tempApproves[swapFromToken.symbol] = approveItem;
                    setApproves({ ...tempApproves });
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

    const addNewToken = async (token: any, balance: any) => {
        console.log("add new token:", token, balance);
        tokenInfoList.push(token);
        setTokenInfoList([...tokenInfoList]);
        tokensBalance[token.address] = balance;
        setTokensBalance({ ...tokensBalance });
    };

    return (
        <main className="flex-1 flex flex-col px-4 xl:px-8 2xl:p-12 pt-12 pb-28 text-purple-second">
            <section className="relative filter z-10 mx-auto bg-blue-primary top-8 rounded-2xl ">
                <div className="flex flex-col gap-3 p-2 md:p-4 pt-4 bg-dark-800 shadow-md shadow-dark-1000">
                    <div className="px-2">
                        <div className="flex items-center justify-between gap-1">
                            <div className="flex gap-4">
                                <div
                                    className="text-base leading-5 font-bold cursor-pointer select-none
                                    text-secondary hover:text-white"
                                >
                                    Swap
                                </div>
                            </div>
                            <div className="flex gap-4"></div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div
                            className="border-purple-primary border-opacity-50 hover:border-opacity-100 rounded-lg
                            border bg-[#181141] p-3 flex flex-col gap-4"
                        >
                            <div
                                className="flex items-center justify-between gap-2 w-max"
                                onClick={() => changeToken(1)}
                            >
                                {swapFromToken ? (
                                    <div
                                        className="flex items-center bg-purple-second bg-opacity-30 hover:bg-dark-700 cursor-pointer
                                            gap-2 px-2 py-2 rounded-full shadow-md"
                                    >
                                        <div className="rounded-full">
                                            <div className="overflow-hidden rounded w-5 h-5">
                                                {swapFromToken.logoUrl ? (
                                                    <img
                                                        alt={
                                                            swapFromToken.symbol
                                                        }
                                                        src={
                                                            swapFromToken.logoUrl
                                                        }
                                                        decoding="async"
                                                        data-nimg="fixed"
                                                        className="rounded-full !rounded-full overflow-hidden"
                                                    />
                                                ) : swapFromToken.address ? (
                                                    <Jazzicon
                                                        diameter={20}
                                                        seed={jsNumberForAddress(
                                                            swapToToken.address
                                                        )}
                                                    />
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-sm leading-5 font-bold text-xl text-white">
                                            {swapFromToken.name}
                                        </div>
                                        <img
                                            src={arrowDown}
                                            alt="arrow down"
                                            className="w-5 h-5 transform rotate-90"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <button
                                            className="btn-primary"
                                            onClick={() =>
                                                setShowSelectToken(true)
                                            }
                                        >
                                            Select a Token
                                            <img
                                                src={arrowDown}
                                                alt="arrow down"
                                                className="w-5 h-5"
                                            />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-1 justify-between items-baseline px-1.5">
                                <div
                                    className="text-2xl leading-7 tracking-[-0.01em] font-bold relative flex items-baseline
                                flex-grow gap-3 overflow-hidden"
                                >
                                    <input
                                        title="Token Amount"
                                        autoComplete="off"
                                        autoCorrect="off"
                                        type="text"
                                        pattern="^[0-9]*[.,]?[0-9]*$"
                                        placeholder="0.00"
                                        min="0"
                                        minLength={1}
                                        maxLength={79}
                                        spellCheck="false"
                                        className="relative font-bold outline-none border-none flex-auto overflow-hidden
                                            overflow-ellipsis focus:placeholder-primary leading-[36px] flex-grow w-full
                                            text-left bg-transparent text-inherit disabled:cursor-not-allowed"
                                        value={swapFromAmount || "0.00"}
                                        onChange={(e) => {
                                            setSwapFromAmount(e.target.value);
                                            onInAmountChange(e.target.value);
                                        }}
                                    />
                                    <span
                                        className="text-xs leading-4 font-medium text-secondary absolute bottom-1.5
                                    pointer-events-none left-32"
                                    >
                                        ~$ {swapFromToken.price}
                                    </span>
                                </div>
                                <div
                                    className="text-sm leading-5 font-medium cursor-pointer select-none flex whitespace-nowrap"
                                    role="button"
                                >
                                    Balance:{" "}
                                    {tokensBalance[swapFromToken.address]
                                        ? tokensBalance[swapFromToken.address]
                                        : "0.00"}
                                </div>
                            </div>
                        </div>
                        <div className="z-0 flex justify-center -mt-6 -mb-6">
                            <div
                                role="button"
                                className="p-1.5 rounded-full bg-dark-800 border shadow-md
                                border-purple-primary border-opacity-50 hover:border-opacity-100 hover:bg-purple-primary"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    width="14"
                                    className="text-high-emphesis hover:text-white"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                        <div
                            className="border-purple-primary border-opacity-50 hover:border-opacity-100 rounded-lg
                            border bg-[#181141] p-3 flex flex-col gap-4"
                        >
                            <div
                                className="flex items-center justify-between gap-x-2 leading-7 w-max"
                                onClick={() => changeToken(2)}
                            >
                                {swapToToken ? (
                                    <div
                                        className="flex items-center bg-purple-second bg-opacity-30 hover:bg-dark-700 cursor-pointer
                                                gap-2 px-2 py-2 rounded-full shadow-md"
                                    >
                                        <div className="rounded-full">
                                            <div className="overflow-hidden rounded w-5 h-5">
                                                {swapToToken.logoUrl ? (
                                                    <img
                                                        alt={swapToToken.symbol}
                                                        src={
                                                            swapToToken.logoUrl
                                                        }
                                                        decoding="async"
                                                        data-nimg="fixed"
                                                        className="rounded-full !rounded-full overflow-hidden"
                                                    />
                                                ) : swapToToken.address ? (
                                                    <Jazzicon
                                                        diameter={20}
                                                        seed={jsNumberForAddress(
                                                            swapToToken.address
                                                        )}
                                                    />
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-sm leading-5 font-bold text-xl text-white">
                                            {swapToToken.name}
                                        </div>
                                        <img
                                            src={arrowDown}
                                            alt="arrow down"
                                            className="w-5 h-5 transform rotate-90"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <button className="btn-primary">
                                            Select a Token
                                            <img
                                                src={arrowDown}
                                                alt="arrow down"
                                                className="w-5 h-5"
                                            />
                                        </button>
                                    </div>
                                )}
                                {slippage !== 0 &&
                                    (slippage < 0.01 ? (
                                        <span className="text-sm text-emerald-primary">
                                            Price impact: 0.01%
                                        </span>
                                    ) : (
                                        <span className="text-sm text-emerald-primary">
                                            Price impact:{" "}
                                            {(slippage * 100).toFixed(2)}%
                                        </span>
                                    ))}
                            </div>
                            <div className="flex gap-1 justify-between items-baseline px-1.5">
                                <div
                                    className="text-2xl leading-7 tracking-[-0.01em] font-bold relative flex items-baseline
                                flex-grow gap-3 overflow-hidden"
                                >
                                    <input
                                        title="Token Amount"
                                        autoComplete="off"
                                        autoCorrect="off"
                                        type="text"
                                        pattern="^[0-9]*[.,]?[0-9]*$"
                                        placeholder="0.00"
                                        min="0"
                                        minLength={1}
                                        maxLength={79}
                                        spellCheck="false"
                                        className="relative font-bold outline-none border-none flex-auto overflow-hidden
                                            overflow-ellipsis focus:placeholder-primary leading-[36px] flex-grow w-full
                                            text-left bg-transparent text-inherit disabled:cursor-not-allowed"
                                        value={swapToAmount || "0.00"}
                                        onChange={(e) => {
                                            setSwapToAmount(e.target.value);
                                            onOutAmountChange(e.target.value);
                                        }}
                                    />
                                    <span
                                        className="text-xs leading-4 font-medium text-secondary absolute bottom-1.5
                                    pointer-events-none left-32"
                                    >
                                        ~$ {swapToToken.price}
                                    </span>
                                </div>
                                <div
                                    className="text-sm leading-5 font-medium cursor-pointer select-none flex whitespace-nowrap"
                                    role="button"
                                >
                                    Balance:{" "}
                                    {tokensBalance[swapToToken.address]
                                        ? tokensBalance[swapToToken.address]
                                        : "0.00"}
                                </div>
                            </div>
                        </div>
                    </div>
                    {parseFloat(swapFromAmount) > 0 &&
                        parseFloat(swapToAmount) > 0 && (
                            <div
                                className="flex items-center justify-between mt-2 border border-purple-primary
                                border-opacity-70 rounded-lg py-2 px-4 text-sm bg-[#181141]"
                            >
                                <div className="">
                                    1 {swapFromToken.name} ={" "}
                                    {parseFloat(swapToAmount) /
                                        parseFloat(swapFromAmount)}{" "}
                                    {swapToToken.name}
                                    &nbsp; ($ {swapFromToken.price})
                                </div>
                                <div>
                                    <img
                                        src={arrowDown}
                                        alt="arrow down"
                                        className="w-5 h-5 transform rotate-90 cursor-pointer"
                                    />
                                </div>
                            </div>
                        )}
                    <div className="mx-auto mt-6 mb-6 w-11/12">
                        {isApprove() ? (
                            <button
                                className="w-full py-3 bg-gradient-to-r from-purple-primary to-pink-600 rounded-xl
                                    text-white hover:from-purple-900 hover:to-pink-700 disabled:opacity-75"
                                disabled={parseFloat(swapFromAmount) <= 0}
                                onClick={swap}
                            >
                                Swap
                            </button>
                        ) : (
                            <button
                                className="w-full py-3 bg-gradient-to-r from-purple-primary to-pink-600 rounded-xl
                                    text-white hover:from-purple-900 hover:to-pink-700 disabled:opacity-75"
                                disabled={parseFloat(swapFromAmount) <= 0}
                                onClick={approve}
                            >
                                Unlock
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {showSelectToken && (
                <SwapSelectToken
                    tokensInfo={tokenInfoList}
                    addNewToken={addNewToken}
                    close={() => setShowSelectToken(false)}
                    selectedToken={handleSelectToken}
                />
            )}
        </main>
    );
};

export default PoolSwap;
