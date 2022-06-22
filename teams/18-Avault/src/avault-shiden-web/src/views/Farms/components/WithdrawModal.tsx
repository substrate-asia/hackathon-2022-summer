import BigNumber from 'bignumber.js';
import React, { useCallback, useMemo, useState } from 'react';
import { Button, Modal, useMatchBreakpoints } from '@my/ui';
import { FarmModalInput } from 'components/Modal';
import { useTranslation } from 'contexts/Localization';
import { getFullDisplayBalance } from 'utils/formatBalance';
import useToast from 'hooks/useToast';
import { FarmWithStakedValue } from './FarmTable/FarmTable';

interface WithdrawModalProps {
  max: BigNumber;
  onConfirm: (amount: string) => void;
  onDismiss?: () => void;
  tokenName?: string;
  farm: FarmWithStakedValue;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onConfirm, onDismiss, max, tokenName = '', farm }) => {
  const [val, setVal] = useState('');
  const { toastSuccess, toastError } = useToast();
  const [pendingTx, setPendingTx] = useState(false);
  const { t } = useTranslation();
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, 18, 8);
  }, [max]);

  const valNumber = new BigNumber(val);
  const fullBalanceNumber = new BigNumber(fullBalance);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'));
      }
    },
    [setVal],
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);
  const { isMd, isXl, isLg } = useMatchBreakpoints();
  const isMobile = !(isMd || isXl || isLg);

  return (
    <Modal
      title={t('Stake LP tokens')}
      minWidth={isMobile ? '280px' : '520px'}
      bodyPadding="0 24px 34px"
      onDismiss={onDismiss}
    >
      <FarmModalInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
        inputTitle={t('Unstake')}
        farm={farm}
      />
      <Button
        disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
        onClick={async () => {
          setPendingTx(true);
          try {
            await onConfirm(val);
            toastSuccess(t('Unstaked!'), t('Your earnings have also been harvested to your wallet'));
            onDismiss();
          } catch (e) {
            toastError(
              t('Error'),
              t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
            );
            console.error(e);
          } finally {
            setPendingTx(false);
          }
        }}
        width="100%"
      >
        {pendingTx ? t('Confirming') : t('Confirm')}
      </Button>
    </Modal>
  );
};

export default WithdrawModal;
