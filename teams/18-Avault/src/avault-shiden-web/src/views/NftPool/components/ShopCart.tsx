import React, { FC, useCallback, useContext, useState } from 'react';
import styled from 'styled-components';
import { Button, Text, Grid, Flex, useMatchBreakpoints } from '@my/ui';
import { NftContext } from '../providers/nft.provider';
import RemoveSVG from '../img/remove.svg';
import { NFT } from './GoodsInPool';
import { useContract } from 'hooks/useContract';
import Nft100Abi from 'config/abi/NFT100Pair721.json';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { formatFloat } from '../util/format';
import useToast from 'hooks/useToast';
import { useTranslation } from 'contexts/Localization';
import CloseSvg from '../img/close.svg';

const Item: FC<{ className?: string; item: NFT; floorPrice: number; symbol: string }> = ({
  className,
  item,
  floorPrice,
  symbol,
}) => {
  const { remove } = useContext(NftContext);
  const [isHover, setIsHover] = useState(false);

  return (
    <div className="item">
      <div className="show" onMouseOver={() => setIsHover(true)} onMouseOut={() => setIsHover(false)}>
        {(item?.image ?? '').indexOf('.mp4') > -1 ? (
          <video width="100%" height="100%" autoPlay={true} loop={true} playsInline={true}>
            <source src={`${item.image}`} type="video/mp4" />
          </video>
        ) : (
          <img src={item?.image} alt="" />
        )}
        <div className="mask" style={{ opacity: isHover ? '1' : '0' }} onClick={() => remove(item)}>
          <img src={RemoveSVG} alt="" />
        </div>
      </div>
      <Text color="text" bold fontSize="12px" mt="14px" mb="12px">
        {item?.name}#{item?.id}
      </Text>
      <Text color="primary" bold fontSize="12px">
        {floorPrice}&nbsp;{symbol}
      </Text>
    </div>
  );
};

const ShopCart: FC<{ className?: string; floorPrice: number; symbol: string; pairAddres: string }> = ({
  className,
  floorPrice,
  symbol,
  pairAddres,
}) => {
  const { items, clear } = useContext(NftContext);
  const contract = useContract(pairAddres, Nft100Abi);
  const { account } = useActiveWeb3React();
  const { isXs, isSm, isMd } = useMatchBreakpoints();
  const { toastSuccess, toastError } = useToast();
  const { t } = useTranslation();

  const onBuy = useCallback(() => {
    if (!account || !contract) {
      return;
    }

    const burn = contract.withdraw(
      items.map((item) => item.id),
      items.map(() => 1),
      account,
    );

    burn.then(
      async (tx) => {
        await tx.wait();
        clear();

        toastSuccess(t('Bought!'), t('You have it now.'));
      },
      (e) => {
        toastError(
          t('Error'),
          t(e.data?.message || 'Please try again. Confirm the transaction and make sure you are paying enough gas!'),
        );
      },
    );
  }, [contract, account, items, t, toastSuccess, toastError, clear]);

  return (
    <div className={className}>
      <Flex className="content">
        <img
          onClick={() => {
            clear();
          }}
          src={CloseSvg}
          alt=""
        />
        <Grid gridGap={{ xs: '16px', md: '31px' }} className="items">
          {items.map((item) => (
            <Item item={item} key={item.id} floorPrice={floorPrice} symbol={symbol} />
          ))}
        </Grid>
        <Flex className="right">
          <Text className="price" color="primary" bold>
            {formatFloat(items.length * floorPrice)}&nbsp;{symbol}
          </Text>
          {isXs || isSm || isMd ? (
            <Flex alignItems="flex-end">
              <Text className="tip" color="text" bold fontSize="12px" textAlign="right">
                Total Cost
              </Text>
              <Button onClick={onBuy}>Buy</Button>
            </Flex>
          ) : (
            <>
              <Text className="tip-desktop" color="text" bold fontSize="12px" textAlign="right">
                Total Cost
              </Text>
              <Button maxWidth="136px" width="100%" onClick={onBuy}>
                Buy
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </div>
  );
};

export default styled(ShopCart)`
  position: sticky;
  width: 100%;
  bottom: 20px;
  z-index: 10;
  > .content {
    position: relative;
    flex-wrap: wrap;
    margin: 0px auto;
    max-width: 1086px;
    justify-content: space-between;
    padding: 40px 20px 20px 20px;
    background: ${({ theme }) => theme.colors.cardBackground};
    box-shadow: 0px 5px 16px 4px rgba(0, 0, 0, 0.2);
    opacity: 0.98;
    border-radius: 24px;

    > img {
      cursor: pointer;
      position: absolute;
      right: 30px;
      top: 30px;
    }
    > .items {
      padding-right: 5px;
      max-height: 328px;
      overflow-y: auto;
      overflow-x: hidden;
      grid-template-columns: 136px 136px;

      ${({ theme }) => theme.mediaQueries.md} {
        grid-template-columns: 136px 136px 136px 136px;
      }
      /* display: flex;
      flex-wrap: wrap; */
      > .item {
        text-align: center;
        > .show {
          width: 136px;
          height: 136px;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;

          > img {
            width: 136px;
            height: 136px;
            border-radius: 8px;
          }
          > .mask {
            border-radius: 8px;
            transition: opacity 0.2s linear;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            z-index: 11;
            top: 0px;
            bottom: 0px;
            right: 0px;
            left: 0px;
            background-color: rgba(0, 0, 0, 0.8);
          }
        }
      }
    }

    > .right {
      padding-top: 30px;
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;

      ${({ theme }) => theme.mediaQueries.md} {
        flex-direction: column;
        max-width: 404px;
        padding-right: 21px;
        justify-content: flex-end;
        > .price {
          font-size: 28px;
        }
        > .tip-desktop {
          margin-bottom: 17px;
          margin-top: 13px;
        }
      }

      > .price {
        font-size: 22px;
        align-items: flex-end;
      }

      > div > .tip {
        margin-bottom: 5px;
        margin-right: 15px;
      }
    }
  }
`;
