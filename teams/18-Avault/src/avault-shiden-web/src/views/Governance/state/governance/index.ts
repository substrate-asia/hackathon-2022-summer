import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { grassHouseListConfig } from 'views/Governance/constants/constants';
import { fetchGrassHouseListData, fetchGrassHouseListUserData, fetchGrassHouseUserData } from './fetchGrassHouse';
import { fetchUserData, fetchUserApproveData } from './fetchVeAVAT';
import { GovernanceState, IGovernanceUserData, IGrassHouse, ILockAVATModalState, ILockedState } from './types';

const initialState: GovernanceState = {
  lockAVATModalState: ILockAVATModalState.INIT,
  lockedState: ILockedState.init, //
  apy: '682.11',
  tvlTotal: '0',
  avarageLockTime: '48.11',
  totalAVATLocked: '88728.11',
  userData: {},
  grassHouseList: grassHouseListConfig,
  isUserLoaded: false,
};
export const fetchUserDataAsync = createAsyncThunk<
  { userData: Record<string, IGovernanceUserData>; lockedState: ILockedState },
  { account: string }
>('governance/fetchUserDataAsync', async ({ account }) => {
  const [userData, lockedState] = await fetchUserData(account);
  return { userData, lockedState };
});

export const fetchUserDataApproveAsync = createAsyncThunk<
  Record<string, IGovernanceUserData>,
  { account: string; userData: IGovernanceUserData }
>('governance/fetchUserDataApproveAsync', async ({ account, userData }) => {
  const _ = await fetchUserApproveData(account, userData);
  return _;
});
export const fetchGrassHouseListDataAsync = createAsyncThunk<
  IGrassHouse[],
  { grassHouseList: IGrassHouse[]; account: string }
>('governance/fetchGrassHouseListDataAsync', async ({ grassHouseList, account }) => {
  const grassHouseListData = await fetchGrassHouseListData(grassHouseList);
  if (account) {
    const data = await fetchGrassHouseListUserData(grassHouseListData, account);
    return data;
  }
  return grassHouseListData;
});

export const fetchGrassHouseDataAsync = createAsyncThunk<IGrassHouse, { grassHouse: IGrassHouse; account: string }>(
  'governance/fetchGrassHouseDataAsync',
  async ({ grassHouse, account }) => {
    const data = await fetchGrassHouseUserData(grassHouse, account);
    return data;
  },
);

export const governanceSlice = createSlice({
  name: 'governance',
  initialState,
  reducers: {
    changeLockAVATModalState: (state, action) => {
      state.lockAVATModalState = action.payload.lockAVATModalState as ILockAVATModalState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserDataAsync.fulfilled, (state, action) => {
      state.userData = action.payload.userData;
      state.lockedState = action.payload.lockedState;
    });
    builder.addCase(fetchGrassHouseListDataAsync.fulfilled, (state, action) => {
      state.grassHouseList = action.payload;
    });
    builder.addCase(fetchGrassHouseDataAsync.fulfilled, (state, action) => {
      state.grassHouseList = state.grassHouseList.map((v) => {
        if (v.address === action.payload.address) {
          return action.payload;
        } else {
          return v;
        }
      });
    });

    builder.addCase(fetchUserDataApproveAsync.fulfilled, (state, action) => {
      state.userData = action.payload;
    });
  },
});
export const { changeLockAVATModalState } = governanceSlice.actions;
export default governanceSlice.reducer;
