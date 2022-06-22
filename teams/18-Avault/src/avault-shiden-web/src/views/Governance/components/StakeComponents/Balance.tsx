import { useMemo } from 'react';
import CountUp from 'react-countup';
import styled from 'styled-components';
interface IProps {
  veAVATBalanceDisplay: string;
  AVATLockedDisplay: string;
  withdrawalDateDisplay: string;
}
const StakeBalance = ({ veAVATBalanceDisplay, AVATLockedDisplay, withdrawalDateDisplay }: IProps) => {
  return useMemo(() => {
    return (
      <StakeBalanceStyled>
        <div className="x_title">
          <h3>veAVAT balance</h3>
          <h5>:</h5>
          <CountUp className="h4" duration={1} useEasing={true} decimals={4} end={Number(veAVATBalanceDisplay)} />
        </div>
        <div className="list">
          <h4>
            AVAT Locked<i>{AVATLockedDisplay}</i>
          </h4>
          <h4>
            Unlock Date<i>{withdrawalDateDisplay}</i>
          </h4>
        </div>
      </StakeBalanceStyled>
    );
  }, [veAVATBalanceDisplay, AVATLockedDisplay, withdrawalDateDisplay]);
};
const StakeBalanceStyled = styled.div`
  position: relative;
  background: #25234c;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  ${({ theme }) => theme.mediaQueries.lg} {
    border-radius: 20px;
  }
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px solid #2e2d5b;
    border-radius: 12px;
    ${({ theme }) => theme.mediaQueries.lg} {
      border-radius: 20px;
    }
  }
  .x_title {
    position: relative;
    z-index: 2;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    justify-content: start;
    flex-wrap: wrap;
    line-height: 22px;
    h3,
    .h4,
    h5 {
      font-size: 16px;
      color: #cc64f2;
    }
    ${({ theme }) => theme.mediaQueries.sm} {
      h3,
      .h4,
      h5 {
        color: #fff;
      }
      justify-content: space-between;
    }
    ${({ theme }) => theme.mediaQueries.md} {
      line-height: 26px;
      padding: 12px 22px;
    }
    ${({ theme }) => theme.mediaQueries.lg} {
      line-height: 34px;
      padding: 19px 30px;
    }
    h3 {
      ${({ theme }) => theme.mediaQueries.md} {
        font-size: 14px;
      }
      ${({ theme }) => theme.mediaQueries.lg} {
        font-size: 18px;
      }
    }
    h5 {
      display: block;
      margin-right: 4px;
      ${({ theme }) => theme.mediaQueries.sm} {
        display: none;
      }
    }
    .h4 {
      font-size: 16px;
      color: #cc64f2;
      ${({ theme }) => theme.mediaQueries.md} {
        font-size: 23px;
      }
      ${({ theme }) => theme.mediaQueries.lg} {
        font-size: 30px;
      }
    }
  }
  .list {
    position: relative;
    z-index: 2;
    border-top: 1px solid #2e2d5b;
    border: 1px solid #2e2d5b;
    background: #181733;
    border-radius: 12px;
    padding: 20px 16px;
    ${({ theme }) => theme.mediaQueries.md} {
      padding: 22px 22px;
    }
    ${({ theme }) => theme.mediaQueries.lg} {
      border-radius: 20px;
      padding: 28px 30px 32px;
    }
    h4 {
      font-size: 12px;
      color: #6a6991;
      margin-bottom: 12px;
      ${({ theme }) => theme.mediaQueries.md} {
        font-size: 16px;
        margin-bottom: 15px;
      }
      ${({ theme }) => theme.mediaQueries.lg} {
        margin-bottom: 20px;
        font-size: 18px;
      }
      &:last-child {
        margin-bottom: 0px;
      }
      i {
        color: #fff;
        float: right;
      }
    }
  }
`;
export default StakeBalance;
