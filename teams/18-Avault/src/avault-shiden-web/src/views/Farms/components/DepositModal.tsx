import BigNumber from 'bignumber.js';
import React, { useCallback, useMemo, useState } from 'react';
import { AutoRenewIcon, Button, Modal, useMatchBreakpoints } from '@my/ui';
import { FarmModalInput } from 'components/Modal';
import { useTranslation } from 'contexts/Localization';
import { getFullDisplayBalance } from 'utils/formatBalance';
import useToast from 'hooks/useToast';
import { FarmWithStakedValue } from './FarmTable/FarmTable';

interface DepositModalProps {
  max: BigNumber;
  onConfirm: (amount: string) => void;
  onDismiss?: () => void;
  tokenName?: string;
  addLiquidityUrl?: string;
  farm: FarmWithStakedValue;
}

const DepositModal: React.FC<DepositModalProps> = ({
  max,
  onConfirm,
  onDismiss,
  tokenName = '',
  addLiquidityUrl,
  farm,
}) => {
  const [val, setVal] = useState('');
  const { toastSuccess, toastError } = useToast();
  const [pendingTx, setPendingTx] = useState(false);
  const { t } = useTranslation();
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max);
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
  const disabled = pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber);
  return (
    <Modal
      title={t('Stake LP tokens')}
      minWidth={isMobile ? '280px' : '520px'}
      bodyPadding="0 24px 34px"
      onDismiss={onDismiss}
    >
      <FarmModalInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
        addLiquidityUrl={addLiquidityUrl}
        inputTitle={t('Stake')}
        farm={farm}
      />
      <Button
        width="100%"
        disabled={disabled}
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={async () => {
          setPendingTx(true);
          try {
            await onConfirm(val);
            toastSuccess(t('Staked!'), t('Your funds have been staked in the farm'));
            onDismiss();
          } catch (e: any) {
            toastError('Error', e.message ? e.message : `Your ${farm.lpSymbol} Staked failed!`);
            console.error(e);
          } finally {
            setPendingTx(false);
          }
        }}
      >
        Deposit
      </Button>
    </Modal>
  );
};

export default DepositModal;
