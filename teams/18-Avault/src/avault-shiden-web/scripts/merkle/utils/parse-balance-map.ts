import { BigNumber, utils } from 'ethers';
import BalanceTree from './balance-tree';
const { isAddress, getAddress } = utils;

interface MerkleDistributorInfo {
  merkleRoot: string;
  tokenTotal: string;
  claims: {
    [account: string]: {
      index: number;
      amount: string;
      proof: string[];
      flags?: {
        [flag: string]: boolean;
      };
    };
  };
}
type OldFormat = { [account: string]: number | string };
type NewFormat = { address: string; earnings: string; reasons: string };
export function parseBalanceMap(balances: OldFormat | NewFormat[]): MerkleDistributorInfo {
  const balancesInNewFormat: NewFormat[] = Array.isArray(balances)
    ? balances
    : Object.keys(balances).map(
        (account): NewFormat => ({
          address: account,
          earnings: `0x${balances[account].toString()}`,
          reasons: '',
        }),
      );
  const dataByAddress = balancesInNewFormat.reduce<{
    [address: string]: { amount: BigNumber; flags?: { [flag: string]: boolean } };
  }>((memo, { address: account, earnings, reasons }) => {
    // console.log(earnings);
    if (!isAddress(account)) {
      throw new Error(`Found invalid address: ${account}`);
    }
    const parsed = getAddress(account);
    if (memo[parsed]) throw new Error(`Duplicate address: ${parsed}`);
    const parsedNum = BigNumber.from(earnings);
    // console.log("parsedNum: ", parsedNum);
    if (parsedNum.lte(0)) throw new Error(`Invalid amount for account: ${account}`);
    const flags = {
      isSOCKS: reasons.includes('socls'),
      isLP: reasons.includes('lp'),
      isUser: reasons.includes('user'),
    };
    memo[parsed] = { amount: parsedNum, ...(reasons === '' ? {} : { flags }) };
    return memo;
  }, {});

  const sortedAddresses = Object.keys(dataByAddress).sort();

  const tree = new BalanceTree(
    sortedAddresses.map((address) => ({ account: address, amount: dataByAddress[address].amount })),
  );
  const claims = sortedAddresses.reduce<{
    [address: string]: { amount: string; index: number; proof: string[]; flags?: { [flag: string]: boolean } };
  }>((memo, address, index) => {
    const { amount, flags } = dataByAddress[address];
    memo[address] = {
      index,
      amount: amount.toHexString(),
      proof: tree.getProof(index, address, amount),
      ...(flags ? { flags } : {}),
    };
    return memo;
  }, {});
  const tokenTotal: BigNumber = sortedAddresses.reduce<BigNumber>(
    (memo, key) => memo.add(dataByAddress[key].amount),
    BigNumber.from(0),
  );
  return {
    merkleRoot: tree.getHexRoot(),
    tokenTotal: tokenTotal.toHexString(),
    claims,
  };
}
