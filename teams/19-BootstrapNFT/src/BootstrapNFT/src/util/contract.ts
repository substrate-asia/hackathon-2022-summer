// returns the checksummed address if the address is valid, otherwise returns false
import { getAddress } from "ethers/lib/utils";
import { Contract } from "ethers";

export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

// account is not optional
function getSigner(library: any, account: string) {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
function getProviderOrSigner(library: any, account?: string) {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(
  address: string,
  ABI: any,
  library: any,
  account?: string
): Contract {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account) as any
  );
}
