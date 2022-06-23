import { Fragment } from "react";
import { truncateAddress } from "@/util/address";
import { useNavigate } from "react-router";

const Created = ({ address, name, symbol }: any) => {
  const navigate = useNavigate();
  return (
    <Fragment>
      <div
        className="rounded-md shadow-xl dark:text-white text-lm-gray-700 dark:bg-gray-800 bg-lm-gray-100 border
            dark:border-gray-700 border-transparent p-6 text-[#6D5F68]"
      >
        <h1 className="text-2xl font-bold text-center mb-4">
          This Vault has been created!
        </h1>
        <dl className="dark:text-gray-300 text-lm-gray-700 mt-8">
          <div className="sm:flex sm:justify-between mt-4">
            <dt className="mr-4 text-sm uppercase">Asset</dt>
            <dd className="font-mono flex items-center text-sm">
              <img
                src="https://lh3.googleusercontent.com/jsfhye5yrhOSusDCKXquKoMQbYs-B8Nm3V2B5fZB-Hee9ag9MXwm8scvd8wuSpp8TE49oXBcWr4XMCRfzq1OA3p59s59hn_9bCzURA=s120"
                alt="KILLABEARS"
                className="mr-4 w-8 h-8"
              />
              <div className="text-right">
                <h4 className="uppercase font-bold">{name}</h4>
                <span className="dark:text-gray-400 text-lm-gray-600">
                  {truncateAddress(address)}
                </span>
              </div>
            </dd>
          </div>
          <div className="sm:flex sm:justify-between mt-4">
            <dt className="mr-4 text-sm uppercase">Token Standard</dt>
            <dd className="font-bold font-mono">ERC721</dd>
          </div>
          <div className="sm:flex sm:justify-between mt-4">
            <dt className="mr-4 text-sm uppercase">Vault Name</dt>
            <dd className="font-bold font-mono">{name}</dd>
          </div>
          <div className="sm:flex sm:justify-between mt-4">
            <dt className="mr-4 text-sm uppercase">Symbol</dt>
            <dd className="font-bold font-mono">{symbol}</dd>
          </div>
        </dl>
        <div className="text-center">
          <button
            className="inline-flex items-center justify-center outline-none font-medium rounded-md
                        break-word hover:outline focus:outline-none focus:ring-1 focus:ring-opacity-75 py-6 px-12
                        w-full bg-gradient-to-b from-purple-primary to-purple-900 text-white hover:from-purple-primary
                        hover:to-purple-primary mt-8"
            type="button"
            onClick={() => {
              navigate(`/vault/${address}/manage`);
            }}
          >
            Manager your Vault
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default Created;
