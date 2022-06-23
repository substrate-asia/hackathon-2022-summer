import { truncateAddress } from "@/util/address";

const Review = ({ address, name, symbol, create }: any) => {
  return (
    <div
      className="rounded-md shadow-xl dark:text-white text-lm-gray-700 dark:bg-gray-800 bg-lm-gray-100 border
            dark:border-gray-700 border-transparent p-6 text-purple-second"
    >
      <form action="#" autoComplete="off">
        <h1 className="text-2xl font-bold text-center mb-4">
          Review your Vault
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
        <div className="mt-8 p-4 border border-orange-500 bg-orange-800 rounded-md text-sm">
          Please be aware that bootstrapping a successful vault requires up to 3
          transactions — one to create the vault, one to add inventory (NFTs)
          and liquidity (ETH), and one to publish. For more information please
          visit
          <a
            href="https://discord.com/invite/hytQVM5ZxR"
            target="_blank"
            className="underline hover:no-underline"
            rel="noreferrer"
          >
            our discord
          </a>
          .
        </div>
        <div className="text-center">
          <button
            className="inline-flex items-center justify-center outline-none font-medium rounded-md
              break-word hover:outline focus:outline-none focus:ring-1 focus:ring-opacity-75 py-6 px-12 w-full
              bg-gradient-to-b from-purple-primary to-purple-900 text-white hover:from-purple-primary hover:to-purple-primary mt-8"
            type="button"
            onClick={create}
          >
            Create Vault
          </button>
          {/*<button className="mt-6 text-white">Edit</button>*/}
        </div>
      </form>
    </div>
  );
};

export default Review;
