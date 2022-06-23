import { useNavigate, useParams } from "react-router";
import { Fragment, useEffect, useState } from "react";
import exclamationTriangle from "@/assets/icon/exclamation-triangle.svg";
import { Tab } from "@headlessui/react";
import { Contract } from "ethers";
import VaultABI from "@/contract/Vault.json";
import ERC721ABI from "@/contract/ERC721.json";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers/lib.esm";
import { truncateAddress } from "@/util/address";
import { useLoading } from "@/context/loading";
import Vault from "@/contract/Vault.json";

const VaultManage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [, setLoading] = useLoading();
    const { library, account } = useWeb3React();
    const [tabs] = useState(["General", "Fee", "Danger Zone"]);
    const [enableMinting, setEnableMinting] = useState(false);
    const [enableRandomRedeem, setEnableRandomRedeem] = useState(false);
    const [enableTargetRedeem, setEnableTargetRedeem] = useState(false);
    const [enableRandomSwap, setEnableRandomSwap] = useState(false);
    const [enableTargetSwap, setEnableTargetSwap] = useState(false);

    const [mintFee, setMintFee] = useState("0");
    const [randomRedeemFee, setRandomRedeemFee] = useState("0");
    const [targetRedeemFee, setTargetRedeemFee] = useState("0");

    const [assetAddress, setAssetAddress] = useState("");
    const [showDeposit, setShowDeposit] = useState(false);
    const [isMint, setIsMint] = useState(false);
    const [ownerNFTIds, setOwnerNFTIds] = useState<number[]>([]);
    const [ownerNFTs, setOwnerNFTs] = useState<any[]>([]);
    const [selectNFTIds, setSelectNFTIds] = useState<number[]>([]);
    const [isPublish, setIsPublish] = useState(false);

    useEffect(() => {
        getFees();
        getNFTAssetAddress();
        getNFTInfo();
        getPublish();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getNFTInfo();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ownerNFTIds]);

    const getNFTAssetAddress = async () => {
        const contract = new Contract(
            params.address!,
            VaultABI,
            library.getSigner()
        );
        await contract.assetAddress().then((res: any) => {
            setAssetAddress(res);
        });
    };

    const getFees = async () => {
        const contract = new Contract(
            params.address!,
            VaultABI,
            library.getSigner()
        );
        await contract.vaultFees().then((fees: any) => {
            const res = fees.map((item: any) =>
                ethers.utils.formatEther(item).toString()
            );
            setMintFee(Number.parseFloat(res[0]) * 100 + "");
            setRandomRedeemFee(Number.parseFloat(res[1]) * 100 + "");
            setTargetRedeemFee(Number.parseFloat(res[2]) * 100 + "");
        });
    };

    const updateFeature = async () => {
        setLoading(true);
        const contract = new Contract(
            params.address!,
            VaultABI,
            library.getSigner()
        );
        const tx = await contract.setVaultFeatures(
            enableMinting,
            enableRandomRedeem,
            enableTargetRedeem,
            enableRandomSwap,
            enableTargetSwap
        );
        await tx.wait().then((res: any) => {
            console.log("update enable target redeem", res);
        });
        setLoading(false);
    };

    const updateFees = async () => {
        setLoading(true);
        const contract = new Contract(
            params.address!,
            VaultABI,
            library.getSigner()
        );
        console.log(mintFee, randomRedeemFee, targetRedeemFee);
        const tx = await contract.setFees(
            ethers.utils.parseEther(mintFee).div(100).toString(),
            ethers.utils.parseEther(randomRedeemFee).div(100).toString(),
            ethers.utils.parseEther(targetRedeemFee).div(100).toString(),
            ethers.utils.parseEther(targetRedeemFee).div(100).toString(),
            ethers.utils.parseEther(targetRedeemFee).div(100).toString()
        );
        await tx.wait().then((res: any) => {
            console.log("update fees:", res);
        });
        setLoading(false);
    };

    const mint = async () => {
        if (!selectNFTIds) {
            return;
        }
        setLoading(true);
        const erc721Contract = new Contract(
            assetAddress,
            ERC721ABI,
            library.getSigner()
        );
        const approve = await erc721Contract.approve(
            params.address,
            selectNFTIds[0]
        );
        const approveResult = await approve.wait();
        console.log("approve result:", approveResult);

        const contract = new Contract(
            params.address!,
            VaultABI,
            library.getSigner()
        );
        const tx = await contract.mint(selectNFTIds, [1]);
        await tx.wait().then(
            (res: any) => {
                console.log("tx success:", res);
                setIsMint(true);
                setShowDeposit(false);
            },
            (err: any) => {
                console.log("tx error:", err);
            }
        );
        setLoading(false);
    };

    const getNFTIds = async () => {
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
                console.log(`result: ${index}`, result);
            })
        ).catch((err) => {
            console.log("get nft id:", err);
            setLoading(false);
        });

        setOwnerNFTIds(
            tokenIds.sort((a, b) => {
                return a - b;
            })
        );
        setShowDeposit(true);
        setLoading(false);
    };

    const publish = async () => {
        setLoading(true);
        const contract = new Contract(
            params.address!,
            VaultABI,
            library.getSigner()
        );
        const tx = await contract.finalizeVault();
        tx.wait().then((res: any) => {
            console.log("publish success:", res);
            navigate("/");
        });
        setLoading(false);
    };

    const selectNFTId = (id: number) => {
        if (selectNFTIds.includes(id)) {
            // const ids = selectNFTIds.filter(item => {
            //     return item !== id;
            // });
            setSelectNFTIds([]);
        } else {
            setSelectNFTIds([id]);
        }
    };

    const getNFTInfo = async () => {
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
                    console.log("res:", res);
                    res.number = item;
                    ownerNFTs.push(res);
                });
            })
        );
        setOwnerNFTs(ownerNFTs);
        setLoading(false);
    };

    const getPublish = async () => {
        const contract = new Contract(
            params.address!,
            Vault,
            library.getSigner()
        );
        const res = await contract.manager();
        if (0 === Number(res)) {
            setIsPublish(true);
            setIsMint(true);
            console.log(isPublish);
        }
    };

    return (
        <Fragment>
            <main className="flex-1 flex flex-col px-4 xl:px-8 2xl:p-12 py-12 text-purple-second">
                <div className="mx-auto my-10 max-w-4xl w-full shadow-xl p-6 bg-blue-primary">
                    <header>
                        {!isPublish ? (
                            <span className="uppercase text-xs text-pink-800 border-pink-700 border p-1 rounded">
                                unpublish
                            </span>
                        ) : (
                            <span className="uppercase text-xs text-emerald-primary border-emerald-primary border p-1 rounded">
                                publish
                            </span>
                        )}
                        <h1 className="text-2xl font-bold mt-4">PUNK</h1>
                        <div className="flex gap-x-3 text-sm">
                            <h3 className="font-bold">CryptoPunks</h3>
                            <span>{truncateAddress(params.address!)}</span>
                        </div>
                    </header>
                    {!isMint && (
                        <div className="shadow-2xl mt-6 p-3 flex items-center justify-between">
                            <div className="max-w-sm">
                                <div className="flex items-center gap-x-2 py-1 px-2 rounded-full text-sm font-bold bg-gray-100 w-44">
                                    <img
                                        src={exclamationTriangle}
                                        alt=""
                                        className="h-5 w-5"
                                    />
                                    No NFTS IN VAULT
                                </div>
                                <p className="text-sm mt-4">
                                    Before you can publish this vault to be
                                    visible in the app, it must have at least 1
                                    NFTS minted to it.
                                </p>
                            </div>
                            <button
                                className="inline-flex items-center justify-center outline-none font-medium rounded-md
                            break-word hover:outline focus:outline-none focus:ring-1 focus:ring-opacity-75 p-3
                            bg-gradient-to-b from-purple-primary to-purple-900 text-white hover:from-purple-primary
                            hover:to-purple-primary"
                                type="button"
                                onClick={getNFTIds}
                            >
                                Deposit NFTs
                            </button>
                        </div>
                    )}
                    {!isPublish && isMint && (
                        <div className="shadow-2xl mt-6 p-3 flex items-center justify-between">
                            <div className="max-w-sm">
                                <div className="flex items-center gap-x-2 py-1 px-2 rounded-full text-sm font-bold bg-gray-100 w-44">
                                    <img
                                        src={exclamationTriangle}
                                        alt=""
                                        className="h-5 w-5"
                                    />
                                    No NFTS IN VAULT
                                </div>
                                <p className="text-sm mt-4">
                                    This vault will not be visible in the app
                                    until it is publish.
                                </p>
                            </div>
                            <button
                                className="inline-flex items-center justify-center outline-none font-medium rounded-md
                            break-word hover:outline focus:outline-none focus:ring-1 focus:ring-opacity-75 p-3
                            bg-gradient-to-b from-purple-primary to-purple-900 text-white hover:from-purple-primary
                            hover:to-purple-primary"
                                type="button"
                                onClick={publish}
                            >
                                Publish Vault
                            </button>
                        </div>
                    )}

                    {showDeposit && (
                        <div className="shadow-2xl mt-8 p-3">
                            <div className="pb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 sm:gap-4 gap-2 ">
                                {ownerNFTs.map((item) => {
                                    return (
                                        <div
                                            className="group relative"
                                            key={item.number}
                                        >
                                            <div
                                                className={`p-3 cursor-pointer opacity-100 break-words min-h-full rounded-lg
                                                text-lm-gray-700 border  transition-colors duration-300 ease-in-out
                                                border-transparent bg-lm-gray-100 hover:bg-pink-50 hover:border-pink-100 flex flex-col 
                                                ${
                                                    selectNFTIds.includes(
                                                        item.number
                                                    )
                                                        ? "bg-pink-100 border-pink-200"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    selectNFTId(item.number)
                                                }
                                            >
                                                <header className="flex">
                                                    <h3 className="text-xs dark:text-gray-400 text-gray-500 mb-2 pr-1">
                                                        #{item.number}{" "}
                                                    </h3>
                                                    <h4 className="ml-auto font-medium text-xs overflow-hidden overflow-ellipsis whitespace-nowrap">
                                                        {""}
                                                    </h4>
                                                </header>
                                                <div className="flex flex-1">
                                                    <div className="w-0 h-0 relative pt-full"></div>
                                                    <div className="flex-grow flex justify-center items-center rounded-md overflow-hidden ">
                                                        <img
                                                            loading="lazy"
                                                            src={item.image}
                                                            className="rounded-md w-full"
                                                            alt={`${item.name} ${item.number}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="text-center">
                                <button
                                    className="inline-flex items-center justify-center outline-none font-medium rounded-md
                                            break-word hover:outline focus:outline-none focus:ring-1 focus:ring-opacity-75 p-2
                                            bg-gradient-to-b from-purple-primary to-purple-900 text-white hover:from-purple-primary
                                            hover:to-purple-primary mt-3 text-sm mt-3"
                                    type="button"
                                    onClick={mint}
                                >
                                    Mint NFTs
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="shadow-2xl mt-8 p-3">
                        <Tab.Group>
                            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                                {tabs.map((tab, index) => (
                                    <Tab
                                        key={index}
                                        className={({ selected }) =>
                                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                                            ${
                                                selected
                                                    ? "bg-white shadow"
                                                    : "text-pink-100 hover:bg-white/[0.12] hover:text-white"
                                            }`
                                        }
                                    >
                                        {tab}
                                    </Tab>
                                ))}
                            </Tab.List>
                            <Tab.Panels className="mt-2">
                                <Tab.Panel className="rounded-xl p-3">
                                    <div>
                                        <h1 className="font-bold text-xl">
                                            Vault Address
                                        </h1>
                                        <span className="text-sm">
                                            {params.address}
                                        </span>
                                    </div>
                                    <div className="mt-5">
                                        <h1 className="font-bold text-xl">
                                            Enable Vault Feature
                                        </h1>
                                        <div className="mt-2">
                                            <button className="btn-check-box">
                                                <label className="cursor-pointer inline-flex items-center select-none text-sm w-full">
                                                    <input
                                                        type="checkbox"
                                                        className="check-box-primary"
                                                        onChange={(e) =>
                                                            setEnableMinting(
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                    <span className="ml-2 overflow-hidden">
                                                        Enable Minting
                                                    </span>
                                                </label>
                                            </button>

                                            <button className="btn-check-box">
                                                <label className="cursor-pointer inline-flex items-center select-none text-sm w-full">
                                                    <input
                                                        type="checkbox"
                                                        className="check-box-primary"
                                                        onChange={(e) =>
                                                            setEnableRandomRedeem(
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                    <span className="ml-2 overflow-hidden">
                                                        Enable Random Redeems
                                                    </span>
                                                </label>
                                            </button>

                                            <button className="btn-check-box">
                                                <label className="cursor-pointer inline-flex items-center select-none text-sm w-full">
                                                    <input
                                                        type="checkbox"
                                                        className="check-box-primary"
                                                        onChange={(e) =>
                                                            setEnableTargetRedeem(
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                    <span className="ml-2 overflow-hidden">
                                                        Enable Target Redeems
                                                    </span>
                                                </label>
                                            </button>

                                            <button className="btn-check-box">
                                                <label className="cursor-pointer inline-flex items-center select-none text-sm w-full">
                                                    <input
                                                        type="checkbox"
                                                        className="check-box-primary"
                                                        onChange={(e) =>
                                                            setEnableRandomSwap(
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                    <span className="ml-2 overflow-hidden">
                                                        Enable Random Swap
                                                    </span>
                                                </label>
                                            </button>

                                            <button className="btn-check-box mt-4">
                                                <label className="cursor-pointer inline-flex items-center select-none text-sm w-full">
                                                    <input
                                                        type="checkbox"
                                                        className="check-box-primary"
                                                        onChange={(e) =>
                                                            setEnableTargetSwap(
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                    <span className="ml-2 overflow-hidden">
                                                        Enable Target Swap
                                                    </span>
                                                </label>
                                            </button>
                                        </div>
                                        <button
                                            className="btn-primary mt-6"
                                            type="button"
                                            onClick={updateFeature}
                                        >
                                            Update Features
                                        </button>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel className="rounded-xl p-3">
                                    <div>
                                        <h1 className="font-bold text-xl">
                                            Current Fees
                                        </h1>
                                        <span className="text-sm">
                                            Vaults can set fees that will be
                                            rewarded to vault liquidity
                                            providers.
                                        </span>
                                    </div>
                                    <div className="shadow-lg mt-6 p-3 flex items-center justify-between">
                                        <div>
                                            <h1 className="text-xl font-bold">
                                                Mint Fee
                                            </h1>
                                            <span className="text-sm">
                                                The fee token upon minting new
                                                NFTs into this vault.
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-x-2">
                                            <input
                                                className="w-20 dark:bg-gray-800 bg-white p-2 sm:p-2.5 text-base rounded-md border border-gray-200 dark:border-gray-600 dark:focus:ring-pink-800 focus:ring-pink-100 focus:ring-2 focus:border-pink-500 dark:focus:border-pink-500 focus:outline-none dark:focus:bg-pink-900 dark:focus:color-white dark:hover:border-pink-500 transition duration-300 ease-in-out opacity-100"
                                                placeholder="1.0"
                                                value={mintFee}
                                                onChange={(e) =>
                                                    setMintFee(e.target.value)
                                                }
                                            />
                                            <span className="text-lg">%</span>
                                        </div>
                                    </div>

                                    <div className="shadow-lg mt-6 p-3 flex items-center justify-between">
                                        <div>
                                            <h1 className="text-xl font-bold">
                                                Redeem Fee
                                            </h1>
                                            <span className="text-sm">
                                                The fee token upon redeeming a
                                                random NFT from this vault.
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-x-2">
                                            <input
                                                className="w-20 dark:bg-gray-800 bg-white p-2 sm:p-2.5 text-base rounded-md border border-gray-200 dark:border-gray-600 dark:focus:ring-pink-800 focus:ring-pink-100 focus:ring-2 focus:border-pink-500 dark:focus:border-pink-500 focus:outline-none dark:focus:bg-pink-900 dark:focus:color-white dark:hover:border-pink-500 transition duration-300 ease-in-out opacity-100"
                                                placeholder="0.0"
                                                value={randomRedeemFee}
                                                onChange={(e) =>
                                                    setRandomRedeemFee(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <span className="text-lg">%</span>
                                        </div>
                                    </div>

                                    <div className="shadow-lg mt-6 p-3 flex items-center justify-between">
                                        <div>
                                            <h1 className="text-xl font-bold">
                                                Target Redeem Fee
                                            </h1>
                                            <span className="text-sm">
                                                The fee token upon redeeming a
                                                specific NFT from this vault.
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-x-2">
                                            <input
                                                className="w-20 dark:bg-gray-800 bg-white p-2 sm:p-2.5 text-base rounded-md border border-gray-200 dark:border-gray-600 dark:focus:ring-pink-800 focus:ring-pink-100 focus:ring-2 focus:border-pink-500 dark:focus:border-pink-500 focus:outline-none dark:focus:bg-pink-900 dark:focus:color-white dark:hover:border-pink-500 transition duration-300 ease-in-out opacity-100"
                                                placeholder="5.0"
                                                value={targetRedeemFee}
                                                onChange={(e) =>
                                                    setTargetRedeemFee(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <span className="text-lg">%</span>
                                        </div>
                                    </div>

                                    <button
                                        className="btn-primary mt-6"
                                        type="button"
                                        onClick={updateFees}
                                    >
                                        Edit Fees
                                    </button>
                                </Tab.Panel>
                                <Tab.Panel className="rounded-xl p-3">
                                    Danger Zone
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                </div>
            </main>
        </Fragment>
    );
};

export default VaultManage;
