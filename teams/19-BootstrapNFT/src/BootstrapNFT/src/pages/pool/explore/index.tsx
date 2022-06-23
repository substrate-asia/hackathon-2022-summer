import { Fragment, useEffect, useState } from "react";
import { gql, request } from "graphql-request";
import rinkby from "@/config/rinkeby.json";
import Tokens from "@/config/tokens.json";
import { truncateAddress } from "@/util/address";
import Pie from "@/components/pie";
import { ethers } from "ethers";
import { useNavigate } from "react-router";

const PoolExplore = () => {
  const navigate = useNavigate();
  const [pools, setPools] = useState<any[]>([]);

  useEffect(() => {
    getPoolList();
  }, []);

  const getPoolList = async () => {
    let query = gql`
      {
        pools(
          where: {
            active: true
            tokensCount_gt: 1
            crpController: "0x4Fd1A47106A2c18DE14941e99648762ed32A875d"
            tokensList_not: []
          }
          first: 20
          skip: 0
          orderBy: "liquidity"
          orderDirection: "desc"
        ) {
          id
          publicSwap
          finalized
          crp
          rights
          swapFee
          totalWeight
          totalShares
          totalSwapVolume
          liquidity
          tokensList
          swapsCount
          tokens(orderBy: "denormWeight", orderDirection: "desc") {
            id
            address
            balance
            decimals
            symbol
            denormWeight
          }
          swaps(
            first: 1
            orderBy: "timestamp"
            orderDirection: "desc"
            where: { timestamp_lt: 1654758000 }
          ) {
            poolTotalSwapVolume
          }
        }
      }
    `;

    query = gql`
      {
        pools(
          where: {
            active: true
            tokensCount_gt: 1
            crp: true
            tokensList_not: []
          }
          first: 20
          skip: 0
          orderBy: "liquidity"
          orderDirection: "desc"
        ) {
          id
          publicSwap
          finalized
          crp
          rights
          swapFee
          totalWeight
          totalShares
          totalSwapVolume
          liquidity
          tokensList
          swapsCount
          tokens(orderBy: "denormWeight", orderDirection: "desc") {
            id
            address
            balance
            decimals
            symbol
            denormWeight
          }
          swaps(
            first: 1
            orderBy: "timestamp"
            orderDirection: "desc"
            where: { timestamp_lt: 1655010000 }
          ) {
            poolTotalSwapVolume
          }
        }
      }
    `;

    request(rinkby.subgraphUrl, query).then((data) => {
      if (data.pools) {
        const tokenInfo = Tokens.tokens as unknown as { [key: string]: any };
        data.pools.map((pool: any) => {
          pool.tokens.map((token: any) => {
            const address = ethers.utils.getAddress(token.address);
            token.color = tokenInfo[address]
              ? tokenInfo[address]["color"]
              : "#7ada6a";
            return token;
          });
          return pool;
        });
      }
      console.log("data", data);
      setPools(data.pools);
    });
  };

  return (
    <Fragment>
      <main className="flex-1 flex flex-col px-4 xl:px-8 2xl:p-12 2xl:pb-28 py-12 text-purple-second">
        <section>
          <header>
            <h1 className="font-bold text-3xl mb-2">Explore Pool</h1>
          </header>
          <div className="bg-gradient-to-r from-transparent to-purple-primary h-px mb-4"></div>
        </section>
        <section>
          <div className="rounded mt-4 bg-blue-primary px-8 pt-10 pb-20 rounded-lg">
            <div className="flex items-center px-4 py-3 text-right bg-purple-second bg-opacity-10 rounded-lg">
              <div className="text-left w-1/12">Pool address</div>
              <div className="flex-auto text-left">Asset</div>
              <div className="w-1/12">Swap fee</div>
              <div className="w-1/12">Market cap</div>
              <div className="w-1/12">My liquidity</div>
              <div className="w-1/12">Volume (24h)</div>
            </div>
            {pools.map((item, index) => {
              return (
                <div
                  className="border-b border-purple-second border-opacity-30  hover:bg-purple-900 cursor-pointer"
                  onClick={() => {
                    navigate(`/pool/${item.id}/manage`);
                  }}
                >
                  <div className="px-4 py-4 flex text-right">
                    <div className="text-left w-1/12">
                      {truncateAddress(item.id)}
                    </div>
                    <div className="flex flex-auto gap-x-2 items-center text-left">
                      <Pie size={34} values={item.tokens} />
                      <span>
                        {" "}
                        {parseFloat(item.tokens[0].denormWeight).toFixed(
                          1
                        )} % {item.tokens[0].symbol}{" "}
                      </span>
                      <span>
                        {" "}
                        {parseFloat(item.tokens[1].denormWeight).toFixed(
                          1
                        )} % {item.tokens[1].symbol}{" "}
                      </span>
                    </div>
                    <div className="w-1/12">{item.swapFee * 100} %</div>
                    <div className="w-1/12">$ {item.market}</div>
                    <div className="w-1/12">$ {item.liquidity}</div>
                    <div className="w-1/12">$ {item.market}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </Fragment>
  );
};

export default PoolExplore;
