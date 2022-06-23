import { Fragment, useEffect, useState } from "react";
import Card from "@/components/card";
import { useLoading } from "@/context/loading";
import rinkeby from "@/config/rinkeby.json";
import { gql, request } from "graphql-request";
import { Contract } from "ethers";
import { useWeb3React } from "@web3-react/core";
import ERC721ABI from "@/contract/ERC721.json";

const Home = () => {
  const { active, library } = useWeb3React();
  const [vaults, setVaults] = useState<any[]>([]);
  const [, setLoading] = useLoading();

  useEffect(() => {
    getVaults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const getVaults = () => {
    if (!active) {
      return;
    }
    setLoading(true);
    const query = gql`
      query {
        vaults(
          where: { isFinalized: true }
          orderBy: "totalMints"
          orderDirection: "desc"
        ) {
          id
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
    <Fragment>
      <main className="flex-1 flex flex-col px-4 xl:px-8 2xl:p-12 pt-12 text-purple-second">
        <section>
          <header>
            <h1 className="font-bold text-3xl mb-2">Buy NFTs</h1>
            <p className="mb-4">Browse the decentralized NFT marketplace.</p>
          </header>
          <div className="bg-gradient-to-r from-transparent to-purple-primary h-px mb-4"></div>
          <div className="flex justify-between items-center sm:items-start space-x-4">
            <h3 className="uppercase mb-4 mt-4 font-bold text-xl inline-block">
              All Collections
            </h3>
          </div>
          <div
            className="pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5
                       sm:gap-4 gap-2 "
          >
            {vaults.map((nft, index) => (
              <Card key={index} {...nft} />
            ))}
          </div>
        </section>
      </main>
    </Fragment>
  );
};

export default Home;
