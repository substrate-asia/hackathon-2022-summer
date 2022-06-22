import { useMemo } from 'react';
import styled from 'styled-components';

interface IProps {
  veAVATBalanceDisplay: string;
  AVATLockedDisplay: string;
  withdrawalDateDisplay: string;
}

const LockInfo = ({ veAVATBalanceDisplay, AVATLockedDisplay, withdrawalDateDisplay }: IProps) => {
  return useMemo(() => {
    return (
      <LockInfoStyled>
        <h4>
          AVAT to be locked<i>{AVATLockedDisplay}</i>
        </h4>
        <h4>
          veAVAT balance<i>{veAVATBalanceDisplay}</i>
        </h4>
        <h4>
          APR<i className="green">0.00%</i>
        </h4>
        <h4>
          Unlock date<i>{withdrawalDateDisplay}</i>
        </h4>
      </LockInfoStyled>
    );
  }, [veAVATBalanceDisplay, AVATLockedDisplay, withdrawalDateDisplay]);
};
const LockInfoStyled = styled.div`
  background-color: #181733;
  border: 1px solid #2e2d5b;
  border-radius: 12px;
  padding: 20px;
  margin-top: 30px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-bottom: 10px;
  }
  h4 {
    font-size: 14px;
    color: #6a6991;
    margin-bottom: 15px;
    &:last-child {
      margin-bottom: 0;
    }
    i {
      color: #fff;
      float: right;
      &.green {
        color: ${({ theme }) => theme.colors.success};
      }
    }
  }
`;
export default LockInfo;
