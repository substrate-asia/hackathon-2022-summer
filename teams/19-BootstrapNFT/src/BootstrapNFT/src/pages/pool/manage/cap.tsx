import { useEffect, useState } from "react";
import Modal from "@/components/modal";
import { Contract, ethers } from "ethers";
import rinkeby from "@/config/rinkeby.json";
import { Interface } from "ethers/lib/utils";
import { useWeb3React } from "@web3-react/core";
import BActionABI from "@/contract/pool/BAction.json";
import DSProxyABI from "@/contract/pool/DSProxy.json";
import { useLoading } from "@/context/loading";

const ChangeCap = ({ proxyAddress, controller, cap, close }: any) => {
    const [, setLoading] = useLoading();
    const [caps, setCaps] = useState(cap);
    const { active, library } = useWeb3React();

    useEffect(() => {
        return () => {
            setLoading(false);
        };
    }, []);

    const changeCap = async () => {
        if (!active) {
            return;
        }
        setLoading(true);

        const ifac = new Interface(BActionABI);
        const data = ifac.encodeFunctionData("setCap", [
            controller,
            ethers.utils.parseEther(caps.toString()),
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
                console.log("update cap success", res);
                setLoading(false);
                close();
            })
            .catch((err: any) => {
                console.log("update cap err", err);
                setLoading(false);
            });
    };

    return (
        <Modal close={close} title="Edit cap" maxW="max-w-lg">
            <div className="mt-4">
                <div className="mt-4">
                    <dl className="text-center">
                        <dt className="mt-4 text-lg text-purple-second">
                            Change pool supply cap
                        </dt>
                        <dd>
                            <input
                                className="input-second w-2/3 mt-3"
                                value={caps}
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
                                    setCaps(val);
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
                        disabled={cap === caps}
                        onClick={changeCap}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ChangeCap;
