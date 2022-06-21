export interface PlayerAccount {
  address: string;
  powCount: number;
}

export interface SessionAccount {
  address: string;
  mnemonic: string;
  powCount: number;
  isActive: boolean;
}
export type Account = {
  player: PlayerAccount;
  session: SessionAccount;
};
export type MongoDBID = {
  $oid: string;
};

export type MessageConfirmationHash = {
  binary: string;
  type: string;
};

export type MessageConfirmation = {
  chain: string;
  height: number;
  hash: string | MessageConfirmationHash;
};

export type BaseMessage = {
  _id?: MongoDBID;
  chain: string;
  sender: string;
  type: string;
  channel?: string;
  confirmations?: MessageConfirmation[];
  confirmed?: boolean;
  signature?: string;
  size?: number;
  time: number;
  item_type?: StorageEngine;
  item_content?: string;
  hash_type?: string;
  item_hash?: string;
  content?: BaseContent;
};
export enum StorageEngine {
  IPFS = 'IPFS',
  STORAGE = 'STORAGE',
  INLINE = 'INLINE',
}
export type BaseContent = {
  address: string;
  time: number;
};
