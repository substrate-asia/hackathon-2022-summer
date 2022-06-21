import Flex from 'components/Layout/Flex';
import PageLoading from 'components/TransactionConfirmationModal/PageLoading';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled(Flex)`
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  > div {
    height: 120px;
  }
`;

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <PageLoading />
    </Wrapper>
  );
};

export default PageLoader;
