import React from 'react';
import styled from 'styled-components';
import { Flex, Heading, CloseIcon, ArrowBackIcon, IconButton } from '@my/ui';
type Handler = () => void;
interface InjectedProps {
  onDismiss?: Handler;
}

interface Props extends InjectedProps {
  title?: string;
  hideCloseButton?: boolean;
  onBack?: () => void;
  bodyPadding?: string;
}

const StyledModal = styled.div`
  background: ${({ theme }) => theme.colors.tooltipColors.background};
  box-shadow: 0px 20px 36px -8px rgba(14, 14, 44, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.tooltipColors.borderColor};
  border-radius: 12px;
  width: 100%;
  z-index: ${({ theme }) => theme.zIndices.modal};
  overflow-y: auto;
  ${({ theme }) => theme.mediaQueries.xs} {
    width: 360px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 480px;
    max-width: 100%;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  align-items: center;
  padding: 24px 24px 10px;
`;

const ModalTitle = styled(Flex)`
  align-items: center;
  flex: 1;
  h2 {
    font-weight: 600;
    font-size: 18px;
  }
`;

const Modal: React.FC<Props> = ({
  title,
  onDismiss,
  onBack,
  children,
  hideCloseButton = false,
  bodyPadding = '24px',
}) => (
  <StyledModal>
    {title ? (
      <ModalHeader>
        <ModalTitle>
          {onBack && (
            <IconButton variant="text" onClick={onBack} area-label="go back" mr="8px">
              <ArrowBackIcon color="primary" />
            </IconButton>
          )}
          <Heading>{title}</Heading>
        </ModalTitle>
        {!hideCloseButton && (
          <IconButton variant="text" onClick={onDismiss} aria-label="Close the dialog">
            <CloseIcon fill="text" width="24" />
          </IconButton>
        )}
      </ModalHeader>
    ) : null}
    <Flex flexDirection="column" p={bodyPadding}>
      {children}
    </Flex>
  </StyledModal>
);

export default Modal;
