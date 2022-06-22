import styled from 'styled-components';
import CountUp from 'react-countup';

interface IProps {
  apy: string;
  totalAVATLocked: string;
  avarageLockTime: string;
}
const StakeingInfo = ({ apy, totalAVATLocked, avarageLockTime }: IProps) => {
  return (
    <StakeingInfoStyled>
      <div className="stakeingInfo_top">
        <h2>Governance</h2>
        <h3>Staking Info</h3>
        <div className="apy_btn">
          <CountUp className="h4" duration={1} useEasing={true} decimals={1} end={apy ? Number(apy) : 0} />%<i>APY</i>
        </div>
      </div>
      <div className="stakeingInfo_bottom">
        <ul>
          <li>
            <p>Average lock time</p>
            <h4>{avarageLockTime}Weeks</h4>
          </li>
          <li>
            <p>Total AVAT locked</p>
            <h4>{totalAVATLocked}</h4>
          </li>
        </ul>
      </div>
    </StakeingInfoStyled>
  );
};
const StakeingInfoStyled = styled.div`
  position: relative;
  .stakeingInfo_top {
    padding: 8% 5%;
    h2 {
      font-size: 36px;
      line-height: 50px;
      ${({ theme }) => theme.mediaQueries.md} {
        font-size: 50px;
        line-height: 62px;
      }
      ${({ theme }) => theme.mediaQueries.lg} {
        font-size: 68px;
        line-height: 72px;
      }
    }
    h3 {
      font-size: 30px;
      line-height: 42px;
      ${({ theme }) => theme.mediaQueries.md} {
        font-size: 34px;
        line-height: 52px;
      }
      ${({ theme }) => theme.mediaQueries.lg} {
        font-size: 48px;
        line-height: 62px;
      }
    }
    .apy_btn {
      margin-top: 40px;
      background-image: linear-gradient(90deg, #a428d0 0%, #20d4a9 100%);
      border-radius: 20px;
      color: #fff;
      display: inline-block;
      padding: 17px 30px 17px 16px;
      font-size: 36px;
      font-weight: 600;
      ${({ theme }) => theme.mediaQueries.md} {
        padding: 24px 30px;
        font-size: 48px;
      }
      ${({ theme }) => theme.mediaQueries.lg} {
        font-size: 68px;
      }
      i {
        font-size: 16px;
        padding-top: 10px;
        padding-left: 10px;
        ${({ theme }) => theme.mediaQueries.md} {
          font-size: 30px;
          padding-top: 24px;
          padding-left: 23px;
        }
      }
    }
  }
  .stakeingInfo_bottom {
    background-image: radial-gradient(circle at 50% -50%, #3e255b 0%, #181733 80%);
    border: 1px solid #2e2d5b;
    box-shadow: 0 10px 20px 5px rgba(0, 0, 0, 0.03);
    border-radius: 20px;
    padding: 8% 5%;
    position: absolute;
    width: calc(100% + 2px);
    bottom: -1px;
    left: -1px;
    ul {
      display: flex;
      justify-content: space-between;
      align-items: top;
      li {
        width: 45%;
      }
      p {
        font-size: 14px;
        color: #6a6991;
      }
      h4 {
        font-size: 20px;
        margin-top: 9px;
        ${({ theme }) => theme.mediaQueries.md} {
          font-size: 24px;
        }
        ${({ theme }) => theme.mediaQueries.lg} {
          font-size: 30px;
        }
      }
    }
  }
`;
export default StakeingInfo;
