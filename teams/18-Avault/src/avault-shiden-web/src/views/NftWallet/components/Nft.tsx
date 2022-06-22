import React, { FC } from 'react';
import styled from 'styled-components';
import { Button, Text, useModal } from '@my/ui';
import MintModal from './MintModal';
import { NFT } from 'views/NftPool/components/GoodsInPool';
import { NftPair } from 'views/NftPools/hooks/useNftPools';

const Nft: FC<{ className?: string; nft: NFT; pair: NftPair }> = ({ className, nft = {} as NFT, pair }) => {
  const [onMint] = useModal(<MintModal nft={nft} pair={pair} />);
  if (!nft || !nft.image) {
    return null;
  }

  return (
    <div className={className}>
      <div className="show">
        {(nft?.image ?? '').indexOf('.mp4') > -1 ? (
          <video width="100%" height="100%" autoPlay={true} loop={true} playsInline={true}>
            <source src={`${nft.image}`} type="video/mp4" />
          </video>
        ) : (
          <img src={nft.image} alt={`${nft.name}#${nft.id}`} />
        )}
      </div>
      <Text className="text" style={{ flex: '1' }} bold mb={{ xs: '16px', md: '24px' }} mt={{ xs: '16px', md: '24px' }}>
        {nft?.name}#{nft?.id}
      </Text>
      <Button height="40px" variant={'secondary'} onClick={onMint}>
        Sale
      </Button>
    </div>
  );
};

export default styled(Nft)`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 250px;
  }
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 2px solid #1e3337;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  > button {
    font-size: 14px;
    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 16px;
      width: 180px;
    }
  }
  > .text {
    font-size: 16px;

    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 18px;
    }
  }
  > .show {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    ${({ theme }) => theme.mediaQueries.sm} {
      height: 200px;
    }
    width: 100%;
    background: #1b383e;
    /* background: radial-gradient(circle, #2a6c6e, #43238c); */
    border-radius: 8px;
    img {
      border-radius: 8px;
      max-width: 100%;
      max-height: 100%;
    }
  }
`;
