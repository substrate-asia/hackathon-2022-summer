export type Meta = {
  genesisHash: string
  name: string
  source: string
}

export type Wallet = {
  address: string,
  meta: Meta,
  type: string
}