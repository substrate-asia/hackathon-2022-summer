import React, { useCallback } from 'react';
import { Currency, Token, ChainId } from '@my/sdk';
import styled from 'styled-components';
import { Button, Text, ErrorIcon, Flex, Box, Modal, InjectedModalProps, MetamaskIcon } from '@my/ui';
import { registerToken } from 'utils/wallet';
import { useTranslation } from 'contexts/Localization';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { AutoColumn, ColumnCenter } from '../Layout/Column';
import { RowFixed } from '../Layout/Row';
import PageLoading from './PageLoading';
import IconSvg from '../svg/icon.svg';
import { wrappedCurrency } from 'utils/wrappedCurrency';

const Wrapper = styled.div`
  width: 100%;
`;
const ConfirmedIcon = styled(ColumnCenter)`
  padding: 24px 0;
`;

function ConfirmationPendingContent({ pendingText }: { pendingText: string }) {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <ConfirmedIcon style={{ padding: '0px 0px 24px 0px' }}>
        <PageLoading />
      </ConfirmedIcon>
      <AutoColumn gap="12px" justify="center">
        <Text fontSize="12px" color="secondary">
          {t('Waiting For Confirmation')}
        </Text>
        <AutoColumn gap="12px" justify="center">
          <Text fontSize="12px" color="primary" textAlign="center">
            {pendingText}
          </Text>
        </AutoColumn>
        <Flex
          style={{
            color: '#F1842C',
            padding: '0px 30px',
            marginBottom: '75px',
            marginTop: '5px',
            background: '#272E32',
            borderRadius: '12px',
            justifyContent: 'center',
            alignItems: 'center',
            height: '32px',
            fontSize: '12px',
          }}
        >
          {t('Confirm this transaction in your wallet')}
        </Flex>
      </AutoColumn>
    </Wrapper>
  );
}

function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
}: {
  onDismiss: () => void;
  hash: string | undefined;
  chainId: ChainId;
  currencyToAdd?: Currency | undefined;
}) {
  const { t } = useTranslation();
  const { library } = useActiveWeb3React();
  const token: Token | undefined = wrappedCurrency(currencyToAdd, chainId);

  return (
    <Wrapper>
      <ConfirmedIcon>
        <img src={IconSvg} style={{ width: '64px', height: '64px' }} alt="" />
      </ConfirmedIcon>
      <AutoColumn gap="12px" justify="center">
        <Text fontSize="14px">{t('Transaction Submitted')}</Text>
        {/* {chainId && hash && (
          <Link external small href={getBscScanLink(hash, 'transaction', chainId)}>
            View on Block browser
          </Link>
        )} */}
        {currencyToAdd && library?.provider?.isMetaMask && (
          <Button
            variant="tertiary"
            mt="12px"
            width="fit-content"
            onClick={() => registerToken(token.address, token.symbol, token.decimals)}
          >
            <RowFixed>
              {t('Add %asset% to Metamask', { asset: currencyToAdd.symbol })}
              <MetamaskIcon width="16px" ml="6px" />
            </RowFixed>
          </Button>
        )}
        <Button
          onClick={onDismiss}
          mt="20px"
          variant="text"
          style={{ fontSize: '14px', width: '200px', background: '#272E32' }}
        >
          {t('Close')}
        </Button>
      </AutoColumn>
    </Wrapper>
  );
}

export function ConfirmationModalContent({
  bottomContent,
  topContent,
}: {
  topContent: () => React.ReactNode;
  bottomContent: () => React.ReactNode;
}) {
  return (
    <Wrapper>
      <Box>{topContent()}</Box>
      <Box>{bottomContent()}</Box>
    </Wrapper>
  );
}

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <AutoColumn justify="center">
        <ErrorIcon color="failure" width="64px" />
        <Text color="failure" style={{ textAlign: 'center', width: '85%' }}>
          {message}
        </Text>
      </AutoColumn>

      <Flex justifyContent="center" pt="24px">
        <Button onClick={onDismiss}>{t('Dismiss')}</Button>
      </Flex>
    </Wrapper>
  );
}

interface ConfirmationModalProps {
  title: string;
  customOnDismiss?: () => void;
  hash: string | undefined;
  content: () => React.ReactNode;
  attemptingTxn: boolean;
  pendingText: string;
  currencyToAdd?: Currency | undefined;
}

const TransactionConfirmationModal: React.FC<InjectedModalProps & ConfirmationModalProps> = ({
  title,
  onDismiss,
  customOnDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  currencyToAdd,
}) => {
  const { chainId } = useActiveWeb3React();

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss();
    }
    onDismiss();
  }, [customOnDismiss, onDismiss]);

  if (!chainId) return null;

  return (
    <Modal style={{ border: '0', width: '100%', maxWidth: '500px' }} title={title} onDismiss={handleDismiss}>
      {attemptingTxn ? (
        <ConfirmationPendingContent pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content()
      )}
    </Modal>
  );
};

export default TransactionConfirmationModal;
