import React from 'react';
import { Button, useWalletModal } from '@my/ui';
import useAuth from 'hooks/useAuth';
import { useTranslation } from 'contexts/Localization';
import styled from 'styled-components';
const ButtonStyled = styled(Button)`
  border: none;
  height: 36px;
  width: 150px;
  background-image: linear-gradient(90deg, #a428d0 0%, #20d4a9 100%);
  color: ${({ theme }) => theme.colors.text};
`;
const ConnectWalletButton = (props) => {
  const { t } = useTranslation();
  const { login, logout } = useAuth();
  const { onPresentConnectModal } = useWalletModal(login, logout);

  return (
    <ButtonStyled variant="tertiary" onClick={onPresentConnectModal} width="140px" padding="0" {...props}>
      {t('Connect Wallet')}
    </ButtonStyled>
  );
};

export default ConnectWalletButton;
