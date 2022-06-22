import styled from 'styled-components';

export const ActionContainer = styled.div`
  padding: 13px 10px;
  // padding-left: 20px;
  border: 2px solid ${({ theme }) => theme.colors.input};
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 16px;
  background: #122124;
  border: 2px solid #1f373b;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 12px;
    margin-right: 12px;
    margin-bottom: 0;
    max-height: 120px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 0;
    max-height: 120px;
  }
`;

export const ActionTitles = styled.div`
  > div:first-child {
    font-size: 12px;
    line-height: 20px;
    margin-bottom: 6px;
    > span:first-child {
      color: #1476ff;
      margin-right: 6px;
    }
    > span:last-child {
      color: #9da6a6;
    }
  }
  > .balance {
    font-weight: 600;
    color: #1476ff;
    display: flex;
    align-items: center;
  }
`;
export const ActionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > button {
    height: 48px;
    border-radius: 12px;
  }
`;
