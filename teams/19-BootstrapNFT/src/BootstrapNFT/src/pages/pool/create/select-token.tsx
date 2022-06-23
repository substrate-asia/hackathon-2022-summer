import { useState } from "react";
import Modal from "@/components/modal";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { Contract, ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import ERC20ABI from "@/contract/ERC20.json";
import { unknownColors } from "@/util/utils";
import { useLoading } from "@/context/loading";

const SelectToken = ({
    tokensInfo,
    selectedToken,
    close,
    addNewToken,
}: any) => {
    const [, setLoading] = useLoading();
    const { active, account, library } = useWeb3React();
    const [tokenList, setTokenList] = useState(tokensInfo);

    const filter = (name: string) => {
        console.log("search name: ", name);

        if (name === "") {
            setTokenList(tokensInfo);
            return;
        }
        console.log(tokenList[0]);

        if (ethers.utils.isAddress(name)) {
            const list = tokenList.filter(
                (token: any) =>
                    token.address.toLowerCase() === name.toLowerCase()
            );
            if (list.length > 0) {
                setTokenList(list);
                return;
            }

            getToken(name);
            return;
        }

        const tl = tokenList.filter((token: any) =>
            token.name.toLowerCase().includes(name.toLowerCase())
        );
        setTokenList(tl);
    };

    const getToken = async (address: string) => {
        if (!active) {
            return;
        }

        try {
            setLoading(true);
            const contract = new Contract(
                address,
                ERC20ABI,
                library.getSigner()
            );

            const name = await contract.name();
            const symbol = await contract.symbol();
            const decimals = await contract.decimals();
            const balance = await contract.balanceOf(account);
            const color = unknownColors[Math.floor(Math.random() * 10) % 6];

            const token = {
                address: ethers.utils.getAddress(address),
                name: name,
                symbol: symbol,
                decimals: decimals.toString(),
                hasIcon: false,
                id: symbol.toLowerCase(),
                precision: 3,
                color: color,
                logoUrl: "",
                price: 0,
            };
            console.log("token info:", token, name, symbol);
            addNewToken(
                token,
                ethers.utils.formatUnits(balance, decimals.toString())
            );
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.log("get new token info err:", e);
        }
    };

    return (
        <Modal close={close} title="Select Token" maxW="max-w-lg">
            <div className="">
                <div className="w-full mt-4">
                    <input
                        type="text"
                        className="input-second w-full rounded-lg bg-purple-second text-white bg-opacity-30"
                        placeholder="Search name or paste address"
                        onChange={(e) => filter(e.target.value)}
                    />
                </div>
                <div className="p-4 border border-purple-primary mt-4 rounded-lg max-h-96 overflow-hidden overflow-y-auto">
                    {tokenList &&
                        tokenList.map((token: any) => {
                            return (
                                <div
                                    className="mt-2 py-3 px-6 flex item-center gap-x-2 item rounded-lg
                                                 cursor-pointer hover:bg-purple-second hover:text-black"
                                    key={token.id}
                                    onClick={() => {
                                        selectedToken(token);
                                        close();
                                    }}
                                >
                                    {token.logoUrl ? (
                                        <img
                                            src={token.logoUrl}
                                            alt=""
                                            className="w-6 h-6"
                                        />
                                    ) : (
                                        <Jazzicon
                                            diameter={24}
                                            seed={jsNumberForAddress(
                                                token.address
                                            )}
                                        />
                                    )}
                                    <div className="space-x-2">
                                        <span>{token.name}</span>
                                        <span className="text-sm opacity-70">
                                            {token.symbol}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    {tokenList.length === 0 && <div>no match found token</div>}
                </div>
            </div>
        </Modal>
    );
};

export default SelectToken;
