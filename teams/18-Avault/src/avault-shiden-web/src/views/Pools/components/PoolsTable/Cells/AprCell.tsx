import React from 'react';
import { useMatchBreakpoints } from '@my/ui';
import { Pool } from 'state/types';
import { useTranslation } from 'contexts/Localization';
import Apr from '../Apr';
import CellLayout from './CellLayout';

interface AprCellProps {
  pool: Pool;
  performanceFee: number;
}

const AprCell: React.FC<AprCellProps> = ({ pool, performanceFee }) => {
  const { t } = useTranslation();
  const { isXs, isSm } = useMatchBreakpoints();
  const { isAutoVault } = pool;
  return (
    <CellLayout label={isAutoVault ? t('APY') : t('APR')}>
      <Apr pool={pool} performanceFee={isAutoVault ? performanceFee : 0} showIcon={!isXs && !isSm} />
    </CellLayout>
  );
};

export default AprCell;
