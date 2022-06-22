import { ChainId } from '@my/sdk';
import { createStore, Store } from 'redux';
import { updateBlockNumber } from './actions';
import reducer, { ApplicationState } from './reducer';

describe('application reducer', () => {
  let store: Store<ApplicationState>;

  beforeEach(() => {
    store = createStore(reducer, {
      blockNumber: {
        [ChainId.BSC_MAINNET]: 3,
      },
    });
  });

  describe('updateBlockNumber', () => {
    it('updates block number', () => {
      store.dispatch(updateBlockNumber({ chainId: ChainId.BSC_MAINNET, blockNumber: 4 }));
      expect(store.getState().blockNumber[ChainId.BSC_MAINNET]).toEqual(4);
    });
    it('no op if late', () => {
      store.dispatch(updateBlockNumber({ chainId: ChainId.BSC_MAINNET, blockNumber: 2 }));
      expect(store.getState().blockNumber[ChainId.BSC_MAINNET]).toEqual(3);
    });
    it('works with non-set chains', () => {
      store.dispatch(updateBlockNumber({ chainId: ChainId.BSC_TESTNET, blockNumber: 2 }));
      expect(store.getState().blockNumber).toEqual({
        [ChainId.BSC_MAINNET]: 3,
        [ChainId.BSC_TESTNET]: 2,
      });
    });
  });
});
