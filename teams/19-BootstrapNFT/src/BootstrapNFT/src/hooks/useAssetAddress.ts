import { useEffect, useState } from "react";
import { Contract } from "ethers";
import VaultABI from "@/contract/Vault.json";
import { useWeb3React } from "@web3-react/core";

const useAssetAddress = (contractAddress: string): { address: string } => {
  const { library } = useWeb3React();
  const [address, setAddress] = useState("");
  useEffect(() => {
    (async () => {
      const contract = new Contract(
        contractAddress,
        VaultABI,
        library.getSigner()
      );
      const res = await contract.assetAddress();
      setAddress(res);
    })();
  }, []);

  return { address };
};

export default useAssetAddress;
