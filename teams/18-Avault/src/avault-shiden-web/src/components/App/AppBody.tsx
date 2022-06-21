import React from 'react';
import styled from 'styled-components';
import { Card } from '@my/ui';

export const BodyWrapper = styled(Card)`
  max-width: 486px;
  width: 100%;
  z-index: 1;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  box-shadow: 0 10px 20px 5px rgba(0, 0, 0, 0.03);
  > div {
    background: rgba(0, 0, 0, 0);
    border-radius: 0px;
  }
`;

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>;
}
