import React from 'react';
import styled from 'styled-components';
import { useMatchBreakpoints } from '@my/ui';
import { useTranslation } from 'contexts/Localization';
import { ArrowIcon } from 'style/SmallBorderPageLayout';

interface DetailsProps {
  actionPanelToggled: boolean;
}

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding-right: 8px;
  color: ${({ theme }) => theme.colors.primary};

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-right: 0px;
  }
`;

const Details: React.FC<DetailsProps> = ({ actionPanelToggled }) => {
  const { t } = useTranslation();
  const { isXl } = useMatchBreakpoints();
  const isMobile = !isXl;

  return (
    <Container>
      {!isMobile && t('Details')}
      <ArrowIcon color="primary" toggled={actionPanelToggled} />
    </Container>
  );
};

export default Details;
