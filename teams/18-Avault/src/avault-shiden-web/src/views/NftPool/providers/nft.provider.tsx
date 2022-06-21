import React, { Context, useCallback, useState } from 'react';
import { NFT } from '../components/GoodsInPool';

interface NftContextProps {
  items: NFT[];
  add: (id: NFT) => void;
  remove: (id: NFT) => void;
  clear: () => void;
}

export const NftContext: Context<NftContextProps> = React.createContext({} as unknown as NftContextProps);

export const NftProvider = React.memo(({ children }: { children: React.ReactNode }): React.ReactElement => {
  const [items, setItems] = useState<NFT[]>([]);

  const add = useCallback((nft: NFT) => {
    setItems((items) => {
      if (items.find((item) => item.id === nft.id)) {
        return items;
      }

      return [...items, nft];
    });
  }, []);

  const remove = useCallback((nft: NFT) => {
    setItems((items) => {
      const index = items.findIndex((item) => item.id === nft.id);

      if (index === -1) {
        return items;
      }

      return [...items.slice(0, index), ...items.slice(index + 1)];
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <NftContext.Provider
      value={{
        items,
        add,
        remove,
        clear,
      }}
    >
      {children}
    </NftContext.Provider>
  );
});
