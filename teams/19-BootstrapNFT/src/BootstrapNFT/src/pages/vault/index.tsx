import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { BigNumber, Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";
import VaultABI from "@/contract/Vault.json";

import VaultHeader from "@/pages/vault/header";
import VaultCard from "@/pages/vault/card";

import viewGrid from "@/assets/icon/view-grid.svg";
import miniViewGrid from "@/assets/icon/mini-view-grid.svg";
import close from "@/assets/icon/close.svg";
import ERC721ABI from "@/contract/ERC721.json";
import { useLoading } from "@/context/loading";

const Vault = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { library } = useWeb3React();
  const [, setLoading] = useLoading();
  const [assetAddress, setAssetAddress] = useState("");
  const [ownerNFTs, setOwnerNFTs] = useState<any[]>([]);
  const [allHolding, setAllHolding] = useState<number[]>([]);

  useEffect(() => {
    getHoldings().then();
    getNFTAssetAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getNFTInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allHolding]);

  const getHoldings = async () => {
    const address = params.address!;
    const contract = new Contract(address, VaultABI, library.getSigner());
    const holdings = await contract.allHoldings();
    setAllHolding(holdings.map((item: BigNumber) => item.toNumber()));
  };

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

  const getNFTInfo = async () => {
    setLoading(true);
    const contract = new Contract(assetAddress, ERC721ABI, library.getSigner());

    const ownerNFTs: any[] = [];
    await Promise.all(
      allHolding.map(async (item, index) => {
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

  return (
    <Fragment>
      <main className="flex-1 flex relative flex-wrap md:flex-nowrap">
        <section
          className="nft-list border-l relative sm:static pb-12 flex-1 flex flex-col border-r
                    dark:border-gray-600 dark:border-opacity-50 border-gray-300 dark:bg-gray-700 bg-gray-100"
        >
          <VaultHeader address={params?.address} />
          <div className="dark:bg-gray-700 bg-gray-100">
            <div className="px-3 py-6 sm:px-6">
              <div className="mb-2 text-sm flex items-center justify-between">
                {allHolding.length} items
                <div className="flex space-x-1">
                  <button className="inline-flex items-center justify-center outline-none font-medium rounded-md break-word hover:outline focus:outline-none focus:ring-1 focus:ring-opacity-75 py-1.5 px-2 text-xs bg-transparent border border-pink-500 dark:text-white text-lm-gray-800 hover:bg-pink-500 hover:bg-opacity-10 focus:ring-pink-700">
                    <span className="text-center">
                      <img src={viewGrid} alt="" className="h-5 w-5" />
                    </span>
                  </button>
                  <button className="inline-flex items-center justify-center outline-none font-medium rounded-md break-word hover:outline focus:outline-none focus:ring-1 focus:ring-opacity-75 py-1.5 px-2 text-xs bg-transparent dark:text-white text-lm-gray-900 border border-transparent hover:border-opacity-50 hover:border-pink-500 focus:ring-pink-700">
                    <span className="text-center">
                      <img src={miniViewGrid} alt="" className="h-5 w-5" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="pb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 sm:gap-4 gap-2 ">
            {ownerNFTs.map((item, index) => (
              <VaultCard key={index} {...item} callback={() => {}} />
            ))}
          </div>
        </section>
        <aside className="flex-1 w-full md:w-1/3 md:max-w-xs 2xl:max-w-sm z-20 text-[#6D5F68]">
          <div className="md:block md:sticky md:top-18 hide-scroll">
            <div className="block p-6 sm:p-10 md:p-6 md:mb-8">
              <div>
                <h3 className="mb-4 text-xl text-center dark:text-gray-50 text-lm-gray-600">
                  Select NFTs to buy
                </h3>
                <button
                  className="inline-flex items-center justify-center outline-none font-medium rounded-md break-word hover:outline focus:outline-none focus:ring-1 focus:ring-opacity-75 py-6 px-12 w-full bg-gradient-to-b text-white from-gray-700 to-black focus:ring-gray-800 cursor-not-allowed opacity-90"
                  disabled={true}
                >
                  Buy Now
                </button>
              </div>
              <div>
                <div className="hidden relative flex justify-between items-center mb-4 pb-2">
                  <h4 className="font-bold">You're Buying (1)</h4>
                </div>
                <div className="hidden max-h-2/5-screen border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="flex flex-col-reverse">
                    <div className="mt-4">
                      <div className="flex items-center justify-between dark:text-gray-50 text-lm-gray-900 break-all">
                        <div className="inline-flex items-center">
                          <img
                            loading="lazy"
                            src="https://img.seadn.io/files/333d4fc1315e455bc3e9688f0c4c2456.png?h=250&amp;w=250&amp;auto=format"
                            className="w-8 h-8 object-cover flex-none rounded-md"
                            alt="CRYPTOPUNKS"
                          />
                          <div className="flex-1 ml-2 overflow-hidden">
                            <h4 className="text-sm font-bold leading-tight">
                              #9215
                            </h4>
                            <p className="text-xs dark:text-white text-lm-gray-900 text-opacity:20 dark:text-opacity-80 truncate">
                              CRYPTOPUNKS
                            </p>
                          </div>
                        </div>
                        <button
                          className="focus:ring-0 focus:outline-none ml-2"
                          aria-label="remove"
                        >
                          <img
                            src={close}
                            alt=""
                            className="h-5 w-5 dark:text-gray-500 dark:hover:text-gray-200 text-lm-gray-600 hover-text-lm-gray-300"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <aside className="mt-8 text-center">
                  <h4 className="mb-2 dark:text-gray-300 text-gray-600">
                    Looking for advanced features?
                  </h4>
                  <div className="flex space-x-4 px-6">
                    <button
                      className="p-2 uppercase text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white
                      rounded-md flex-1 hover:bg-opacity-75"
                      onClick={() => navigate(`/vault/${params.address}/mint`)}
                    >
                      Mint
                    </button>
                    <button
                      className="p-2 uppercase text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white
                        rounded-md flex-1 hover:bg-opacity-75"
                      onClick={() =>
                        navigate(`/vault/${params.address}/redeem`)
                      }
                    >
                      Redeem
                    </button>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </Fragment>
  );
};

export default Vault;
