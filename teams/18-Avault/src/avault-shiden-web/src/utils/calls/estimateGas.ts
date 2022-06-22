import { DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE } from 'config';
import { ethers, Contract } from 'ethers';

/**
 * Estimate the gas needed to call a function, and add a 10% margin
 * @param contract Used to perform the call
 * @param methodName The name of the methode called
 * @param gasMarginPer10000 The gasMargin per 10000 (i.e. 10% -> 1000)
 * @param args An array of arguments to pass to the method
 * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
 */
export const estimateGas = async (
  contract: Contract,
  methodName: string,
  methodArgs: any[],
  gasMarginPer10000: number,
) => {
  try {
    if (!contract[methodName]) {
      throw new Error(`Method ${methodName} doesn't exist on ${contract.address}`);
    }
    const rawGasEstimation = await contract.estimateGas[methodName](...methodArgs);
    // By convention, ethers.BigNumber values are multiplied by 1000 to avoid dealing with real numbers
    const gasEstimation = rawGasEstimation
      .mul(ethers.BigNumber.from(10000).add(ethers.BigNumber.from(gasMarginPer10000)))
      .div(ethers.BigNumber.from(10000));
    return gasEstimation;
  } catch (e) {
    return DEFAULT_GAS_LIMIT;
  }
};

/**
 * Perform a contract call with a gas value returned from estimateGas
 * @param contract Used to perform the call
 * @param methodName The name of the methode called
 * @param args An array of arguments to pass to the method
 * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
 */
export const callWithEstimateGas = async (
  contract: Contract,
  methodName: string,
  methodArgs: any[] = [],
  overrides: any = {},
): Promise<ethers.providers.TransactionResponse | any> => {
  const gasEstimation = await estimateGas(contract, methodName, methodArgs, 1000);
  try {
    // console.log(111, methodArgs, overrides);
    const tx = await contract[methodName](...methodArgs, {
      gasLimit: gasEstimation,
      // gasLimit: DEFAULT_GAS_LIMIT,
      gasPrice: DEFAULT_GAS_PRICE,
      ...overrides,
    });
    // console.log(tx);
    const receipt = await tx.wait();
    if (receipt.status) {
      // console.log(receipt);
      return {
        receipt: receipt,
        isOk: true,
      };
    } else {
      console.log(receipt);
      return {
        isOk: false,
        message: 'Some Error',
      };
    }
  } catch (e: any) {
    console.log(e);
    return {
      isOk: false,
      message: e?.message,
    };
  }
};
export const callWithStatic = ({
  contract,
  methodName,
  methodArgs = [],
}: {
  contract: Contract;
  methodName: string;
  methodArgs?: any[];
}) => {
  return contract.callStatic[methodName](...methodArgs);
};
