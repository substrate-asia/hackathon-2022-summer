import { Fragment, useEffect, useState } from "react";
import CreateForm from "@/pages/create/create";
import Review from "@/pages/create/review";
import { useWeb3React } from "@web3-react/core";

import VaultFactory from "@/contract/VaultFactory.json";
import contractAddress from "@/contract/contract.json";
import { Contract, ethers } from "ethers";
import Created from "@/pages/create/created";
import { useLoading } from "@/context/loading";

const enum State {
  Create,
  Review,
  Created,
}

const Create = () => {
  const [nftAssetAddress, setNftAssetAddress] = useState("");
  const [vaultName, setVaultName] = useState("");
  const [vaultSymbol, setVaultSymbol] = useState("");
  const [vaultAddress, setVaultAddress] = useState("");
  const [state, setState] = useState(State.Create);
  const { library, account, active } = useWeb3React();
  const [, setLoading] = useLoading();

  const changeState = (status: State) => {
    setState(status);
  };

  const create = async () => {
    setLoading(true);
    const contract = new Contract(
      contractAddress.VaultFactoryAddress,
      VaultFactory,
      library.getSigner()
    );
    const tx = await contract.createVault(
      vaultName,
      vaultSymbol,
      nftAssetAddress,
      false,
      true
    );
    tx.wait().then((res: any) => {
      console.log("create vault:", res);
      for (let i = 0; i < res.events.length; i++) {
        if (res.events[i].event === "NewVault") {
          console.log(res.events[i].args);
          console.log(res.events[i].args[1]);
          setVaultAddress(res.events[i].args[1]);
        }
      }
      changeState(State.Created);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!active) {
      return;
    }
    console.log("account", account);
    library.getBalance(account).then((balance: any) => {
      console.log("balance", ethers.utils.formatEther(balance));
    });
  }, [account]);

  return (
    <Fragment>
      <main className="flex-1 flex flex-col px-4 xl:px-8 2xl:p-12 py-12">
        <div className="mx-auto my-10 max-w-lg w-full">
          {!active && (
            <button
              className="inline-flex items-center justify-center outline-none font-medium rounded-md
                  break-word hover:outline focus:outline-none focus:ring-1 focus:ring-opacity-75 py-6 px-12
                  w-full bg-gradient-to-b from-pink-400 to-pink-500 text-white hover:from-pink-500 hover:to-pink-500
                  focus:ring-pink-500 whitespace-nowrap "
            >
              Connect
            </button>
          )}
          {active && (
            <div
              className="rounded-md shadow-xl dark:text-white text-lm-gray-700 dark:bg-gray-800
                    bg-lm-gray-100 border dark:border-gray-700 border-transparent p-6"
            >
              {state === State.Create && (
                <CreateForm
                  nftAssetAddress={nftAssetAddress}
                  vaultName={vaultName}
                  vaultSymbol={vaultSymbol}
                  changeState={() => changeState(State.Review)}
                  setNftAssetAddress={setNftAssetAddress}
                  setVaultName={setVaultName}
                  setVaultSymbol={setVaultSymbol}
                />
              )}
              {state === State.Review && (
                <Review
                  address={nftAssetAddress}
                  name={vaultName}
                  symbol={vaultSymbol}
                  create={create}
                />
              )}
              {state === State.Created && (
                <Created
                  address={vaultAddress}
                  name={vaultName}
                  symbol={vaultSymbol}
                  assetAddress={nftAssetAddress}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </Fragment>
  );
};

export default Create;
