import BigNumber from 'bignumber.js';
import { BSC_BLOCK_TIME } from 'config';
import { AVAT, chainId } from 'config/constants/tokens';
import { Contract } from 'ethers';
import { useContract } from 'hooks/useContract';
import { getTimeStamp, timestampToDate } from 'utils';
import { BIG_ZERO } from 'utils/bigNumber';
import multicall from 'utils/multicall';
import veAVATAbi from '../../constants/abi/veAVATAbi.json';
import AVATAbi from 'config/abi/AVATAbi.json';
import { veAVAT } from '../../constants/constants';
import { IGovernanceUserData, ILockedState } from './types';
import { getFullDisplayBalance } from 'utils/formatBalance';
// struct LockedBalance {
//   int128 amount;
//   uint256 end;
// }
export const fetchUserData = async (account: string): Promise<[Record<string, IGovernanceUserData>, ILockedState]> => {
  let userData: IGovernanceUserData = {
    AVATBalance: '',
    veAVATBalance: '',
    veAVATBalanceDisplay: '',
    AVATLocked: '',
    AVATLockedDisplay: '',
    remainderBlock: 0,
    withdrawalDate: '',
    withdrawalDateDisplay: '',
    isApproved: false,
  };
  const veAVATAddress = veAVAT.address;
  const AVATAddress = AVAT.address;
  const calls = [
    { address: veAVATAddress, name: 'locks', params: [account] },
    { address: veAVATAddress, name: 'balanceOf', params: [account] },
    { address: AVATAddress, name: 'balanceOf', params: [account] },
  ];
  const [lockData, [veAVATBalance], [AVATBalance]] = await multicall(veAVATAbi, calls);
  const { amount, end } = lockData || {
    amount: BIG_ZERO,
    end: BIG_ZERO,
  };

  let lockedState = ILockedState.init;
  const now = getTimeStamp();
  const endNumber = end.toNumber();

  if (now <= endNumber) {
    lockedState = ILockedState.locked;
    userData.remainderBlock = Math.ceil((endNumber - now) / BSC_BLOCK_TIME);
  } else if (endNumber !== 0) {
    lockedState = ILockedState.withdraw;
  }
  userData.AVATLocked = amount.toString();
  userData.withdrawalDate = end.toString();
  userData.AVATBalance = AVATBalance.toString();
  userData.veAVATBalance = veAVATBalance.toString();

  userData.veAVATBalanceDisplay = getFullDisplayBalance(new BigNumber(userData.veAVATBalance), veAVAT.decimals, 4);
  userData.AVATLockedDisplay = getFullDisplayBalance(new BigNumber(userData.AVATLocked), AVAT.decimals, 4);
  userData.withdrawalDateDisplay =
    end <= 0 ? '0000-00-00 00:00:00' : timestampToDate(new BigNumber(userData.withdrawalDate).times(1000).toNumber());

  // userData.isApproved = Number(allowance) > 0;
  const _userDataKey = `${account}-${chainId}`;

  const _userData = await fetchUserApproveData(account, userData);
  userData = _userData[_userDataKey];
  return [
    {
      [_userDataKey]: userData,
    },
    lockedState,
  ];
};

export const fetchUserApproveData = async (
  account: string,
  userData: IGovernanceUserData,
): Promise<Record<string, IGovernanceUserData>> => {
  const veAVATAddress = veAVAT.address;
  const AVATAddress = AVAT.address;
  const calls02 = [
    {
      address: AVATAddress,
      name: 'allowance',
      params: [account, veAVATAddress],
    },
    {
      address: AVATAddress,
      name: 'transferWhitelist',
      params: [account],
    },
    {
      address: AVATAddress,
      name: 'isWhiteListEnable',
    },
  ];
  const [_allowance, [transferWhitelist], [isWhiteListEnable]] = await multicall(AVATAbi, calls02);
  console.log({ transferWhitelist, isWhiteListEnable });
  const allowance = new BigNumber(_allowance).toJSON();
  const _userDataKey = `${account}-${chainId}`;
  return {
    [_userDataKey]: {
      ...userData,
      isApproved: Number(allowance) > 0,
    },
  };
};

export const useVeAVATAddressContract = (withSignerIfPossible?: boolean): Contract | null => {
  const veAVATAddress = veAVAT.address;
  return useContract(veAVATAddress, veAVATAbi, withSignerIfPossible);
};
