import React, { useEffect, FC, useState, SetStateAction, Dispatch } from 'react';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { decodeAddress } from '@polkadot/util-crypto';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { u8aToHex } from '@polkadot/util';
import { setup, getSignStatus, postSignStatus } from './utils/task';
import OkSvg from './img/icon_ok.svg';
import { polkadotSignMessage } from './utils/accountUtils';
import WarnInfo from './warnInfo';
import useToast from 'hooks/useToast';
type Signed = 0 | 1 | 2;
interface mInjectedAccountWithMeta extends InjectedAccountWithMeta {
  signed?: Signed;
  publickey?: string;
  evmAddress?: string;
  shidenAddress?: string;
}
const getAddressStatus = (
  waiting: boolean,
  setWaiting: (b: boolean) => void,
  account: string,
  setInjectedAccounts: Dispatch<SetStateAction<mInjectedAccountWithMeta[]>>,
  arr: mInjectedAccountWithMeta[],
) => {
  if (waiting) {
    return;
  }
  getSignStatus(
    setWaiting,
    arr.map((v) => v.publickey),
  ).then((res) => {
    if (res) {
      const { data: v } = res || {};
      if (v && v.length) {
        const _it = {};
        for (let i = 0; i < v.length; i++) {
          _it[`${Object.keys(v[i])}`] = `${Object.values(v[i])}`;
        }
        const _a = [];
        // 0 未签名   1 已签名  2 签名不是当前EVM用户
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i];
          if (_it[item.publickey]) {
            if (_it[item.publickey] === account) {
              _a.push({ ...item, signed: 1, evmAddress: _it[item.publickey] });
            } else {
              _a.push({ ...item, signed: 2, evmAddress: _it[item.publickey] });
            }
          } else {
            _a.push({ ...item, signed: 0 });
          }
        }
        if (_a.length) {
          setInjectedAccounts(_a);
        }
      } else {
        setInjectedAccounts(arr);
      }
    } else {
      setInjectedAccounts(arr);
    }
  });
};
const PolkadoAccountInfo_TSX: FC<{ className?: string }> = ({ className }) => {
  const [injectedAccounts, setInjectedAccounts] = useState<mInjectedAccountWithMeta[]>([]);
  const [waiting, setWaiting] = useState(false);
  const [message, setMessage] = useState('');
  const { account } = useWeb3React();
  const { toastSuccess } = useToast();
  // 链接钱包
  useEffect(() => {
    setup(setWaiting, null).then((r) => {
      if (r.kind === 'ok') {
        // 获取publicKey
        const _arr = r.injectedAccounts.map((v) => {
          const publickey = u8aToHex(decodeAddress(v.address, true));
          return {
            ...v,
            publickey,
          };
        });
        getAddressStatus(waiting, setWaiting, account, setInjectedAccounts, _arr);
      } else {
        setMessage(r.message || '');
      }
    });
    // eslint-disable-next-line
  }, []);
  const signAddress = async (v: mInjectedAccountWithMeta) => {
    const ret = await polkadotSignMessage(account, v.address);
    const sigInfos = {
      polkadotKey: v.publickey,
      evmAddress: account,
      signature: ret,
    };
    // const isValidSignature = (signedMessage: string, signature: string, polkadotPubKey: string) => {
    //   try {
    //     const publicKey = decodeAddress(polkadotPubKey);
    //     const hexPublicKey = u8aToHex(publicKey);
    //     return signatureVerify(signedMessage, signature, hexPublicKey).isValid;
    //   } catch (error) {
    //     console.error({ error });
    //     return false;
    //   }
    // };
    // const _isValidSignature = isValidSignature(account, ret, v.publickey);
    postSignStatus(setWaiting, [sigInfos]).then((res) => {
      if (res) {
        toastSuccess('Bind successful!');
        getAddressStatus(waiting, setWaiting, account, setInjectedAccounts, injectedAccounts);
      }
    });
  };

  return (
    <div className={className}>
      {waiting ? (
        <h4>
          <i>waiting</i>
        </h4>
      ) : null}
      {injectedAccounts && injectedAccounts.length ? (
        <ul>
          {injectedAccounts.map((v: mInjectedAccountWithMeta, index: number) => (
            <li key={index}>
              <h3>
                {v.address.slice(0, 7)}...{v.address.slice(v.address.length - 4, v.address.length)}
              </h3>
              {v.signed === 1 ? (
                <img src={OkSvg} alt="" />
              ) : v.signed === 2 ? (
                <WarnInfo text={`binded to another address: ${v?.evmAddress ?? ''}`} />
              ) : (
                <p onClick={() => signAddress(v)}>sign</p>
              )}
            </li>
          ))}
        </ul>
      ) : null}
      {message ? <h4>{message}</h4> : null}
    </div>
  );
};

const PolkadoAccountInfo = styled(PolkadoAccountInfo_TSX)`
  padding: 0 20px 0 20px;
  max-height: 300px;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  h4 {
    padding: 10px 20px;
    color: #ad3d3d;
    font-weight: 500;
    font-size: 12px;
    background-color: ${({ theme }) => theme.colors.background02};
    border-radius: 16px;
    margin-bottom: 12px;
    i {
      color: #f1842c;
      font-style: normal;
    }
  }
  ul {
    list-style: none;
    li {
      background-color: ${({ theme }) => theme.colors.background02};
      border-radius: 16px;
      padding: 10px 20px;
      height: 56px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      h3 {
        color: #fff;
        font-weight: 500;
        font-size: 16px;
      }
      p {
        cursor: pointer;
        border: 1px solid ${({ theme }) => theme.colors.primaryDark};
        border-radius: 12px;
        color: ${({ theme }) => theme.colors.primaryDark};
        font-weight: 500;
        font-size: 14px;
        line-height: 34px;
        padding: 0 20px;
      }
      .warn {
        cursor: pointer;
      }
      img {
        width: 20px;
        // margin-right: 24px;
      }
    }
  }
`;
export default PolkadoAccountInfo;
