import React, { FC, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Text, Flex, Button, Modal, InjectedModalProps, Grid } from '@my/ui';
import { useTranslation } from 'contexts/Localization';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { NftPair } from 'views/NftPools/hooks/useNftPools';
import { fetchNfts } from 'views/NftPool/util/fetchNft';
import { NFT, NFT_POOLS } from 'views/NftPool/components/GoodsInPool';
import { useContract } from 'hooks/useContract';
import Nft100Abi from 'config/abi/NFT100Pair721.json';
import PageLoader from 'components/Loader/PageLoader';
import { LockInfo, useNftWithLockInfo } from 'views/NftPool/hooks/useNftWithLocks';
import LockTime from 'views/NftPool/components/LockTime';
import LockSvg from '../img/lock.svg';
import { simpleRpcProvider } from 'utils/providers';
import useToast from 'hooks/useToast';

interface Props extends InjectedModalProps {
  pair: NftPair | undefined;
  balance: number;
}
const GridStyled = styled(Grid)`
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 381px;
  grid-template-columns: 1fr;
  justify-items: center;
  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const Card_: FC<{
  className?: string;
  onBurn: (id: number) => void;
  nft: NFT;
  lockInfo: LockInfo | undefined;
  account: string | undefined;
}> = ({ className, onBurn, nft = {} as NFT, lockInfo, account }) => {
  const { t } = useTranslation();
  const [now, setNow] = useState(0);

  useEffect(() => {
    simpleRpcProvider.getBlockNumber().then(setNow);
  }, []);
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
        {lockInfo && (
          <div className="locked">
            <img src={LockSvg} alt="" />
            <LockTime lastBlock={lockInfo.lastBlock} now={now} />
          </div>
        )}
      </div>
      <Text bold color="text" textAlign="center" mt="16px" mb="13px">
        {nft.name}#{nft.id}
      </Text>
      <Flex justifyContent="center">
        {lockInfo && account?.toLowerCase() !== lockInfo.unlocker.toLowerCase() ? (
          <Button height="32px" width="120px" variant="text">
            Locked
          </Button>
        ) : (
          <Button height="32px" variant="secondary" onClick={() => onBurn(nft.id)} width="136px">
            {t('Choose')}
          </Button>
        )}
      </Flex>
    </div>
  );
};

const Card = styled(Card_)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 196px;
  background: ${({ theme }) => theme.colors.secondary};
  border: 2px solid ${({ theme }) => theme.colors.background02};
  border-radius: 12px;
  padding: 10px;
  > .show {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: absolute;
      left: 0px;
      top: 0px;
      right: 0px;
      bottom: 0px;
      background: rgba(0, 0, 0, 0.8);

      > img {
        margin-bottom: 10px;
      }
      > div > div {
        background: none;
      }
    }
  }
`;

const BurnModal: React.FC<Props> = ({ onDismiss, pair }) => {
  let _pairs: NFT[] = [];

  try {
    _pairs = JSON.parse(localStorage.getItem(`${NFT_POOLS}-${pair?.pairAddress.toLowerCase()}`)) || [];
  } catch {
    localStorage.removeItem(NFT_POOLS);
  }
  const { toastSuccess, toastError } = useToast();
  const { account } = useActiveWeb3React();
  const [nfts, setNfts] = useState<NFT[]>(_pairs);
  const [fetching, setFetching] = useState(false);
  const contract = useContract(pair?.pairAddress, Nft100Abi);

  const locksInfo = useNftWithLockInfo(pair && { type: pair.type, address: pair.pairAddress });
  const { t } = useTranslation();

  useEffect(() => {
    if (!pair) {
      return;
    }

    // setFetching(true);
    fetchNfts(pair.nftAddress, pair.pairAddress)
      .then(
        (nfts) => {
          if (nfts.length) {
            setNfts(nfts);
            localStorage.setItem(`${NFT_POOLS}-${pair?.pairAddress.toLowerCase()}`, JSON.stringify(nfts));
          }
        },
        (e) => console.log('eee', e),
      )
      .finally(() => setFetching(false));
  }, [pair]);

  const onBurn = useCallback(
    (id: number) => {
      if (!account || !contract) {
        return;
      }

      const burn = contract.withdraw([id], [1], account);

      burn.then(
        async (tx) => {
          onDismiss();

          await tx.wait();

          toastSuccess(t('Burnt!'), t('Your fragments burnt, and you got NFT.'));
        },
        (e) => {
          toastError(
            t('Error'),
            t(e.data?.message || 'Please try again. Confirm the transaction and make sure you are paying enough gas!'),
          );
        },
      );
    },
    [contract, account, onDismiss, t, toastSuccess, toastError],
  );

  return (
    <Modal
      position="relative"
      bodyPadding="0px 30px 30px 30px"
      style={{
        maxWidth: '880px',
        width: '100%',
      }}
      title={null}
      onDismiss={onDismiss}
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        style={{ position: 'absolute', top: '0px', left: '43px', right: '43px', height: '70px' }}
      >
        <Text fontSize="20px" bold style={{ position: 'relative', left: '-3px' }}>
          {pair?.name}
        </Text>
      </Flex>
      {fetching ? (
        <PageLoader />
      ) : (
        <>
          {/* <Flex justifyContent="center" mb="20px">
            <Select
              options={[
                {
                  label: t('xxxx'),
                  value: 'xxxx',
                },
                {
                  label: t('zzzz'),
                  value: 'zzzz',
                },
                {
                  label: t('yyyy'),
                  value: 'yyyy',
                },
              ]}
            />
          </Flex> */}

          <GridStyled gridColumnGap={{ xs: '10px', md: '12px' }} gridRowGap={{ xs: '10px', md: '12px' }}>
            {nfts
              .filter((nft) => !locksInfo[nft.id] || locksInfo[nft.id].unlocker.toLowerCase() === account.toLowerCase())
              .map((nft) => (
                <Card key={nft.id} nft={nft} onBurn={onBurn} lockInfo={locksInfo[nft.id]} account={account} />
              ))}
          </GridStyled>
          <Text bold color="#F1842C" textAlign="center" mt="30px" mb="13px">
            Choose one NFT BURN {pair?.symbol}: 100
          </Text>
        </>
      )}
    </Modal>
  );
};

export default React.memo(BurnModal);
