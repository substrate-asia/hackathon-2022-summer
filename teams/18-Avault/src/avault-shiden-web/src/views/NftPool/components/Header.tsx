import React, { FC } from 'react';
import { Flex, Text } from '@my/ui';
import styled from 'styled-components';
import HeaderBgSvg from '../img/header-bg.svg';
import { formatFloat } from '../util/format';
import { NFT_PAIRS } from 'config/constants/nft';
import { NftPair } from 'views/NftPools/hooks/useNftPools';
import { usePollPrice } from 'state/price/hooks';
export interface Pool {
  poolName: string;
  fragmentName: string;
  nftCount: number;
  liquidity: number;
  floorPrice: number;
  changeDay7: number;
}

const PoolHeader_: FC<{ className?: string; pairIndex: number; floorPrice: number; pair: NftPair | undefined }> = ({
  className,
  pairIndex,
  floorPrice,
  pair,
}) => {
  usePollPrice(NFT_PAIRS[pairIndex].address, '100');
  return (
    <div className={className}>
      <div>
        <img className="pool-logo" src={NFT_PAIRS[pairIndex].logo} alt="" />
        <h1>{pair?.name}</h1>
        <Flex className="pool-info">
          <div className="info">
            <TextM fontSize="18px" bold mb="4px">
              {pair?.supply.toLocaleString() || 0}
            </TextM>
            <TextM fontSize="12px">NFT In Pool</TextM>
          </div>
          <div className="info">
            <TextM fontSize="18px" bold mb="4px">
              ${formatFloat(floorPrice * 100)}
            </TextM>
            <TextM fontSize="12px">NFT Price</TextM>
          </div>
          <div className="info second-line">
            <TextM fontSize="18px" bold mb="4px">
              ${pair?.liquidity ? pair.liquidity.toLocaleString() : '-'}
            </TextM>
            <TextM fontSize="12px">Liquidity</TextM>
          </div>
          <div className="info second-line">
            <TextM fontSize="18px" bold mb="4px">
              {((pair?.supply || 0) * 100).toLocaleString()}
            </TextM>
            <TextM fontSize="12px">KCoin Supply</TextM>
          </div>

          <div className="info second-line">
            <TextM fontSize="18px" bold mb="4px">
              {NFT_PAIRS[pairIndex].updateNFTID}
            </TextM>
            <TextM fontSize="12px">Update NFT ID</TextM>
          </div>
        </Flex>
      </div>
    </div>
  );
};
const TextM = styled(Text)`
  color: ${({ theme }) => theme.colors.text};
`;
export const PoolHeader = styled(PoolHeader_)`
  background-image: url(${HeaderBgSvg});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
  border-radius: 24px;
  ${({ theme }) => theme.mediaQueries.md} {
    top: 39px;
  }

  z-index: 1;

  > div {
    height: 100%;
    width: 100%;
    padding: 0px 20px 20px 20px;
    ${({ theme }) => theme.mediaQueries.md} {
      padding: 0px 40px 39px 40px;
    }

    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 24px;
    > .pool-logo {
      position: absolute;
      left: 20px;
      top: -15px;
      width: 50px;
      height: 50px;

      ${({ theme }) => theme.mediaQueries.md} {
        left: 44px;
        top: -24px;
        width: 96px;
        height: 96px;
      }
    }

    > h1 {
      height: 43px;
      color: ${({ theme }) => theme.colors.primary};
      padding: 19px 0px 0px 66px;
      font-size: 24px;
      font-weight: 500;

      ${({ theme }) => theme.mediaQueries.md} {
        font-size: 26px;
        padding: 29px 0px 0px 146px;
      }
    }

    > .pool-info {
      width: 100%;
      flex-wrap: wrap;
      margin-top: 30px;
      padding: 10px 30px;
      background: ${({ theme }) => theme.colors.secondary};
      border-radius: 12px;
      justify-content: space-between;
      > .info {
        width: 50%;
      }
      ${({ theme }) => theme.mediaQueries.md} {
        margin-bottom: 30px;
        > .info {
          width: auto;
        }
      }

      > .second-line {
        margin-top: 20px;
      }

      ${({ theme }) => theme.mediaQueries.md} {
        grid-template-columns: 1fr 1fr 1fr 1fr;
        align-items: center;
        margin-top: 40px;
        width: 67.5%;
        min-width: 600px;
        min-width: 550px;
        > .second-line {
          margin-top: 0px;
        }
      }
    }
  }
`;
