import { Button } from '@my/ui';
import DefaultImg from 'components/DefaultImg';
import { Dispatch, useCallback } from 'react';
import { useMemo } from 'react';
import styled from 'styled-components';
import { getImageUrlFromToken } from 'utils';
import { fetchGrassHouseDataAsync } from '../state/governance';
import { useGrassHouseContractFun } from '../state/governance/hooks';
import { IGrassHouse } from '../state/governance/types';
interface IProps {
  grassHouseList: IGrassHouse[];
  account: string;
  toastSuccess: any;
  toastError: any;
  dispatch: Dispatch<any>;
}
const Rewards = ({ grassHouseList, account, toastSuccess, toastError, dispatch }: IProps) => {
  return (
    <RewardsStyled>
      <h2 className="rewards_title">Rewards</h2>
      <ul>
        {grassHouseList.map((v: IGrassHouse, index: number) => (
          <Row
            key={index}
            v={v}
            account={account}
            toastSuccess={toastSuccess}
            toastError={toastError}
            dispatch={dispatch}
          />
        ))}
        {/* {[1, 2, 3, 4].map((v) => (
          <Row key={v} v={v} />
        ))} */}
      </ul>
    </RewardsStyled>
  );
};

const Row = ({
  v,
  account,
  toastSuccess,
  toastError,
  dispatch,
}: {
  v: IGrassHouse;
  account: string;
  toastSuccess: any;
  toastError: any;
  dispatch: Dispatch<any>;
}) => {
  const { apr = '0', rewards = '0', token } = v;
  const { symbol, address, name } = token || {};
  const rewardsNumber = Number(rewards);
  const { claim } = useGrassHouseContractFun(v?.token?.address ?? '');
  const handleClaim = useCallback(async () => {
    if (!account) {
      return;
    }
    const res = await claim();
    if (typeof res === 'boolean') {
      toastSuccess('Congratulations!', 'Withdraw Compounded!');
      dispatch(fetchGrassHouseDataAsync({ grassHouse: v, account }));
      return true;
    } else {
      toastError('Ops! Error', res);
      return false;
    }
  }, [account, claim, dispatch, toastError, toastSuccess, v]);
  return useMemo(() => {
    return (
      <li>
        <div className="row_title">
          <TokenWrapper>
            {/* {isSingle ? (
          token0Address ? (
            <img src={getImageUrlFromToken(token0Address)} className="img" alt="" />
          ) : (
            <DefaultImg />
          )
        ) : token0Address ? (
          <TokenPairImage
            variant="inverted"
            primaryToken={token0Address}
            secondaryToken={token1Address}
            width={60}
            height={60}
          />
        ) : ( */}
            {address ? <img src={getImageUrlFromToken(address)} className="img" alt="" /> : <DefaultImg />}
            {/* )} */}
          </TokenWrapper>
          <h2>
            {symbol}
            <i>{name}</i>
          </h2>
        </div>
        <h3 className="apr">
          {apr}%<i>APR</i>
        </h3>
        <div className="small">
          <h3>
            <i>Rewards</i>
            {rewards}
          </h3>
          <Button disabled={rewardsNumber <= 0} onClick={handleClaim}>
            Claim
          </Button>
        </div>
        <h3 className="big">
          {rewards}
          <i>Rewards</i>
        </h3>
        <Button className="big" disabled={rewardsNumber <= 0} onClick={handleClaim}>
          Claim
        </Button>
      </li>
    );
  }, [address, apr, name, rewards, rewardsNumber, symbol, handleClaim]);
};
const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 75px;
  .img {
    display: block;
    width: 62%;
    height: 40px;
    margin: 0 auto;
    background-color: #eee;
    border-radius: 50%;
    ${({ theme }) => theme.mediaQueries.sm} {
      width: 40px;
      height: 40px;
    }
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    padding-right: 20px;
    width: 80px;
  }
`;
const RewardsStyled = styled.div`
  .rewards_title {
    display: none;
    ${({ theme }) => theme.mediaQueries.md} {
      display: block;
      font-size: 30px;
      padding: 40px 40px 30px;
    }
  }
  ul {
    ${({ theme }) => theme.mediaQueries.md} {
      padding: 0 30px 40px;
    }
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid #2e2d5b;
      border-radius: 12px;
      padding: 20px 16px;
      margin-bottom: 20px;
      flex-wrap: wrap;
      background-color: #181733;
      ${({ theme }) => theme.mediaQueries.md} {
        padding: 0 30px;
        min-height: 96px;
        border-radius: 20px;
        transition: background-color 0.5s ease;
        background-repeat: no-repeat;
      }
      &:hover {
        background-color: #25234c;
      }
      &:last-child {
        margin-bottom: 0;
      }

      .row_title {
        display: flex;
        align-items: center;
        justify-content: start;
      }
      h2 {
        font-size: 18px;
        i {
          display: none;
          ${({ theme }) => theme.mediaQueries.md} {
            font-size: 12px;
            display: inline;
            padding-left: 6px;
            color: ${({ theme }) => theme.colors.textSubtle};
          }
        }
      }
      h3 {
        font-size: 20px;
        &.apr {
          color: #31dab1;
          text-align: right;
          i {
            display: block;
            font-weight: 500;
            font-size: 12px;
          }
          ${({ theme }) => theme.mediaQueries.md} {
            color: #fff;
            text-align: left;
            i {
              display: inline-block;
            }
          }
        }
        ${({ theme }) => theme.mediaQueries.md} {
          font-size: 30px;
        }
        i {
          font-size: 12px;
          color: #6a6991;
          padding-left: 6px;
          display: inline;
          vertical-align: middle;
        }
      }
      .small {
        display: block;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid #2e2d5b;
        border-radius: 12px;
        width: 100%;
        padding: 20px 16px;
        margin-top: 10px;
        h3 {
          color: #cc64f2;
          i {
            display: block;
            padding-left: 0;
            padding-top: 0;
            padding-bottom: 10px;
            margin-top: 0;
          }
        }
        ${({ theme }) => theme.mediaQueries.md} {
          display: none;
        }
      }
      .big {
        display: none;
        ${({ theme }) => theme.mediaQueries.md} {
          display: block;
        }
      }
      button {
        padding: 0 26px;
        height: 40px;
        ${({ theme }) => theme.mediaQueries.md} {
          padding: 0 38px;
        }
      }
    }
  }
`;
export default Rewards;
