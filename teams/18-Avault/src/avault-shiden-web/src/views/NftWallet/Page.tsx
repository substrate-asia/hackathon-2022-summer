import React from 'react';
import styled from 'styled-components';
import NftWalletSubNav from 'components/Menu/NftWalletSubNav';
import PageLayout from 'components/Layout/Page';

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-bottom: 0;
  min-height: calc(100vh - 64px);

  ${({ theme }) => theme.mediaQueries.xs} {
    background-size: auto;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-bottom: 0;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 10px;
    min-height: calc(100vh - 64px);
  }
`;

const Page: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <PageLayout style={{ minHeight: '0px' }}>
      <NftWalletSubNav />
      <StyledPage {...props}>{children}</StyledPage>
    </PageLayout>
  );
};

export default Page;
