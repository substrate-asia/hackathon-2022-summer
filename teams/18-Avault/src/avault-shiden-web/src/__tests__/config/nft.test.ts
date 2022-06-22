import pancakeNfts from 'config/constants/pancake_nfts';

describe('Config NFTs', () => {
  it.each(pancakeNfts.map((nft) => nft.identifier))('NFT #%d has a unique identifier', (identifier) => {
    const duplicates = pancakeNfts.filter((n) => identifier === n.identifier);
    expect(duplicates).toHaveLength(1);
  });
});
