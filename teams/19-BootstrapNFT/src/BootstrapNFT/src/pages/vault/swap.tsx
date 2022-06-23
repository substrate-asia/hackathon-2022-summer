import VaultHeader from "@/pages/vault/header";
import { useParams } from "react-router";
import { useWeb3React } from "@web3-react/core";
import { useLoading } from "@/context/loading";
import { Fragment, useEffect, useState } from "react";
import VaultCard from "@/pages/vault/card";
import { Contract } from "ethers";
import ERC721ABI from "@/contract/ERC721.json";
import VaultABI from "@/contract/Vault.json";
import close from "@/assets/icon/black-close.svg";
import circleArrowDown from "@/assets/icon/circle-arrow-down.svg";
import { gql, request } from "graphql-request";
import rinkeby from "@/config/rinkeby.json";
import { ethers } from "ethers/lib.esm";

const VaultSwap = () => {
    const params = useParams();
    const [, setLoading] = useLoading();
    const { library, account, active } = useWeb3React();
    const [assetAddress, setAssetAddress] = useState("");
    const [mints, setMints] = useState<any[]>([]);
    const [ownerNFTIds, setOwnerNFTIds] = useState<number[]>([]);
    const [swapSwitchType, setSwapSwitchType] = useState<"from" | "to">("from");
    const [ownerNFTs, setOwnerNFTs] = useState<{ [key: string]: any }[]>([]);
    const [selectFromIds, setSelectFromIds] = useState<
        { [key: string]: any }[]
    >([]);
    const [selectReceiveIds, setSelectReceiveIds] = useState<
        { [key: string]: any }[]
    >([]);

    useEffect(() => {
        getVaultInfo();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, account]);

    useEffect(() => {
        getNFTIds();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetAddress]);

    useEffect(() => {
        getNFTInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ownerNFTIds]);

    const getVaultInfo = () => {
        if (!active) {
            return;
        }

        const query = gql`
      query {
        vault(id: "${params.address}") {
          id
          asset {
            id
            name
            symbol
          }
          mints {
            id
            nftIds
          }
        }
      }
    `;

        request(rinkeby.nftSubgraphUrl, query)
            .then((data) => {
                setAssetAddress(ethers.utils.getAddress(data.vault.asset.id));
                getMintsNFT(data.vault);
            })
            .catch((err) => {
                console.log("sub", err);
            });
    };

    const selectTokenId = (item: any) => {
        console.log(item);
        let isSelect = false;
        // selectFromIds.forEach((nft) => {
        //   if (nft.number === item.number) {
        //     isSelect = true;
        //     return;
        //   }
        // });

        if (!isSelect) {
            setSelectFromIds([item]);
        }
    };

    const selectReceiveTokenId = (item: any) => {
        console.log("receive", item);
        let isSelect = false;
        // selectReceiveIds.forEach((nft) => {
        //   if (nft.number === item.number) {
        //     isSelect = true;
        //     return;
        //   }
        // });

        if (!isSelect) {
            setSelectReceiveIds([item]);
        }
    };

    const getNFTIds = async () => {
        if (assetAddress === "") {
            return;
        }
        setLoading(true);
        const contract = new Contract(
            assetAddress,
            ERC721ABI,
            library.getSigner()
        );

        const tokenIds: number[] = [];
        await Promise.all(
            new Array(58).fill(1).map(async (item, index) => {
                const result = await contract.ownerOf(index);
                if (result === account) {
                    tokenIds.push(index);
                }
            })
        ).catch((err) => {
            setLoading(false);
        });

        setOwnerNFTIds(
            tokenIds.sort((a, b) => {
                return a - b;
            })
        );
        setLoading(false);
    };

    const getNFTInfo = async () => {
        if (ownerNFTIds.length === 0) {
            return;
        }
        setLoading(true);
        const contract = new Contract(
            assetAddress,
            ERC721ABI,
            library.getSigner()
        );

        const ownerNFTs: any[] = [];
        await Promise.all(
            ownerNFTIds.map(async (item, index) => {
                const url = await contract.tokenURI(item);
                const res = await fetch(url);
                await res.json().then((res: any) => {
                    res.number = item;
                    ownerNFTs.push(res);
                });
            })
        );
        setOwnerNFTs(ownerNFTs);
        setLoading(false);
    };

    const getMintsNFT = async (vault: any) => {
        const address = ethers.utils.getAddress(vault.asset.id);
        const mints: any[] = vault.mints;
        const contract = new Contract(address, ERC721ABI, library.getSigner());
        await Promise.all(
            mints.map(async (item, index) => {
                try {
                    const url = await contract.tokenURI(item.nftIds[0]);
                    const res = await fetch(url);
                    await res.json().then((res: any) => {
                        item.number = item.nftIds[0];
                        item.name = res.name;
                        item.desc = res.description;
                        item.image = res.image;
                    });
                } catch (err) {
                    console.log("get mints nft err:", err);
                    item.number = item.nftIds[0];
                    item.image = "/images/cover.png";
                }
                return item;
            })
        )
            .then((res) => {
                console.log("get mints nft", res);
                setMints(res);
            })
            .catch((err) => {
                console.log("get mints nft err", err);
            });
    };

    const swap = async () => {
        setLoading(true);
        const erc721Contract = new Contract(
            assetAddress,
            ERC721ABI,
            library.getSigner()
        );
        const approve = await erc721Contract
            .approve(params.address, selectFromIds[0].number)
            .catch((e: any) => {
                console.log("approve error:", e);
                setLoading(false);
            });
        await approve.wait();

        const contract = new Contract(
            params.address!,
            VaultABI,
            library.getSigner()
        );
        const fromIds = selectFromIds.map((item) => item.number);
        const receiveIds = selectReceiveIds.map((item) => item.number);
        const tx = await contract.swap(fromIds, [fromIds.length], receiveIds);
        await tx
            .wait()
            .then((res: any) => {
                setLoading(false);
                setSwapSwitchType("from");
                setSelectFromIds([]);
                setSelectReceiveIds([]);
                getNFTIds();
                console.log("swap", res);
            })
            .catch((err: any) => {
                setLoading(false);
                console.log("swap err", err);
            });
    };

    return (
        <Fragment>
            <main className="flex-1 flex gap-x-6 relative flex-wrap md:flex-nowrap text-purple-second py-8 px-20">
                <section className="relative sm:static pb-12 flex-1 flex flex-col border-blue-primary">
                    <VaultHeader
                        address={params?.address}
                        isManager
                        type="swap"
                    />
                    <div className="dark:bg-gray-700">
                        <div className="px-3 py-6 sm:px-6">
                            <div className="mb-2 text-sm flex items-center justify-between">
                                {ownerNFTs.length} items
                            </div>
                        </div>
                    </div>
                    <div
                        className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6
                 3xl:grid-cols-7 sm:gap-4 gap-2"
                    >
                        {swapSwitchType === "from" &&
                            ownerNFTs.map((item, index) => (
                                <VaultCard
                                    key={index}
                                    {...item}
                                    selectList={selectFromIds}
                                    callback={(item: any) =>
                                        selectTokenId(item)
                                    }
                                />
                            ))}
                        {swapSwitchType === "to" &&
                            mints.map((item, index) => (
                                <VaultCard
                                    key={index}
                                    {...item}
                                    selectList={selectReceiveIds}
                                    callback={(item: any) =>
                                        selectReceiveTokenId(item)
                                    }
                                />
                            ))}
                    </div>
                </section>
                <aside className="flex-none w-full h-max md:w-1/3 md:max-w-xs 2xl:max-w-sm z-20 text-purple-second bg-blue-primary">
                    <div className="md:block md:sticky md:top-18 hidden">
                        <div className="block p-6 sm:p-10 md:p-6 md:mb-8">
                            <header className="flex justify-between items-center mb-6 relative">
                                <h3 className="font-bold text-lg">
                                    Swap assets
                                </h3>
                            </header>
                            <div
                                className={`w-full text-left rounded-t-lg pb-4 pt-2 border border-b-0 border-gray-600 
                      ${
                          swapSwitchType === "from"
                              ? "bg-purple-primary border-purple-primary bg-opacity-60"
                              : "bg-gray-700"
                      }`}
                            >
                                {selectFromIds.length === 0 && (
                                    <div
                                        className="w-full text-left p-3 cursor-default text-purple-second"
                                        onClick={() =>
                                            setSwapSwitchType("from")
                                        }
                                    >
                                        <h4 className="text-lg dark:text-white">
                                            Swap from
                                        </h4>
                                        <p className="opacity-70 text-sm">
                                            Choose your assets to swap from
                                        </p>
                                        {swapSwitchType === "to" && (
                                            <button
                                                className="inline-flex items-center justify-center
                            outline-none font-medium rounded-md
                            break-word hover:outline focus:outline-none focus:ring-1 focus:ring-opacity-75
                            py-2 px-3 text-sm bg-white text-gray-900 hover:bg-gray-100 focus:ring-gray-300 mt-4"
                                            >
                                                Select assets
                                            </button>
                                        )}
                                    </div>
                                )}
                                <div className="p-3">
                                    {selectFromIds.length > 0 && (
                                        <header className="flex justify-between">
                                            <h4 className="text-lg dark:text-white mr-2">
                                                Swap from
                                            </h4>
                                            {swapSwitchType === "to" && (
                                                <button
                                                    className="px-4 border border-purple-primary text-sm rounded hover:bg-purple-primary"
                                                    onClick={() =>
                                                        setSwapSwitchType(
                                                            "from"
                                                        )
                                                    }
                                                >
                                                    Change
                                                </button>
                                            )}
                                        </header>
                                    )}
                                    <div className="space-y-4 mt-4">
                                        {selectFromIds.map((item) => {
                                            return (
                                                <div
                                                    className="mt-4"
                                                    key={item.number}
                                                >
                                                    <div
                                                        className="flex items-center justify-between dark:text-gray-50 text-lm-gray-900 break-all"
                                                        key={item.number}
                                                    >
                                                        <div className="inline-flex items-center">
                                                            <img
                                                                loading="lazy"
                                                                src={
                                                                    item.imageUrl
                                                                }
                                                                className="w-8 h-8 object-cover flex-none rounded-md"
                                                                alt="CRYPTOPUNKS"
                                                            />
                                                            <div className="flex-1 ml-2 overflow-hidden">
                                                                <h4 className="text-sm font-bold leading-tight">
                                                                    #
                                                                    {
                                                                        item.number
                                                                    }
                                                                </h4>
                                                                <p className="text-xs dark:text-white text-lm-gray-900 text-opacity:20 dark:text-opacity-80 truncate">
                                                                    {item.name}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="focus:ring-0 focus:outline-none ml-2"
                                                            aria-label="remove"
                                                            onClick={() =>
                                                                setSelectFromIds(
                                                                    []
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={close}
                                                                alt=""
                                                                className="h-4 w-4 dark:text-gray-500 dark:hover:text-gray-200 text-lm-gray-600 hover-text-lm-gray-300"
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center relative bg-purple-second h-px">
                                <div className="absolute -top-4 bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center">
                                    <img
                                        src={circleArrowDown}
                                        alt=""
                                        className="h-4 w-4 text-gray-900 transform rotate-90"
                                    />
                                </div>
                            </div>
                            <div
                                className={`w-full text-left rounded-b-lg pt-4 pb-2 border border-t-0 border-gray-600 
                ${
                    swapSwitchType === "to"
                        ? "bg-purple-primary border-purple-primary bg-opacity-60"
                        : "bg-gray-700"
                }`}
                            >
                                {selectReceiveIds.length === 0 && (
                                    <div
                                        className="w-full text-left p-3 cursor-default text-purple-second"
                                        onClick={() => setSwapSwitchType("to")}
                                    >
                                        <h4 className="text-lg dark:text-white">
                                            Swap to
                                        </h4>
                                        <p className="opacity-70 text-sm">
                                            Choose your assets to receive
                                        </p>
                                        {swapSwitchType === "from" && (
                                            <button
                                                className="inline-flex items-center justify-center outline-none font-medium rounded-md
                            break-word hover:outline focus:outline-none focus:ring-1 focus:ring-opacity-75
                            py-2 px-3 text-sm bg-white text-gray-900 hover:bg-gray-100 focus:ring-gray-300 mt-4"
                                            >
                                                Select assets
                                            </button>
                                        )}
                                    </div>
                                )}
                                <div className="p-3">
                                    {selectReceiveIds.length > 0 && (
                                        <header className="flex justify-between">
                                            <h4 className="text-lg dark:text-white mr-2">
                                                Swap to
                                            </h4>
                                            {swapSwitchType === "from" && (
                                                <button
                                                    className="px-4 border border-purple-primary text-sm rounded hover:bg-purple-primary"
                                                    onClick={() =>
                                                        setSwapSwitchType("to")
                                                    }
                                                >
                                                    Change
                                                </button>
                                            )}
                                        </header>
                                    )}
                                    <div className="space-y-4 mt-4">
                                        {selectReceiveIds.map((item) => {
                                            return (
                                                <div
                                                    className="mt-4"
                                                    key={item.number}
                                                >
                                                    <div
                                                        className="flex items-center justify-between dark:text-gray-50 text-lm-gray-900 break-all"
                                                        key={item.number}
                                                    >
                                                        <div className="inline-flex items-center">
                                                            <img
                                                                loading="lazy"
                                                                src={
                                                                    item.imageUrl
                                                                }
                                                                className="w-8 h-8 object-cover flex-none rounded-md"
                                                                alt="CRYPTOPUNKS"
                                                            />
                                                            <div className="flex-1 ml-2 overflow-hidden">
                                                                <h4 className="text-sm font-bold leading-tight">
                                                                    #
                                                                    {
                                                                        item.number
                                                                    }
                                                                </h4>
                                                                <p className="text-xs dark:text-white text-lm-gray-900 text-opacity:20 dark:text-opacity-80 truncate">
                                                                    {item.name}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="focus:ring-0 focus:outline-none ml-2"
                                                            aria-label="remove"
                                                            onClick={() =>
                                                                setSelectReceiveIds(
                                                                    []
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={close}
                                                                alt=""
                                                                className="h-4 w-4 dark:text-gray-500 dark:hover:text-gray-200 text-lm-gray-600 hover-text-lm-gray-300"
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <button
                                    className="btn-primary mt-6 px-6 py-3"
                                    onClick={swap}
                                >
                                    Swap NFT
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </Fragment>
    );
};

export default VaultSwap;
