import React, { useState } from 'react';
import styled from 'styled-components';
import { useMatchBreakpoints } from '@my/ui';
import { Pool } from 'state/types';
import { useCakeVault } from 'state/pools/hooks';
import useDelayedUnmount from 'hooks/useDelayedUnmount';
import NameCell from './Cells/NameCell';
import EarningsCell from './Cells/EarningsCell';
import AprCell from './Cells/AprCell';
import TotalStakedCell from './Cells/TotalStakedCell';
import EndsInCell from './Cells/EndsInCell';
import Details from './Cells/ExpandActionCell';
import ActionPanel from './ActionPanel/ActionPanel';
import CellLayout from './Cells/CellLayout';
import { useTranslation } from 'contexts/Localization';

interface PoolRowProps {
  pool: Pool;
  account: string;
  userDataReady: boolean;
  isLast: boolean;
}

const StyledTr = styled.tr<{ isLast: boolean }>`
  cursor: pointer;
  ${(props) => !props.isLast && 'border-bottom: 1px solid #122124;'}
`;

const CellInner = styled.div`
  padding: 24px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 8px;

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-right: 32px;
  }
`;

const PoolRow: React.FC<PoolRowProps> = ({ pool, account, userDataReady, isLast }) => {
  const { t } = useTranslation();
  const { isXs, isSm, isMd, isLg, isXl } = useMatchBreakpoints();
  const [actionPanelExpanded, setActionPanelExpanded] = useState(false);
  const shouldRenderChild = useDelayedUnmount(actionPanelExpanded, 300);

  const toggleActionPanel = () => {
    setActionPanelExpanded((prev) => !prev);
  };

  const {
    fees: { performanceFee },
  } = useCakeVault();
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100;

  const handleRenderRow = () => {
    if (!isXs && !isSm) {
    }
    return (
      <StyledTr onClick={toggleActionPanel} isLast={isLast}>
        <td>
          <CellInner>
            <CellLayout>
              <NameCell pool={pool} />
            </CellLayout>
          </CellInner>
        </td>
        <td>
          <CellInner>
            <EarningsCell pool={pool} account={account} userDataReady={userDataReady} />
          </CellInner>
        </td>
        <td>
          <AprCell pool={pool} performanceFee={performanceFeeAsDecimal} />
        </td>
        {(isLg || isXl) && (
          <td>
            <CellLayout label={t('Total staked')}>
              <TotalStakedCell pool={pool} />
            </CellLayout>
          </td>
        )}

        {isXl && (
          <td>
            <EndsInCell pool={pool} />
          </td>
        )}
        <td>
          <CellInner>
            <CellLayout>
              <Details actionPanelToggled={actionPanelExpanded} />
            </CellLayout>
          </CellInner>
        </td>
      </StyledTr>
    );
  };
  return (
    <>
      {handleRenderRow()}
      {shouldRenderChild && (
        <tr>
          <td colSpan={6}>
            <ActionPanel
              account={account}
              pool={pool}
              userDataReady={userDataReady}
              actionPanelExpanded={actionPanelExpanded}
              breakpoints={{ isXs, isSm, isMd, isLg, isXl }}
            />
          </td>
        </tr>
      )}
    </>
  );
};

export default PoolRow;
