import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IFetchIdoCallback, IIdoState, IIdoStateEnum } from './types';
import { fetchIdo } from './fetchIdo';
import { Web3Provider } from '@ethersproject/providers';
const initialState: IIdoState = {
  idoState: IIdoStateEnum.INIT,
  startTime: 0, //2023-05-18 23:59:59
  endTime: 0, //2023-05-18 23:59:59
  mainTokenPrice: '0',
  idoInAstrBalance: '0',
  avatEstimatedPrice: '0.00',
  apr: '0.00',
  countedAstrAmount: '0.00',
  rewards: '0.00',
  lpTotalBalance: '0.00',
  lpBalance: {},
  maxASTRBalance: {},
  isUserLoaded: false,
};

export const fetchIdoAsync = createAsyncThunk<
  IFetchIdoCallback,
  {
    account: string;
    library: Web3Provider;
    accountkey: string;
  }
>('ido/fetchIdoAsync', async ({ account, library, accountkey }) => {
  const data = await fetchIdo(account, library, accountkey);
  return data;
});
// 31536000
// const nowTimestamp = Number((new Date().valueOf() / 1000).toFixed(0));
// const nextTimes = Number(endTime) - nowTimestamp;
// console.log({ nextTimes });
export const idoSlice = createSlice({
  name: 'ido',
  initialState,
  reducers: {
    // updateStartTime: (state) => {
    //   const startDate = idoStartTime;
    //   const startTime = Number((new Date(startDate).valueOf() / 1000).toFixed(0));
    //   const nowTimestamp = getTimeStamp();
    //   const nextTimes = startTime - nowTimestamp;
    //   console.log(9999);
    //   state.startTime = nextTimes;
    // },
    // updateEndTime: (state) => {
    //   const endDate = idoEndDate;
    //   const endTime = Number((new Date(endDate).valueOf() / 1000).toFixed(0));
    //   const nowTimestamp = getTimeStamp();
    //   const nextTimes = endTime - nowTimestamp;
    //   state.endTime = nextTimes;
    // },
    updateBalance: (state, action) => {
      state.idoInAstrBalance = action.payload.idoInAstrBalance;
    },
    updateState: (state, action) => {
      for (const key in action.payload) {
        state[key] = action.payload[key];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIdoAsync.fulfilled, (state, action) => {
      for (const key in action.payload) {
        state[key] = action.payload[key];
      }
    });
  },
});
export const { updateBalance, updateState } = idoSlice.actions;
export default idoSlice.reducer;
