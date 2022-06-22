import styled from 'styled-components';
import { Input, InputProps, Flex } from '@my/ui';

export const InnerWrapper = styled.div`
  width: 90%;
  max-width: 500px;
  margin: 60px auto 0;
  background-image: linear-gradient(270deg, #fc00ff 0%, #7d49ff 100%);
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  box-shadow: 2px 4px 7px 1px rgba(9, 2, 18, 0.3);
  border-radius: 10px;
`;
export const Header = styled.div``;
export const HeaderLi = styled.div``;
export const TableContent = styled.div``;
export const DappstakeContext = styled.div``;
const getBoxShadow = ({ isWarning = false, theme }) => {
  if (isWarning) {
    return theme.shadows.warning;
  }

  return theme.shadows.inset;
};
export const StyledTokenInputTop = styled(Flex)<InputProps>`
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  box-shadow: ${getBoxShadow};
  color: ${({ theme }) => theme.colors.text};
  padding: 20px 20px 20px 20px;
  width: 100%;
  box-shadow: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBackground};
  &:last-child {
    border-bottom: none;
  }
`;

export const StyledInput = styled(Input)`
  box-shadow: none;
  padding: 0;
  border-width: 0px;
  background-color: rgba(0, 0, 0, 0);
  width: 80%;
  text-align: right;
  font-size: 18px;
`;
// fontSize="12px" style={{ cursor: 'pointer' }} color="#1476FF" ml="8px"

export const InputWrap = styled.div`
  background: ${({ theme }) => theme.colors.background02};
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  position: relative;
  width: 100%;
`;
export const PageContainer = styled(Flex)`
  justify-content: center;
  aligncontent: center;
  padding-top: 20px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 80px;
  }
`;
