import Modal from "@/components/modal";
import { useState } from "react";
import { Switch } from "@headlessui/react";
import { Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";
import BActionABI from "@/contract/pool/BAction.json";
import { useLoading } from "@/context/loading";
import rinkeby from "@/config/rinkeby.json";
import { Interface } from "ethers/lib/utils";
import DSProxyABI from "@/contract/pool/DSProxy.json";

const SwapPause = ({ proxyAddress, controller, status, close }: any) => {
    const [enabled, setEnabled] = useState(status);
    const [, setLoading] = useLoading();
    const { active, library } = useWeb3React();

    const changeEnabled = async () => {
        if (!active) {
            return;
        }
        setLoading(true);
        const ifac = new Interface(BActionABI);
        const data = ifac.encodeFunctionData("setPublicSwap", [
            controller,
            enabled,
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
                console.log("success", res);
                setLoading(false);
                close();
            })
            .catch((err: any) => {
                console.log("error", err);
                setLoading(false);
            });
    };

    return (
        <Modal close={close} title="Edit public swap" maxW="max-w-lg">
            <div className="mt-4">
                <dl className="text-center">
                    <dt className="mt-8 text-lg text-purple-second">
                        Enable or pause trading in your pool
                    </dt>
                    <dd className="mt-2">
                        <div>{enabled ? "Active" : "Paused"}</div>
                        <Switch
                            checked={enabled}
                            onChange={setEnabled}
                            className={`${
                                enabled ? "bg-emerald-primary" : "bg-teal-700"
                            }
                                relative inline-flex h-[30px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 
                                border-transparent transition-colors duration-200 ease-in-out focus:outline-none 
                                focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 mt-2`}
                        >
                            <span className="sr-only">Use setting</span>
                            <span
                                aria-hidden="true"
                                className={`${
                                    enabled ? "translate-x-11" : "translate-x-0"
                                }
                                    pointer-events-none inline-block h-[26px] w-[26px] transform rounded-full bg-white shadow-lg ring-0 
                                    transition duration-200 ease-in-out`}
                            />
                        </Switch>
                    </dd>
                </dl>
                <div className="flex justify-center gap-x-4 mt-8">
                    <button
                        className="btn-primary bg-purple-primary bg-opacity-50"
                        onClick={close}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn-primary"
                        disabled={status === enabled}
                        onClick={changeEnabled}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SwapPause;
