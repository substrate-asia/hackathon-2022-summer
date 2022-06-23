import { gql, request } from "graphql-request";
import rinkeby from "@/config/rinkeby.json";
import { useParams } from "react-router";
import { useEffect, useState } from "react";

const VaultInfo = () => {
    const params = useParams();
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [vaultId, setVaultId] = useState("");
    const [holdingItem, setHoldingItem] = useState("");
    const [vaultAddress, setVaultAddress] = useState("");
    const [assetAddress, setAssetAddress] = useState("");
    const [totalHoldings, setTotalHoldings] = useState("0");

    useEffect(() => {
        getInfo();
    }, []);

    const getInfo = () => {
        const query = gql`
            query {
                vault(id: "${params.address}") {
                    id
                    vaultId
                    token {
                        name
                        symbol
                    }
                    asset {
                        id
                    }
                    holdings {
                        id
                        tokenId
                    }
                    totalHoldings
                }
            }
        `;
        request(rinkeby.nftSubgraphUrl, query)
            .then(async (data) => {
                if (data.vault) {
                    const vault = data.vault;
                    console.log("vault info :", data);
                    setName(vault.token.name);
                    setSymbol(vault.token.symbol);
                    setVaultId(vault.vaultId);
                    setVaultAddress(vault.id);
                    setAssetAddress(vault.asset.id);
                    setTotalHoldings(vault.totalHoldings);

                    const holdings = vault.holdings
                        .map((item: any) => {
                            return item.tokenId;
                        })
                        .join(",");
                    setHoldingItem(holdings);
                }
            })
            .catch((err) => {});
    };

    return (
        <main className="flex-1 flex flex-col px-4 xl:px-8 2xl:p-12 py-12 text-purple-second">
            <div className="my-10 mx-20 max-w-lg w-full">
                <h1 className="font-bold text-2xl mb-10">Vault Detail</h1>
                <div>
                    <h4 className="font-bold">Vault ID</h4>
                    {vaultId}
                </div>
                <div>
                    <h4 className="font-bold mt-6">Holdings</h4>
                    {totalHoldings}
                </div>
                <div>
                    <h4 className="font-bold mt-6">Vault Address</h4>
                    {vaultAddress}
                </div>
                <div>
                    <h4 className="font-bold mt-6">NFT Address</h4>
                    {assetAddress}
                </div>
                <div>
                    <h4 className="font-bold mt-6">Items ({totalHoldings})</h4>
                    {holdingItem}
                </div>
            </div>
        </main>
    );
};

export default VaultInfo;
