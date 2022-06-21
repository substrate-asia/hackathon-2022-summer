import React from 'react';
import styled from 'styled-components';
import { ArrowIcon } from 'style/SmallBorderPageLayout';
import { AutoRenewIcon } from '@my/ui';

interface DetailsProps {
  actionPanelToggled: boolean;
  isLoading: boolean;
}

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding-right: 8px;
  color: ${({ theme }) => theme.colors.primary};
  width: 48px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding-right: 0px;
  }
`;

const Details: React.FC<DetailsProps> = ({ actionPanelToggled, isLoading }) => {
  return (
    <Container>
      {isLoading ? (
        <AutoRenewIcon spin color="currentColor" />
      ) : (
        <ArrowIcon color="primary" toggled={actionPanelToggled} />
      )}
    </Container>
  );
};

export default Details;
