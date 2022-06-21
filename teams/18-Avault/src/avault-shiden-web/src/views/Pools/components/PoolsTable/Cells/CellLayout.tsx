import React from 'react';
import styled from 'styled-components';

const Label = styled.div`
  font-size: 12px;
  /* color: ${({ theme }) => theme.colors.textSubtle}; */
  color: #9da6a6;
  text-align: left;
  margin-bottom: 5px;
`;

const ContentContainer = styled.div`
  min-height: 24px;
  display: flex;
  align-items: center;
`;

interface CellLayoutProps {
  label?: string;
}

const CellLayout: React.FC<CellLayoutProps> = ({ label = '', children }) => {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <ContentContainer>{children}</ContentContainer>
    </div>
  );
};

export default CellLayout;
