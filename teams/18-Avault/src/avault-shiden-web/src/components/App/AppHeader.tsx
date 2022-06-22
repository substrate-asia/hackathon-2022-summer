import React from 'react';
import styled from 'styled-components';
import { Flex, Heading, IconButton, Text, NotificationDot } from '@my/ui';
import { Link } from 'react-router-dom';
import { useExpertModeManager } from 'state/user/hooks';
import GlobalSettings from 'components/Menu/GlobalSettings';
import Transactions from './Transactions';
import { CSSProperties } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  helper?: string;
  backTo?: string;
  noConfig?: boolean;
  style?: CSSProperties;
}

const AppHeaderContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  width: 100%;
  /* border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder}; */
`;

const AppHeader: React.FC<Props> = ({ title, subtitle, helper, backTo, noConfig = false, style }) => {
  const [expertMode] = useExpertModeManager();

  if (backTo) {
    return (
      <AppHeaderContainer style={style}>
        {backTo && (
          <IconButton style={{ whiteSpace: 'nowrap' }} as={Link} to={backTo}>
            &lt; Back
          </IconButton>
        )}
        <Heading as="h2" mb="8px" marginBottom="0px">
          {title}
        </Heading>

        {!noConfig && (
          <Flex alignItems="center">
            <Transactions />
            <NotificationDot show={expertMode}>
              <GlobalSettings />
            </NotificationDot>
          </Flex>
        )}
      </AppHeaderContainer>
    );
  }

  return (
    <AppHeaderContainer style={style}>
      <Flex alignItems="center" mr={noConfig ? 0 : '16px'}>
        {backTo && <Text>&lt; Back</Text>}
        <Heading as="h2" mb="8px" marginBottom="0px">
          {title}
        </Heading>
      </Flex>
      {!noConfig && (
        <Flex alignItems="center">
          <Transactions />
          <NotificationDot show={expertMode}>
            <GlobalSettings />
          </NotificationDot>
        </Flex>
      )}
    </AppHeaderContainer>
  );
};

export default AppHeader;
