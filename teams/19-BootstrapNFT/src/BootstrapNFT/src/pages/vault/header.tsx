import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { gql, request } from "graphql-request";
import rinkeby from "@/config/rinkeby.json";

const VaultHeader = ({ address, type }: any) => {
  const navigator = useNavigate();
  const [token, setToken] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    getToken();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getToken = async () => {
    const query = gql`
        query {
          vault(id: "${address}") {
            token {
              id
              name
              symbol
            }
          }
        }
    `;
    request(rinkeby.nftSubgraphUrl, query).then((res) => {
      if (res.vault.token) {
        setToken(res.vault.token);
      }
    });
  };

  return (
    <header
      className="lg:flex justify-between items-center py-2 px-4 sm:px-6 lg:h-16 dark:bg-gray-800
           sticky top-14 sm:top-18 bg-blue-primary z-10"
    >
      <div className="flex items-center">
        <div className="inline-flex items-center">
          <img
            className="w-10 h-10 bg-cover"
            src="https://res.cloudinary.com/nftx/image/fetch/w_150,h_150,f_auto/https://raw.githubusercontent.com/NFTX-project/nftx-assets/main/vaults-v2/0/256x256.png"
            alt="PUNK"
          />
          <div className="flex-1 ml-2 overflow-hidden">
            <h4 className="text-lg font-bold leading-tight">{token.name}</h4>
            <p
              className="text-sm dark:text-white text-lm-gray-900 text-opacity:20
                                        dark:text-opacity-80 truncate"
            >
              {token.symbol}
            </p>
          </div>
        </div>
        <div className="flex items-center md:hidden ml-auto">
          <button className="inline-flex items-center justify-center outline-none font-medium rounded-md break-word hover:outline focus:outline-none focus:ring-1 focus:ring-opacity-75 py-1.5 px-2 text-xs bg-white text-gray-900 hover:bg-gray-100 focus:ring-gray-300 dark:bg-gray-700 dark:text-white text-sm p-2 rounded">
            Filters
          </button>
        </div>
      </div>
      <div className="xl:ml-2 mt-2 lg:mt-0 flex-none flex flex-nowrap space-x-2 justify-between">
        <button
          className={`btn-second 
                        ${
                          type === "redeem"
                            ? "bg-gradient-to-b from-purple-primary to-purple-900 hover:from-purple-primary hover:to-purple-primary"
                            : ""
                        }`}
          onClick={() => navigator(`/vault/${address}/redeem`)}
        >
          Redeem
        </button>
        <button
          className={`btn-second
                    ${
                      type === "mint"
                        ? "bg-gradient-to-b from-purple-primary to-purple-900 hover:from-purple-primary hover:to-purple-primary"
                        : ""
                    }`}
          onClick={() => navigator(`/vault/${address}/mint`)}
        >
          Mint
        </button>
        <button
          className={`btn-second ${
            type === "swap"
              ? "bg-gradient-to-b from-purple-primary to-purple-900 hover:from-purple-primary hover:to-purple-primary"
              : ""
          }`}
          onClick={() => navigator(`/vault/${address}/swap`)}
        >
          Swap
        </button>
        <button
          className="btn-second"
          onClick={() => navigator(`/vault/${address}/info`)}
        >
          Info
        </button>
      </div>
    </header>
  );
};

export default VaultHeader;
