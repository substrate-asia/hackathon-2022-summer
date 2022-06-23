import { Fragment, useEffect, useState } from "react";
import { gql, request } from "graphql-request";
import rinkby from "@/config/rinkeby.json";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { truncateAddress } from "@/util/address";
import Liquidity from "@/pages/pool/manage/liquidity";
import Tokens from "@/config/tokens.json";
import { Contract, ethers } from "ethers";
import { useParams } from "react-router";
import rinkeby from "@/config/rinkeby.json";
import DSProxyRegistryABI from "@/contract/pool/DSProxyRegistry.json";
import { useWeb3React } from "@web3-react/core";
import SwapFee from "@/pages/pool/manage/swap-fee";
import SwapPause from "@/pages/pool/manage/swap-pause";
import ChangeTokenWeight from "@/pages/pool/manage/token-weight";
import ChangeToken from "@/pages/pool/manage/change-token";
import ChangeCap from "@/pages/pool/manage/cap";
import ChangeWhiteList from "@/pages/pool/manage/whitelist";
import ChangeController from "@/pages/pool/manage/controller";
import ConfigurableRightsPoolABI from "@/contract/pool/ConfigurableRightsPool.json";
import MulticalABI from "@/contract/pool/Multical.json";
import { Interface } from "ethers/lib/utils";
import ERC20ABI from "@/contract/ERC20.json";
import GradualWeight from "@/pages/pool/manage/gradual-weight";

const enum InfoBtn {
    Swap = "swap",
    Balance = "balance",
    About = "about",
    Setting = "setting",
}

const PoolManage = () => {
    const params = useParams();
    const [cap, setCap] = useState(0);
    const { active, account, library } = useWeb3React();
    const [totalShares, setTotalShares] = useState(0);
    const [pool, setPool] = useState<any>(undefined);
    const [swaps, setSwaps] = useState<any[]>([]);
    const [proxyAddress, setProxyAddress] = useState("");
    const [infoBtn, setInfoBtn] = useState<InfoBtn>(InfoBtn.Balance);
    const [openLiquidity, setOpenLiquidity] = useState(false);
    const [openChangeCap, setOpenChangeCap] = useState(false);
    const [openChangeToken, setOpenChangeToken] = useState(false);
    const [openGradualWeight, setOpenGradualWeight] = useState(false);
    const [openChangeSwapFee, setOpenChangeSwapFee] = useState(false);
    const [openChangeWhitelist, setOpenChangeWhitelist] = useState(false);
    const [openChangePublicSwap, setOpenChangePublicSwap] = useState(false);
    const [openChangeTokenWeight, setOpenChangeTokenWeight] = useState(false);
    const [openChangeController, setOpenChangeController] = useState(false);
    const [changeWeightBlockNum, setChangeWeightBlockNum] = useState<any>();

    useEffect(() => {
        getProxyAddress();
        getInfo();
        getSwap();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, account]);

    useEffect(() => {
        if (pool && active) {
            getMetaData();

            const newPool = pool;
            Promise.all(
                pool.tokens.map(async (token: any) => {
                    const contract = new Contract(
                        token.address,
                        ERC20ABI,
                        library.getSigner()
                    );
                    await contract
                        .balanceOf(params.address)
                        .then((res: any) => {
                            token.balance = ethers.utils.formatUnits(
                                res.toString(),
                                token.decimals
                            );
                            console.log(
                                "balanceOf",
                                ethers.utils.formatEther(res.toString())
                            );
                        })
                        .catch((err: any) => {
                            console.log("balanceOf err", err);
                        });
                    return token;
                })
            )
                .then((res) => {
                    newPool.tokens = res;
                    console.log("balanceOf result:", res);
                    setPool(newPool);
                })
                .catch((err) => {
                    console.log("get tokens balance err", err);
                });
        }
    }, [pool, active]);

    const getInfo = () => {
        const query = gql`
      {
        pool(id: "${params.address}") {
          id
          active
          cap
          controller
          finalized
          crp
          swapFee
          totalWeight
          totalSwapVolume
          totalSwapFee
          createTime
          joinsCount
          exitsCount
          liquidity
          tokensList
          swapsCount
          holdersCount
          tx
          rights
          controller
          crpController
          cap
          createTime
          name
          symbol
          tokens(orderBy: "denormWeight", orderDirection: "desc") {
            id
            address
            balance
            decimals
            symbol
            denormWeight
          }
          swaps(
            first: 1
            orderBy: "timestamp"
            orderDirection: "desc"
            where: { timestamp_lt: 1655011996 }
          ) {
            poolTotalSwapVolume
          }
        }
      }
    `;
        request(rinkby.subgraphUrl, query).then((data) => {
            const tokenInfo = Tokens.tokens as unknown as {
                [key: string]: any;
            };
            data.pool.tokens.map((token: any) => {
                const address = ethers.utils.getAddress(token.address);
                token.color = tokenInfo[address]
                    ? tokenInfo[address]["color"]
                    : "#7ada6a";
                return token;
            });
            console.log("get pool info:", data);
            setPool(data.pool);
        });
    };

    const getSwap = () => {
        const query = gql`
      {
        swaps(
          where: { poolAddress: "${params.address}" }
          first: 20
          skip: 0
          orderBy: "timestamp"
          orderDirection: "desc"
        ) {
          id
          tokenIn
          tokenInSym
          tokenAmountIn
          tokenOut
          tokenOutSym
          tokenAmountOut
          poolTotalSwapVolume
          timestamp
          value
          feeValue
        }
      }
    `;

        request(rinkby.subgraphUrl, query).then((data) => {
            console.log(data);
            setSwaps(data.swaps);
        });
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
            setProxyAddress(res);
        });
    };

    const getMetaData = async () => {
        const [
            publicSwap,
            name,
            decimals,
            symbol,
            totalShares,
            rights,
            bspCap,
            crpController,
            minimumWeightChangeBlockPeriod,
            addTokenTimeLockInBlocks,
            { startBlock, endBlock },
        ] = await multicall(
            ConfigurableRightsPoolABI,
            [
                "isPublicSwap",
                "name",
                "decimals",
                "symbol",
                "totalSupply",
                "rights",
                "bspCap",
                "getController",
                "minimumWeightChangeBlockPeriod",
                "addTokenTimeLockInBlocks",
                "gradualUpdate",
            ].map((method) => [pool.controller, method, []])
        );

        console.log(
            "ccc",
            publicSwap,
            name,
            decimals,
            symbol,
            totalShares,
            rights,
            bspCap.toString(),
            crpController,
            minimumWeightChangeBlockPeriod,
            addTokenTimeLockInBlocks,
            startBlock,
            endBlock
        );

        setCap(parseInt(ethers.utils.formatEther(bspCap.toString())));
        setTotalShares(
            parseInt(ethers.utils.formatEther(totalShares.toString()))
        );
        setChangeWeightBlockNum(minimumWeightChangeBlockPeriod);
    };

    const multicall = async (abi: any[], calls: any[], options?: any) => {
        const multi = new Contract(
            rinkeby.addresses.multicall,
            MulticalABI,
            library.getSigner()
        );
        const itf = new Interface(abi);
        try {
            const [, response] = await multi.aggregate(
                calls.map((call) => [
                    call[0].toLowerCase(),
                    itf.encodeFunctionData(call[1], call[2]),
                ]),
                options || {}
            );
            return response.map((call: any, i: number) =>
                itf.decodeFunctionResult(calls[i][1], call)
            );
        } catch (e) {
            return Promise.reject();
        }
    };

    return (
        <Fragment>
            <main className="flex-1 flex flex-col px-4 xl:px-8 2xl:p-12 2xl:pb-28 py-12 text-purple-second">
                <section>
                    <header>
                        <h1 className="font-bold text-3xl mb-2">
                            Explore Pool
                        </h1>
                        {/*<p className="mb-4">Browse the decentralized NFT marketplace.</p>*/}
                    </header>
                    <div className="bg-gradient-to-r from-transparent to-purple-primary h-px mb-4"></div>
                </section>
                <section>
                    <header className="flex justify-between items-center">
                        <div className="flex gap-x-2 items-center">
                            <img
                                src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png"
                                alt=""
                                className="h-8 w-8"
                            />
                            <div>
                                <div className="flex gap-x-2">
                                    {pool && (
                                        <h3>
                                            {pool.name} ({pool.symbol})
                                        </h3>
                                    )}
                                    <span className="inline-block border border-emerald-primary rounded-full text-xs px-2">
                                        smart pool
                                    </span>
                                </div>
                                <p>$0.1277</p>
                            </div>
                        </div>
                        <div className="flex gap-x-2">
                            <button
                                className="inline-flex items-center justify-center outline-none font-medium
                                rounded-md break-word hover:outline focus:outline-none focus:ring-1 focus:ring-opacity-75
                                p-2 bg-gradient-to-b from-purple-primary to-purple-900 text-white hover:from-purple-primary
                                hover:to-purple-primary focus:ring-pink-500 text-sm"
                                onClick={() => setOpenLiquidity(true)}
                            >
                                Add liquidity
                            </button>
                            <button
                                className="inline-flex items-center justify-center outline-none font-medium
                                rounded-md break-word hover:outline focus:outline-none focus:ring-1 focus:ring-opacity-75
                                p-2 bg-gradient-to-b hover:from-purple-primary border border-purple-primary text-purple-primary
                                hover:to-purple-primary focus:ring-pink-500 text-sm hover:text-purple-second"
                            >
                                Remove liquidity
                            </button>
                        </div>
                    </header>
                    <div className="flex flex-1 justify-between flex-nowrap mt-5">
                        <div className="bg-blue-primary rounded-lg h-32 w-1/5 flex justify-center items-center flex-col">
                            <h1 className="font-bold text-2xl">$134.2M</h1>
                            <h3>Liquidity</h3>
                        </div>

                        <div className="bg-blue-primary rounded-lg h-32 w-1/5 flex justify-center items-center flex-col">
                            <h1 className="font-bold text-2xl">$134.2M</h1>
                            <h3>Volume (24h)</h3>
                        </div>

                        <div className="bg-blue-primary rounded-lg h-32 w-1/5 flex justify-center items-center flex-col">
                            <h1 className="font-bold text-2xl">$134.2M</h1>
                            <h3>Swap fee</h3>
                        </div>

                        <div className="bg-blue-primary rounded-lg h-32 w-1/5 flex justify-center items-center flex-col">
                            <h1 className="font-bold text-2xl">$134.2M</h1>
                            <h3>My pool share</h3>
                        </div>
                    </div>

                    <div>
                        <div className="flex gap-x-10 mt-5 px-2">
                            <div
                                className="py-2 hover:text-purple-primary cursor-pointer text-purple-primary
                                border-b border-purple-primary border-b-2"
                            >
                                Liquidity
                            </div>
                            <div className="py-2 hover:text-purple-primary cursor-pointer">
                                Volume
                            </div>
                            <div className="py-2 hover:text-purple-primary cursor-pointer">
                                Fee returns
                            </div>
                        </div>
                        <div className="bg-blue-primary h-72 w-full rounded-lg"></div>
                    </div>

                    <div>
                        <div className="flex gap-x-10 mt-5 px-2">
                            <div
                                className={`py-2 hover:text-purple-primary cursor-pointer flex items-center gap-x-1
                                ${
                                    infoBtn === InfoBtn.Balance
                                        ? "border-b-2 text-purple-primary border-b border-purple-primary"
                                        : ""
                                }`}
                                onClick={() => setInfoBtn(InfoBtn.Balance)}
                            >
                                Balance{" "}
                                <span
                                    className="inline-block border border-purple-primary
                                    text-purple-primary rounded-full w-4 h-4 text-xs text-center leading-3"
                                >
                                    {pool && pool.tokens.length}
                                </span>
                            </div>
                            <div
                                className={`py-2 hover:text-purple-primary cursor-pointer flex items-center gap-x-1
                                ${
                                    infoBtn === InfoBtn.Swap
                                        ? "border-b-2 text-purple-primary border-b border-purple-primary"
                                        : ""
                                }`}
                                onClick={() => setInfoBtn(InfoBtn.Swap)}
                            >
                                Swap{" "}
                                {swaps.length > 0 && (
                                    <span
                                        className="inline-block border border-purple-primary
                                    text-purple-primary rounded-full w-4 h-4 text-xs text-center leading-3"
                                    >
                                        {swaps.length}
                                    </span>
                                )}
                            </div>
                            <div
                                className={`py-2 hover:text-purple-primary cursor-pointer
                                ${
                                    infoBtn === InfoBtn.About
                                        ? "border-b-2 text-purple-primary border-b border-purple-primary"
                                        : ""
                                }`}
                                onClick={() => setInfoBtn(InfoBtn.About)}
                            >
                                About
                            </div>
                            {pool &&
                                proxyAddress.toLowerCase() ===
                                    pool.crpController && (
                                    <div
                                        className={`py-2 hover:text-purple-primary cursor-pointer
                                ${
                                    infoBtn === InfoBtn.Setting
                                        ? "border-b-2 text-purple-primary border-b border-purple-primary"
                                        : ""
                                }`}
                                        onClick={() =>
                                            setInfoBtn(InfoBtn.Setting)
                                        }
                                    >
                                        Settings
                                    </div>
                                )}
                        </div>
                        <div className="bg-blue-primary pt-8 py-16 px-8 w-full">
                            {infoBtn === InfoBtn.Balance && (
                                <table className="w-full">
                                    <thead className="bg-purple-second bg-opacity-10">
                                        <tr className="text-sm font-light">
                                            <th className="text-left w-1/2 h-12 pl-4 rounded-l-lg">
                                                Token
                                            </th>
                                            <th className="text-right">
                                                Weight
                                            </th>
                                            <th className="text-right">
                                                Pool balance
                                            </th>
                                            <th className="text-right">
                                                My balance
                                            </th>
                                            <th className="text-right pr-4 rounded-r-lg">
                                                My asset value
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pool &&
                                            pool.tokens.map(
                                                (token: any, index: number) => {
                                                    return (
                                                        <tr
                                                            className="text-sm font-light border-b border-purple-second border-opacity-50"
                                                            key={index}
                                                        >
                                                            <td className="text-left w-1/2 h-12 pl-4 flex gap-x-3 items-center">
                                                                {/*<img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt=""*/}
                                                                {/*     className="h-6 w-6"/>*/}
                                                                <Jazzicon
                                                                    diameter={
                                                                        22
                                                                    }
                                                                    seed={jsNumberForAddress(
                                                                        token.address
                                                                    )}
                                                                />
                                                                <span>
                                                                    {
                                                                        token.symbol
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="text-right px-4">
                                                                {
                                                                    token.denormWeight
                                                                }{" "}
                                                                %
                                                            </td>
                                                            <td className="text-right px-4">
                                                                {token.balance >
                                                                0
                                                                    ? parseFloat(
                                                                          token.balance
                                                                      ).toFixed(
                                                                          4
                                                                      )
                                                                    : "-"}
                                                            </td>
                                                            <td className="text-right px-4">
                                                                -
                                                            </td>
                                                            <td className="text-right pr-4">
                                                                0
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                    </tbody>
                                </table>
                            )}
                            {infoBtn === InfoBtn.Swap && (
                                <table className="w-full">
                                    <thead className="bg-purple-second bg-opacity-10">
                                        <tr className="text-sm font-light">
                                            <th className="text-left w-1/2 h-12 pl-4 rounded-l-lg">
                                                Time
                                            </th>
                                            <th className="text-left">
                                                Trade in
                                            </th>
                                            <th className="text-left">
                                                Trade out
                                            </th>
                                            <th className="text-right pr-4 rounded-r-lg">
                                                Swap fee
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {swaps &&
                                            swaps.map(
                                                (swap: any, index: number) => {
                                                    return (
                                                        <tr
                                                            className="text-sm font-light border-b border-purple-second border-opacity-50"
                                                            key={index}
                                                        >
                                                            <td className="text-left w-2/3 h-12 pl-4">
                                                                {new Date(
                                                                    swap.timestamp *
                                                                        1000
                                                                ).toUTCString()}
                                                            </td>
                                                            <td>
                                                                <div className="flex items-center justify-start gap-x-2 h-12">
                                                                    <Jazzicon
                                                                        diameter={
                                                                            22
                                                                        }
                                                                        seed={jsNumberForAddress(
                                                                            swap.tokenIn
                                                                        )}
                                                                    />
                                                                    <div>
                                                                        {parseFloat(
                                                                            swap.tokenAmountIn
                                                                        ).toFixed(
                                                                            3
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        {
                                                                            swap.tokenInSym
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="flex items-center justify-start gap-x-2 h-12">
                                                                    <Jazzicon
                                                                        diameter={
                                                                            22
                                                                        }
                                                                        seed={jsNumberForAddress(
                                                                            swap.tokenOut
                                                                        )}
                                                                    />
                                                                    <div>
                                                                        {parseFloat(
                                                                            swap.tokenAmountOut
                                                                        ).toFixed(
                                                                            3
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        {
                                                                            swap.tokenOutSym
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="text-right pr-4">
                                                                ${" "}
                                                                {swap.feeValue}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                    </tbody>
                                </table>
                            )}
                            {infoBtn === InfoBtn.About && pool && (
                                <div>
                                    <div>
                                        <dt className="text-gray-400 text-xs">
                                            Pool type
                                        </dt>
                                        <dd className="text-xl font-medium">
                                            Smart pool
                                        </dd>
                                    </div>
                                    <div className="mt-2">
                                        <dt className="text-gray-400 text-xs">
                                            Rights
                                        </dt>
                                        {pool.rights.map(
                                            (item: any, index: number) => {
                                                return (
                                                    <dd
                                                        className="text-lg font-medium"
                                                        key={index}
                                                    >
                                                        {item}
                                                    </dd>
                                                );
                                            }
                                        )}
                                    </div>
                                    <div className="mt-2">
                                        <dt className="text-gray-400 text-xs">
                                            cap
                                        </dt>
                                        <dd className="text-xl font-medium">
                                            {pool.cap}
                                        </dd>
                                    </div>

                                    <div className="mt-2">
                                        <dt className="text-gray-400 text-xs">
                                            Controller
                                        </dt>
                                        <dd className="text-xl font-medium flex items-center gap-x-2">
                                            <Jazzicon
                                                diameter={22}
                                                seed={jsNumberForAddress(
                                                    pool.controller
                                                )}
                                            />
                                            {truncateAddress(pool.controller)}
                                        </dd>
                                    </div>

                                    <div className="mt-2">
                                        <dt className="text-gray-400 text-xs">
                                            Smart Controller
                                        </dt>
                                        <dd className="text-xl font-medium flex items-center gap-x-2">
                                            <Jazzicon
                                                diameter={22}
                                                seed={jsNumberForAddress(
                                                    pool.crpController
                                                )}
                                            />
                                            {truncateAddress(
                                                pool.crpController
                                            )}
                                        </dd>
                                    </div>
                                    <div className="mt-2">
                                        <dt className="text-gray-400 text-xs">
                                            Creation date
                                        </dt>
                                        <dd className="text-xl font-medium">
                                            {pool.createTime}
                                        </dd>
                                    </div>
                                    <div className="mt-2">
                                        <dt className="text-gray-400 text-xs">
                                            Swap fee
                                        </dt>
                                        <dd className="text-xl font-medium">
                                            {pool.swapFee}
                                        </dd>
                                    </div>
                                    <div className="mt-2">
                                        <dt className="text-gray-400 text-xs">
                                            Total swap volume
                                        </dt>
                                        <dd className="text-xl font-medium">
                                            {pool.totalSwapVolume}
                                        </dd>
                                    </div>
                                    <div className="mt-2">
                                        <dt className="text-gray-400 text-xs">
                                            Total swap fee
                                        </dt>
                                        <dd className="text-xl font-medium">
                                            {pool.totalSwapFee}
                                        </dd>
                                    </div>
                                </div>
                            )}
                            {infoBtn === InfoBtn.Setting && (
                                <div>
                                    <div className="flex justify-between items-center border-b border-purple-primary pb-4 border-opacity-50">
                                        <dl>
                                            <dt className="text-sm">
                                                Public swap
                                            </dt>
                                            <dd className="text-2xl font-bold text-white">
                                                Enable
                                            </dd>
                                        </dl>
                                        <div>
                                            <button
                                                className="btn-primary"
                                                onClick={() =>
                                                    setOpenChangePublicSwap(
                                                        true
                                                    )
                                                }
                                            >
                                                Toggle
                                            </button>
                                        </div>
                                    </div>

                                    <div
                                        className="flex justify-between items-center border-b border-purple-primary pb-4
                        border-opacity-50 mt-6"
                                    >
                                        <dl>
                                            <dt className="text-sm">
                                                Swap fee
                                            </dt>
                                            <dd className="text-2xl font-bold text-white">
                                                {parseFloat(pool.swapFee) * 100}{" "}
                                                %
                                            </dd>
                                        </dl>
                                        <div>
                                            <button
                                                className="btn-primary"
                                                onClick={() =>
                                                    setOpenChangeSwapFee(true)
                                                }
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </div>
                                    <div
                                        className="flex justify-between items-center border-b border-purple-primary pb-4
                        border-opacity-50 mt-6"
                                    >
                                        <dl>
                                            <dt className="text-sm">
                                                Manage weight
                                            </dt>
                                            <dd className="text-2xl font-bold">
                                                {""}
                                            </dd>
                                        </dl>
                                        <div className="space-x-3">
                                            <button
                                                className="btn-primary"
                                                onClick={() =>
                                                    setOpenGradualWeight(true)
                                                }
                                            >
                                                Update Gradually
                                            </button>
                                            <button
                                                className="btn-primary"
                                                onClick={() =>
                                                    setOpenChangeTokenWeight(
                                                        true
                                                    )
                                                }
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                    <div
                                        className="flex justify-between items-center border-b border-purple-primary pb-4
                        border-opacity-50 mt-6"
                                    >
                                        <dl>
                                            <dt className="text-sm">Tokens</dt>
                                            <dd className="flex gap-x-6 mt-2 ">
                                                {pool.tokens.map(
                                                    (
                                                        token: any,
                                                        index: number
                                                    ) => {
                                                        return (
                                                            <div
                                                                className="flex items-center gap-x-2"
                                                                key={index}
                                                            >
                                                                <Jazzicon
                                                                    diameter={
                                                                        22
                                                                    }
                                                                    seed={jsNumberForAddress(
                                                                        token.address
                                                                    )}
                                                                />
                                                                <span>
                                                                    {
                                                                        token.symbol
                                                                    }
                                                                </span>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </dd>
                                        </dl>
                                        <div>
                                            <button
                                                className="btn-primary"
                                                onClick={() =>
                                                    setOpenChangeToken(true)
                                                }
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </div>
                                    <div
                                        className="flex justify-between items-center border-b border-purple-primary pb-4
                        border-opacity-50 mt-6"
                                    >
                                        <dl>
                                            <dt className="text-sm">Cap</dt>
                                            <dd className="text-2xl font-bold text-white">
                                                {cap}
                                            </dd>
                                        </dl>
                                        <div>
                                            <button
                                                className="btn-primary"
                                                onClick={() =>
                                                    setOpenChangeCap(true)
                                                }
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </div>
                                    <div
                                        className="flex justify-between items-center border-b border-purple-primary pb-4
                        border-opacity-50 mt-6"
                                    >
                                        <dl>
                                            <dt className="text-sm">
                                                LP whitelist
                                            </dt>
                                            <dd className="text-2xl font-bold">
                                                {""}
                                            </dd>
                                        </dl>
                                        <div>
                                            <button
                                                className="btn-primary"
                                                onClick={() =>
                                                    setOpenChangeWhitelist(true)
                                                }
                                            >
                                                Manage
                                            </button>
                                        </div>
                                    </div>
                                    <div
                                        className="flex justify-between items-center border-b border-purple-primary pb-4
                        border-opacity-50 mt-6"
                                    >
                                        <dl>
                                            <dt className="text-sm">
                                                Controller
                                            </dt>
                                            <dd className="text-xl font-bold text-white">
                                                {proxyAddress}
                                            </dd>
                                        </dl>
                                        <div>
                                            <button
                                                className="btn-primary"
                                                onClick={() =>
                                                    setOpenChangeController(
                                                        true
                                                    )
                                                }
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            {openLiquidity && (
                <Liquidity
                    tokens={pool.tokens}
                    close={() => setOpenLiquidity(false)}
                />
            )}
            {openChangePublicSwap && (
                <SwapPause
                    proxyAddress={proxyAddress}
                    controller={pool.controller}
                    status={true}
                    close={() => setOpenChangePublicSwap(false)}
                />
            )}
            {openChangeSwapFee && (
                <SwapFee
                    proxyAddress={proxyAddress}
                    controller={pool.controller}
                    fee={parseFloat(pool.swapFee) * 100}
                    close={() => setOpenChangeSwapFee(false)}
                />
            )}
            {openChangeTokenWeight && (
                <ChangeTokenWeight
                    proxyAddress={proxyAddress}
                    pool={pool}
                    totalShares={totalShares}
                    close={() => setOpenChangeTokenWeight(false)}
                />
            )}
            {openGradualWeight && (
                <GradualWeight
                    proxyAddress={proxyAddress}
                    pool={pool}
                    changeBlockNum={changeWeightBlockNum}
                    totalShares={totalShares}
                    close={() => setOpenGradualWeight(false)}
                />
            )}
            {openChangeToken && (
                <ChangeToken
                    proxyAddress={proxyAddress}
                    controller={pool.controller}
                    symbol={pool.symbol}
                    tokens={pool.tokens}
                    totalShares={totalShares}
                    totalWeight={pool.totalWeight}
                    close={() => setOpenChangeToken(false)}
                />
            )}
            {openChangeCap && (
                <ChangeCap
                    proxyAddress={proxyAddress}
                    controller={pool.controller}
                    cap={cap}
                    close={() => setOpenChangeCap(false)}
                />
            )}
            {openChangeWhitelist && (
                <ChangeWhiteList
                    proxyAddress={proxyAddress}
                    controller={pool.controller}
                    close={() => setOpenChangeWhitelist(false)}
                />
            )}
            {openChangeController && (
                <ChangeController
                    proxyAddress={proxyAddress}
                    controller={pool.controller}
                    close={() => setOpenChangeController(false)}
                />
            )}
        </Fragment>
    );
};

export default PoolManage;
