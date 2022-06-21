import React, { useState } from 'react';
import { Text, Flex, Modal, InjectedModalProps } from '@my/ui';
import { useExpertModeManager, useUserSingleHopOnly } from 'state/user/hooks';
import { useTranslation } from 'contexts/Localization';
import { useSwapActionHandlers } from 'state/swap/hooks';
import usePersistState from 'hooks/usePersistState';
import QuestionHelper from '../../QuestionHelper';
import TransactionSettings from './TransactionSettings';
import ExpertModal from './ExpertModal';
import Toggle from './Toggle';
import styled from 'styled-components';
const FlexStyled = styled(Flex)`
  justify-content: space-between;
  padding-top: 25px;
  margin-top: 19px;
  border-top: 2px solid ${({ theme }) => theme.colors.background02};
`;
const SettingsModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false);
  const [rememberExpertModeAcknowledgement, setRememberExpertModeAcknowledgement] = usePersistState(false, {
    localStorageKey: 'kacoswap_expert_mode_remember_acknowledgement',
  });
  const [expertMode, toggleExpertMode] = useExpertModeManager();
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly();
  const { onChangeRecipient } = useSwapActionHandlers();

  const { t } = useTranslation();

  if (showConfirmExpertModal) {
    return (
      <ExpertModal
        setShowConfirmExpertModal={setShowConfirmExpertModal}
        onDismiss={onDismiss}
        setRememberExpertModeAcknowledgement={setRememberExpertModeAcknowledgement}
      />
    );
  }

  const handleExpertModeToggle = () => {
    if (expertMode) {
      onChangeRecipient(null);
      toggleExpertMode();
    } else if (rememberExpertModeAcknowledgement) {
      onChangeRecipient(null);
      toggleExpertMode();
    } else {
      setShowConfirmExpertModal(true);
    }
  };

  return (
    <Modal
      bodyPadding="0px 24px 24px 24px"
      title={t('Settings')}
      onDismiss={onDismiss}
      style={{ width: '100%', maxWidth: '480px' }}
    >
      <Flex flexDirection="column">
        <TransactionSettings />
        <FlexStyled>
          <Flex justifyContent="space-between" alignItems="center">
            <Toggle checked={expertMode} onChange={handleExpertModeToggle} />
            <Flex alignItems="center" ml="11px">
              <Text fontSize="12px" bold>
                {t('Expert Mode')}
              </Text>
              <QuestionHelper
                ml="5px"
                text={t('Bypasses confirmation modals and allows high slippage trades. Use at your own risk.')}
              />
            </Flex>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center">
            <Toggle
              checked={singleHopOnly}
              onChange={() => {
                setSingleHopOnly(!singleHopOnly);
              }}
            />
            <Flex alignItems="center" ml="11px">
              <Text fontSize="12px" bold>
                {t('Disable Multihops')}
              </Text>
              <QuestionHelper text={t('Restricts swaps to direct pairs only.')} ml="5px" />
            </Flex>
          </Flex>
        </FlexStyled>
      </Flex>
    </Modal>
  );
};

export default SettingsModal;
