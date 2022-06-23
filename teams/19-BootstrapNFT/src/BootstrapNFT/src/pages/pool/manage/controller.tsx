import { useState } from "react";
import Modal from "@/components/modal";
import { Interface } from "ethers/lib/utils";
import BActionABI from "@/contract/pool/BAction.json";
import { Contract } from "ethers";
import DSProxyABI from "@/contract/pool/DSProxy.json";
import rinkeby from "@/config/rinkeby.json";
import { useLoading } from "@/context/loading";
import { useWeb3React } from "@web3-react/core";

const ChangeController = ({ proxyAddress, controller, close }: any) => {
    const [, setLoading] = useLoading();
    const { active, library } = useWeb3React();
    const [newController, setNewController] = useState(proxyAddress);

    const change = async () => {
        if (!active) {
            return;
        }
        setLoading(true);

        const ifac = new Interface(BActionABI);
        const data = ifac.encodeFunctionData("setController", [
            controller,
            newController,
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
                console.log("update controller success", res);
                setLoading(false);
                close();
            })
            .catch((err: any) => {
                console.log("update controller err", err);
                setLoading(false);
            });
    };

    return (
        <Modal close={close} title="Edit controller" maxW="max-w-lg">
            <div className="mt-4">
                <div className="mt-4">
                    <dl className="text-center">
                        <dt className="mt-4 text-lg text-purple-second">
                            Change pool controller
                        </dt>
                        <dd className="text-sm text-emerald-primary my-6">
                            Ensure you have the private key. Otherwise you will
                            lose control of the pool! If you want to control the
                            pool from the Balancer interface you need to use a
                            proxy account as controller, don't use your wallet
                            directly as controller.
                        </dd>
                        <dd>
                            <input
                                className="input-second w-2/3 mt-3"
                                type="text"
                                value={newController}
                                onChange={(e) => {
                                    setNewController(e.target.value);
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
                        disabled={controller === proxyAddress}
                        onClick={change}
                    >
                        Add
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ChangeController;
