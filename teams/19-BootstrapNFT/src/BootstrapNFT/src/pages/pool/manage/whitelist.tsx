import { useState } from "react";
import Modal from "@/components/modal";
import { Interface } from "ethers/lib/utils";
import BActionABI from "@/contract/pool/BAction.json";
import { Contract } from "ethers";
import DSProxyABI from "@/contract/pool/DSProxy.json";
import rinkeby from "@/config/rinkeby.json";
import { useLoading } from "@/context/loading";
import { useWeb3React } from "@web3-react/core";

const ChangeWhiteList = ({ proxyAddress, controller, close }: any) => {
    const [, setLoading] = useLoading();
    const [provider, setProvider] = useState("");
    const { active, library } = useWeb3React();

    const add = async () => {
        if (!active) {
            return;
        }
        setLoading(true);

        const ifac = new Interface(BActionABI);
        const data = ifac.encodeFunctionData("whitelistLiquidityProvider", [
            controller,
            provider,
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
                console.log("update whitelist success", res);
                setLoading(false);
                close();
            })
            .catch((err: any) => {
                console.log("update whitelist err", err);
                setLoading(false);
            });
    };

    const remove = async () => {
        if (!active) {
            return;
        }
        setLoading(true);

        const ifac = new Interface(BActionABI);
        const data = ifac.encodeFunctionData(
            "removeWhitelistedLiquidityProvider",
            [controller, provider]
        );
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
                console.log("update remove success", res);
                setLoading(false);
                close();
            })
            .catch((err: any) => {
                console.log("update remove err", err);
                setLoading(false);
            });
    };

    return (
        <Modal close={close} title="LP whitelist" maxW="max-w-lg">
            <div className="mt-4">
                <div className="mt-4">
                    <dl className="text-center">
                        <dt className="mt-4 text-lg text-purple-second">
                            Add or remove liquidity provider
                        </dt>
                        <dd>
                            <input
                                className="input-second w-2/3 mt-3"
                                type="text"
                                onChange={(e) => {
                                    setProvider(e.target.value);
                                }}
                            />
                        </dd>
                    </dl>
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
                        disabled={provider === ""}
                        onClick={add}
                    >
                        Add
                    </button>
                    <button
                        className="btn-primary"
                        disabled={provider === ""}
                        onClick={remove}
                    >
                        Remove
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ChangeWhiteList;
