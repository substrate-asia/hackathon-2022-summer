import React from 'react';
import styled from 'styled-components';

const ContentContainer = styled.div`
  min-height: 24px;
  display: flex;
  align-items: left;
`;

interface CellLayoutProps {
  label?: string;
}

const CellLayout: React.FC<CellLayoutProps> = ({ label = '', children }) => {
  return <ContentContainer>{children}</ContentContainer>;
};

export default CellLayout;
