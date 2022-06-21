import { Modal } from '@my/ui';

import styled from 'styled-components';

const ComingSoon = ({ onDismiss = () => null }) => {
  return (
    <Modal title="" onDismiss={onDismiss}>
      <ComingSoonStyled>
        {/* <CloseIcon color="#9DA6A6" height="30px" width="30px" onClick={onDismiss} /> */}
        <img src="/images/ComingSoon.svg" alt="" />
        <h2>This feature is coming soon</h2>
      </ComingSoonStyled>
    </Modal>
  );
};
const ComingSoonStyled = styled.div`
  z-index: 98;
  // background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: 0px 10px 20px;
  border-radius: 20px;
  text-align: center;
  h2 {
    padding-top: 45px;
    color: ${({ theme }) => theme.colors.text};
    white-space: nowrap;
    font-weight: 600;
  }
  img {
    width: 100px;
    height: 100px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0 40px 50px;
    img {
      width: 148px;
      height: 148px;
    }
  }
`;
export default ComingSoon;
