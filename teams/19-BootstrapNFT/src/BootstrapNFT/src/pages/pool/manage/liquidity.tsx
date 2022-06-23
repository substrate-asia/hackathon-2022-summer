import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import Pie from "@/components/pie";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

const Liquidity = ({ tokens, close }: any) => {
  console.log("Liquidity", tokens);
  return (
    <Fragment>
      <Transition appear show={true}>
        <Dialog as="div" className="relative z-10" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#181141] bg-opacity-95" />
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
                <Dialog.Panel
                  className="w-full max-w-3xl transform overflow-hidden rounded-2xl
                                    bg-blue-primary p-6 text-left align-middle shadow-xl transition-all text-purple-second"
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium font-bold leading-6 text-center"
                  >
                    Add Liquidity
                  </Dialog.Title>
                  <section>
                    <div className="mx-auto border border-purple-primary w-max rounded mt-4">
                      <button className="px-2 py-1 bg-purple-primary">
                        Multi asset
                      </button>
                      <button className="px-2 py-1">Single asset</button>
                    </div>
                    <div className="mt-4 flex gap-x-4">
                      <dl className="bg-[#181141] p-4 w-max">
                        <dt className="text-white font-medium">
                          POOL OVERVIEW
                        </dt>
                        <dd className="mt-4">0xc697...9a81</dd>
                        <dd>My share: -</dd>
                        <dd className="mb-6">Swap fee: 0.1%</dd>
                        <Pie size={114} values={tokens} />
                        {tokens.map((token: any) => {
                          return (
                            <dd className="text-center mt-2">
                              {token.denormWeight}% {token.symbol}
                            </dd>
                          );
                        })}
                      </dl>
                      <div className="flex-1">
                        <div className="bg-[#181141] p-4">
                          <table className="w-full">
                            <thead className="">
                              <tr className="text-sm font-light">
                                <th className="text-left w-1/2 h-12 pl-4 rounded-l-lg">
                                  Assets
                                </th>
                                <th className="text-left">Wallet balance</th>
                                <th className="text-right pr-4 rounded-r-lg">
                                  Deposit amount
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {tokens.map((token: any, index: number) => {
                                return (
                                  <tr
                                    className="text-sm font-light border-b border-purple-second border-opacity-50"
                                    key={index}
                                  >
                                    <td>
                                      <div className="flex items-center justify-start gap-x-2 h-12">
                                        <Jazzicon
                                          diameter={22}
                                          seed={jsNumberForAddress(
                                            token.address
                                          )}
                                        />
                                        <span>{token.symbol}</span>
                                      </div>
                                    </td>
                                    <td>0</td>
                                    <td>15</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="bg-[#181141] p-4 mt-4 flex justify-between">
                          <span>ABPT Amount</span>
                          <span>- ABPT</span>
                        </div>
                      </div>
                    </div>
                    <div className="mx-auto w-max mt-4">
                      <button
                        className="inline-flex items-center justify-center outline-none font-medium
                                        rounded-md break-word hover:outline focus:outline-none focus:ring-1
                                        focus:ring-opacity-75 py-4 px-6 text-sm bg-gradient-to-b from-purple-primary
                                        to-purple-900 text-white hover:from-purple-primary hover:to-purple-primary
                                        focus:ring-pink-500 whitespace-nowrap"
                      >
                        Add Liquidity
                      </button>
                    </div>
                  </section>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Fragment>
  );
};

export default Liquidity;
