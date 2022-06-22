import React, { FC, useContext, useMemo } from 'react';
import styled from 'styled-components';
import { Button, Text } from '@my/ui';
import { NftContext } from '../providers/nft.provider';
import LockSvg from '../img/lock.svg';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { NftInfoWithLock } from '../hooks/useNftWithLocks';
import LockTime from './LockTime';

const Nft: FC<{ className?: string; nft: NftInfoWithLock; now: number; pairPid: number }> = ({
  className,
  nft = {} as NftInfoWithLock,
  now,
  pairPid,
}) => {
  const { add, items } = useContext(NftContext);
  const { account } = useActiveWeb3React();
  const added = useMemo(() => !!items.find((item) => item.id === nft.id), [items, nft]);
  if (!nft || !nft.image) {
    return null;
  }
  return (
    <div className={className}>
      {nft.attributes.length && pairPid === 3 ? (
        <div className="attri">
          <h3>
            {nft.name}#{nft.id}
          </h3>
          <ul>
            {nft.attributes.map((v: any, index: number) => {
              return (
                <li key={index}>
                  <h4>
                    {v.trait_type || Object.keys(v)}: <i>{v.value || Object.values(v)}</i>
                  </h4>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      <div className="show">
        {(nft?.image ?? '').indexOf('.mp4') > -1 ? (
          <video width="100%" height="100%" autoPlay={true} loop={true} playsInline={true}>
            <source src={`${nft.image}`} type="video/mp4" />
          </video>
        ) : (
          <img src={nft?.image} alt="" />
        )}
        {nft.lastBlock > now && (
          <div className="locked">
            <LockTime lastBlock={nft.lastBlock} now={now} />
          </div>
        )}
      </div>
      <Text fontSize="16px" style={{ flex: '1' }} bold mb={{ xs: '12px', md: '24px' }} mt={{ xs: '12px', md: '24px' }}>
        {nft.name}#{nft.id}
      </Text>
      {nft.lastBlock > now && account?.toLowerCase() !== nft.unlocker.toLowerCase() ? (
        <img src={LockSvg} alt="" />
      ) : (
        <Button height="32px" width="120px" variant={added ? 'text' : 'secondary'} onClick={() => !added && add(nft)}>
          {added ? 'Added' : account?.toLowerCase() === nft.unlocker.toLowerCase() ? 'withdraw' : 'Buy +'}
        </Button>
      )}
    </div>
  );
};

export default styled(Nft)`
  position: relative;
  max-width: 300px;
  width: 100%;
  padding: 6px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 12px;
    width: 250px;
  }
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 2px solid #1e3337;
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  z-index: 1;

  &:hover {
    border-color: #1476ff;
    z-index: 9;
    .attri {
      visibility: visible;
      opacity: 1;
    }
  }
  .attri {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 90%;
    z-index: 9;
    text-align: left;
    width: 90%;
    background-color: ${({ theme }) => theme.colors.cardBackground};
    color: #9da6a6;
    border: 2px solid #1476ff;
    border-radius: 16px;
    line-height: 28px;
    padding: 10px 18px;
    max-height: 380px;
    overflow-y: scroll;
    font-weight: 500;
    user-select: none;
    transition: all 0.5s ease;
    &::-webkit-scrollbar {
      display: none;
    }
    ul {
      list-style: none;
    }
    h3 {
      word-break: break-all;
      color: ${({ theme }) => theme.colors.primary};
      font-size: 18px;
      font-weight: 800;
    }
    h4 {
      color: #fff;
      font-size: 14px;
      display: inline-block;
      word-break: break-all;
      color: #9da6a6;
      line-height: 20px;
      i {
        color: #fff;
        font-size: 12px;
        word-break: break-all;
        line-height: 20px;
        font-style: normal;
      }
    }
    p {
      color: #fff;
      font-size: 12px;
      word-break: break-all;
      line-height: 20px;
    }
  }

  @media screen and (max-width: 1040px) {
    &:nth-child(2n + 1) {
      .attri {
        left: 80%;
      }
    }
    &:nth-child(2n) {
      .attri {
        left: -80%;
      }
    }
  }

  @media screen and (max-width: 1263px) {
    &:nth-child(3n) {
      .attri {
        left: -80%;
      }
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

    > .locked {
      border-radius: 8px;
      display: flex;
      align-items: center;
      position: absolute;
      left: 0px;
      top: 0px;
      right: 0px;
      bottom: 0px;
      background: rgba(0, 0, 0, 0.8);
    }
  }
`;
