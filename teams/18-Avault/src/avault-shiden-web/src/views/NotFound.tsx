import React from 'react';
import styled from 'styled-components';
import { Button } from '@my/ui';
import Page from 'components/Layout/Page';
import { useTranslation } from 'contexts/Localization';
// import LogoMainSvg from 'components/svg/logo-main.svg';
import Icon404 from 'components/svg/Icon404';

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  justify-content: center;
`;

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Page>
      <StyledNotFound>
        {/* <img alt="" src={LogoMainSvg} style={{ marginBottom: '8px', width: '64px' }} /> */}
        <Icon404 />
        <Button mt="30px" as="a" href="/" scale="sm">
          {t('Back Home')}
        </Button>
      </StyledNotFound>
    </Page>
  );
};

export default NotFound;
