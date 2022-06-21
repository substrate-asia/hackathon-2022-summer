import styled from 'styled-components';
import { Flex, Button, ChevronDownIcon } from '@my/ui';
export const PageContainerWrap = styled(Flex)`
  justify-content: center;
  aligncontent: center;
  flex-wrap: wrap;
  padding-top: 60px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 80px;
  }
`;
export const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  width: 18px;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 26px;
  }
`;
export const W480BorderPageLayout = styled.div`
  position: relative;
  min-height: 0px;
  width: 600px;
  // background-image: linear-gradient(270deg, #fc00ff 0%, #7d49ff 100%);
  // box-shadow: 2px 4px 7px 1px rgba(9, 2, 18, 0.3);
  border-radius: 23px;
  padding: 0;
  border: 1px solid #2e2d5b;
  overflow: hidden;
  // margin: 100px auto;
  background: ${({ theme }) => theme.colors.cardBackground};
  &.single {
    @media screen and (max-width: 852px) {
      max-width: 600px;
      position: absolute;
      width: 90%;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }
`;

export const TableContent = styled.div`
  border-radius: 20px;
  padding: 30px 16px 30px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 30px 30px 30px;
  }
`;
export const MaxButton = styled(Button)`
  text-align: right;
  padding: 0 0 0 12px;
  margin: 0;
  align-items: center;
  justify-content: right;
  line-height: 40px;
  height: 40px;
`;
