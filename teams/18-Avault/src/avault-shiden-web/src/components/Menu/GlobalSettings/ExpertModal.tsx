import React, { useState } from 'react';
import { Button, Text, Flex, Message, Modal, InjectedModalProps, Checkbox } from '@my/ui';
import { useExpertModeManager } from 'state/user/hooks';
import { useTranslation } from 'contexts/Localization';

interface ExpertModalProps extends InjectedModalProps {
  setShowConfirmExpertModal: (boolean) => void;
  setRememberExpertModeAcknowledgement: (boolean) => void;
}

const ExpertModal: React.FC<ExpertModalProps> = ({
  setShowConfirmExpertModal,
  setRememberExpertModeAcknowledgement,
}) => {
  const [, toggleExpertMode] = useExpertModeManager();
  const [isRememberChecked, setIsRememberChecked] = useState(false);

  const { t } = useTranslation();

  return (
    <Modal
      title={t('Expert Mode')}
      onBack={() => setShowConfirmExpertModal(false)}
      onDismiss={() => setShowConfirmExpertModal(false)}
      style={{ maxWidth: '360px' }}
    >
      <Message variant="warning" mb="24px">
        <Text fontSize="12px">
          {t(
            "Expert mode turns off the 'Confirm' transaction prompt, and allows high slippage trades that often result in bad rates and lost funds.",
          )}
        </Text>
      </Message>
      <Text fontSize="12px" mb="24px">
        {t('Only use this mode if you know what you’re doing.')}
      </Text>
      <Flex alignItems="center" mb="24px">
        <Checkbox
          name="confirmed"
          type="checkbox"
          checked={isRememberChecked}
          onChange={() => setIsRememberChecked(!isRememberChecked)}
          scale="sm"
        />
        <Text fontSize="12px" ml="10px" style={{ userSelect: 'none' }}>
          {t('Don’t show this again')}
        </Text>
      </Flex>
      <Button
        mb="8px"
        id="confirm-expert-mode"
        onClick={() => {
          // eslint-disable-next-line no-alert
          if (window.prompt(`Please type the word "confirm" to enable expert mode.`) === 'confirm') {
            toggleExpertMode();
            setShowConfirmExpertModal(false);
            if (isRememberChecked) {
              setRememberExpertModeAcknowledgement(true);
            }
          }
        }}
      >
        {t('Turn On Expert Mode')}
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          setShowConfirmExpertModal(false);
        }}
      >
        {t('Cancel')}
      </Button>
    </Modal>
  );
};

export default ExpertModal;
