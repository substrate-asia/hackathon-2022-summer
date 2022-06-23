const CreateForm = ({
  nftAssetAddress,
  vaultName,
  vaultSymbol,
  setNftAssetAddress,
  setVaultName,
  setVaultSymbol,
  changeState,
}: any) => {
  const checkInput = () => {
    return !!(nftAssetAddress && vaultName && vaultSymbol);
  };

  return (
    <form action="#" autoComplete="off">
      <h1 className="text-2xl font-bold text-center mb-4 text-purple-second">
        Create NFT Vault
      </h1>
      <div
        className="p-4 border dark:border-teal-500 border-teal-900 dark:bg-teal-900
                                    bg-teal-200 dark:text-white rounded-md text-sm"
      >
        <b>Note:</b> Fees and eligibilities can be set after vault creation, but
        the name and symbol cannot. Please consult our
        <a
          href="https://docs.nftx.io/tutorials/vault-creation"
          target="_blank"
          className="underline hover:no-underline"
          rel="noopener noreferrer"
        >
          create vault tutorial
        </a>
        for details, and if you have any questions or concerns, please reach out
        to us in
        <a
          href="https://discord.com/invite/hytQVM5ZxR"
          target="_blank"
          className="underline hover:no-underline"
          rel="noopener noreferrer"
        >
          Discord
        </a>
        .
      </div>
      <fieldset className="mt-6">
        <div className="relative">
          {/*<img*/}
          {/*    src="https://lh3.googleusercontent.com/jsfhye5yrhOSusDCKXquKoMQbYs-B8Nm3V2B5fZB-Hee9ag9MXwm8scvd8wuSpp8TE49oXBcWr4XMCRfzq1OA3p59s59hn_9bCzURA=s120"*/}
          {/*    className="absolute bottom-5 left-4 h-6 w-6" />*/}
          <input
            name="assetAddress"
            id="assetAddress"
            className="border text-lg font-mono transition-colors dark:border-gray-600
                           border-lm-gray-300 p-4 pt-8 rounded-sm dark:text-white text-gray-700
                           bg-white dark:bg-black dark:bg-opacity-50 w-full focus:outline-none
                           focus:border-purple-primary focus:ring-0"
            defaultValue={nftAssetAddress}
            onChange={(e) => setNftAssetAddress(e.target.value)}
          />
          <label
            className={`absolute transition-position duration-100 left-4 cursor-text dark:text-white text-lm-gray-900 ${
              nftAssetAddress
                ? "top-3 text-xs opacity-70 font-bold"
                : "opacity-50 top-9"
            }`}
            htmlFor="assetAddress"
          >
            NFT Asset Address
          </label>
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <div className="relative">
          <input
            name="name"
            id="name"
            className="   border text-lg font-mono
                                        transition-colors dark:border-gray-600 border-lm-gray-300 p-4 pt-8 rounded-sm
                                        dark:text-white text-gray-700 bg-white dark:bg-black dark:bg-opacity-50 w-full
                                        focus:outline-none focus:border-purple-primary focus:ring-0"
            defaultValue={vaultName}
            onChange={(e) => setVaultName(e.target.value)}
          />
          <label
            className={`absolute transition-position duration-100 left-4 cursor-text dark:text-white text-lm-gray-900 ${
              vaultName
                ? "top-3 text-xs opacity-70 font-bold"
                : "opacity-50 top-9"
            }`}
            htmlFor="name"
          >
            Vault Name
          </label>
        </div>
      </fieldset>
      <span className="text-xs mt-2 text-gray-400">
        Use the full asset name, e.g. CryptoPunks, and do not include the word
        'vault'.
      </span>
      <fieldset className="mt-6">
        <div className="relative">
          <input
            name="symbol"
            id="symbol"
            className="uppercase border text-lg font-mono transition-colors dark:border-gray-600
                          border-lm-gray-300 p-4 pt-8 rounded-sm dark:text-white text-gray-700 bg-white
                          dark:bg-black dark:bg-opacity-50 w-full focus:outline-none focus:border-purple-primary focus:ring-0"
            defaultValue={vaultSymbol}
            onChange={(e) => setVaultSymbol(e.target.value)}
          />
          <label
            className={`absolute transition-position duration-100 left-4 cursor-text dark:text-white text-lm-gray-900 ${
              vaultSymbol
                ? "top-3 text-xs opacity-70 font-bold"
                : "opacity-50 top-9"
            }`}
            htmlFor="symbol"
          >
            Vault Symbol
          </label>
        </div>
      </fieldset>
      <span className="text-xs mt-2 text-gray-400">
        We recommend vault symbols be singular, e.g. PUNK, and max 6 characters.
      </span>
      <button
        className={`inline-flex items-center justify-center outline-none font-medium
            rounded-md break-word hover:outline focus:outline-none focus:ring-1
            focus:ring-opacity-75 py-6 px-12 w-full bg-gradient-to-b from-purple-primary to-purple-900
            text-white hover:from-purple-primary hover:purple-primary
            opacity-90 mt-8 ${
              checkInput() ? "cursor-pointer" : "cursor-not-allowed"
            }`}
        type="button"
        onClick={() => {
          changeState();
        }}
      >
        Review
      </button>
    </form>
  );
};

export default CreateForm;
