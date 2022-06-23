import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useWeb3React } from "@web3-react/core";

import coinbase from "@/assets/icon/coinbase-wallet.svg";
import walletconnect from "@/assets/icon/walletconnect.svg";
import metamaskFox from "@/assets/icon/metamask-fox.svg";
import { connectors } from "@/components/select_wallet/connector";
import { truncateAddress } from "@/util/address";

const enum WalletType {
  COINBASE = "coinbaseWallet",
  WALLETCONNECT = "walletConnect",
  INJECTED = "injected",
}

const SelectWallet = ({ isOpen, onClose }: any) => {
  const { activate, active, account, deactivate } = useWeb3React();
  const [changeWallet, setChangeWallet] = useState(false);

  const setProvider = (type: string) => {
    window.localStorage.setItem("provider", type);
  };

  const getProvider = () => {
    return window.localStorage.getItem("provider");
  };

  const refreshState = () => {
    window.localStorage.setItem("provider", "");
  };

  const disconnect = () => {
    refreshState();
    deactivate();
  };

  const closeModal = () => {
    setChangeWallet(false);
    onClose();
  };

  const activeWalletType = () => {
    const type = getProvider();
    let image = null;
    switch (type) {
      case WalletType.INJECTED:
        image = metamaskFox;
        break;
      case WalletType.COINBASE:
        image = coinbase;
        break;
      case WalletType.WALLETCONNECT:
        image = walletconnect;
        break;
      default:
        image = "";
        break;
    }
    return (
      <img src={image} alt="metamask" className="inline-flex h-6 w-6 mr-4" />
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {changeWallet || !active ? (
                <Dialog.Panel
                  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6
                                text-left align-middle shadow-xl transition-all"
                >
                  <Dialog.Title
                    as="h3"
                    className="mb-4 font-bold text-xl leading-6 text-gray-900"
                  >
                    Select Wallet
                  </Dialog.Title>
                  <div>
                    <div
                      className="p-3 cursor-pointer opacity-100 break-words min-h-full
                              rounded-lg dark:text-gray-50 text-lm-gray-700 border  transition-colors
                              duration-300 ease-in-out border-transparent  bg-lm-gray-100 hover:bg-purple-primary
                              hover:bg-opacity-10 mb-2 flex justify-between items-center"
                      onClick={() => {
                        console.log("connect metamsk");
                        activate(connectors.injected);
                        setProvider(WalletType.INJECTED);
                        closeModal();
                      }}
                    >
                      <div className="w-8 h-8 flex justify-center">
                        <img className="" alt="metamask" src={metamaskFox} />
                      </div>
                      MetaMask
                    </div>
                    <div
                      className="p-3 cursor-pointer opacity-100 break-words min-h-full
                              rounded-lg dark:text-gray-50 text-lm-gray-700 border  transition-colors
                              duration-300 ease-in-out border-transparent  bg-lm-gray-100 hover:bg-purple-primary
                              hover:bg-opacity-10 mb-2 flex justify-between items-center"
                      onClick={() => {
                        console.log("connect walletConnect");
                        activate(connectors.walletConnect);
                        setProvider(WalletType.WALLETCONNECT);
                        closeModal();
                      }}
                    >
                      <div className="w-8 h-8 flex justify-center">
                        <img
                          className=""
                          alt="WalletConnect"
                          src={walletconnect}
                        />
                      </div>
                      WalletConnect
                    </div>
                    <div
                      className="p-3 cursor-pointer opacity-100 break-words min-h-full
                              rounded-lg dark:text-gray-50 text-lm-gray-700 border  transition-colors
                              duration-300 ease-in-out border-transparent  bg-lm-gray-100 hover:bg-purple-primary
                               hover:bg-opacity-10 mb-2 flex justify-between items-center"
                      onClick={() => {
                        console.log("connect coinbaseWallet");
                        activate(connectors.coinbaseWallet);
                        setProvider(WalletType.COINBASE);
                        closeModal();
                      }}
                    >
                      <div className="w-8 h-8 flex justify-center">
                        <img className="" alt="WalletConnect" src={coinbase} />
                      </div>
                      Coinbase Wallet
                    </div>
                  </div>
                  <div className="mt-8 text-center">
                    <button
                      className="btn-primary px-6 py-3"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              ) : (
                <Dialog.Panel
                  className="w-full max-w-md transform overflow-hidden
                                    rounded-2xl bg-white p-6
                                    text-left align-middle shadow-xl transition-all"
                >
                  <Dialog.Title
                    as="h3"
                    className="mb-4 font-bold text-xl leading-6 text-gray-900"
                  >
                    Connect Wallet
                  </Dialog.Title>
                  <div
                    className="font-mono flex items-center rounded-md shadow-xl dark:text-white
                                        text-lm-gray-700 dark:bg-gray-800 bg-lm-gray-100 border dark:border-gray-700
                                        border-transparent p-6"
                  >
                    {activeWalletType()}
                    {account && truncateAddress(account!)}
                    <button
                      type="button"
                      title="Copy to clipboard"
                      className="ml-auto dark:text-white text-gray-900 relative p-1 h-6 w-6 dark:bg-white
                                            bg-gray-900 bg-opacity-10 dark:bg-opacity-10 rounded-full inline-flex
                                            items-center justify-center focus:outline-none focus:ring-0"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -top-2 whitespace-nowrap text-xs
                                                      transition-all opacity-0"
                      >
                        Got it!
                      </span>
                    </button>
                  </div>
                  <div className="mt-8 text-center space-x-4">
                    <button
                      className="btn-second py-3 px-6 bg-gray-200 hover:bg-purple-primary hover:text-white"
                      onClick={() => {
                        console.log("connecting to metamask");
                        setChangeWallet(true);
                      }}
                    >
                      Change Wallet
                    </button>
                    <button
                      className="btn-primary px-6 py-3"
                      onClick={disconnect}
                    >
                      Disconnect
                    </button>
                  </div>
                </Dialog.Panel>
              )}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SelectWallet;
