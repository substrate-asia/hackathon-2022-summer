import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { useLoading } from "@/context/loading";
import { gql, request } from "graphql-request";
import rinkeby from "@/config/rinkeby.json";
import { Contract } from "ethers";
import ERC721ABI from "@/contract/ERC721.json";
import Card from "@/components/card";

const OwnerVault = () => {
  const { account, active, library } = useWeb3React();
  const [vaults, setVaults] = useState<any[]>([]);
  const [, setLoading] = useLoading();

  useEffect(() => {
    getVaults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, account]);

  const getVaults = () => {
    if (!active) {
      return;
    }
    setLoading(true);
    const query = gql`
            query {
                vaults(where: {manager: "${account?.toLowerCase()}"}, orderBy: "totalMints", orderDirection: "desc") {
                    id
                    manager {
                        id
                    }
                    vaultId
                    token {
                        id
                        name
                        symbol
                    }
                    asset {
                        id
                        name
                        symbol
                    }
                    mints {
                        id
                        date
                        nftIds
                    }
                }
            }
        `;
    request(rinkeby.nftSubgraphUrl, query)
      .then(async (data) => {
        if (data.vaults) {
          console.log("data", data);
          await getNftInfo(data.vaults);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getNftInfo = async (vaults: any[]) => {
    await Promise.all(
      vaults.map(async (item) => {
        console.log("vault item", item);
        const contract = new Contract(
          item.asset.id,
          ERC721ABI,
          library.getSigner()
        );
        try {
          const url = await contract.tokenURI(item.mints[0].nftIds[0]);
          const res = await fetch(url);
          const result = await res.json();
          item.image = result.image;
          item.symbolImage = result.image;
        } catch (e) {
          item.image = "/images/cover.png";
          item.symbolImage = "/images/cover.png";
          console.log("get nft images error:", e);
        }
        return item;
      })
    )
      .then((res) => {
        console.log("promise vaults", res);
        setVaults(res);
      })
      .catch((e) => {
        console.log("get nft error", e);
      });
  };

  return (
    <main className="flex-1 flex gap-x-6 relative flex-wrap md:flex-nowrap text-purple-second py-8 px-20 pb-28">
      <section className="flex-1">
        <header>
          <h1 className="font-bold text-3xl mb-2">Owner Vaults</h1>
          <p className="mb-4">All unpublished vaults you have created.</p>
        </header>
        <div className="bg-gradient-to-r from-transparent to-purple-primary h-px mb-4"></div>

        <div
          className="pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5
                       sm:gap-4 gap-2 mt-8"
        >
          {vaults.map((nft, index) => (
            <Card key={index} {...nft} isManage={true} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default OwnerVault;
