import React, { useState } from 'react';
import styled from 'styled-components';
import { FarmWithStakedValue } from 'views/Farms/components/FarmTable/FarmTable';
import { useMatchBreakpoints } from '@my/ui';
import useDelayedUnmount from 'hooks/useDelayedUnmount';
// import { useFarmUser } from 'state/farms/hooks';

import Apr, { AprProps } from './Apr';
import Farm, { FarmProps } from './Farm';
import Earned, { EarnedProps } from './Earned';
import Details from './Details';
import Multiplier, { MultiplierProps } from './Multiplier';
import Liquidity, { LiquidityProps } from './Liquidity';
import ActionPanel from './Actions/ActionPanel';
import CellLayout from './CellLayout';
import { DesktopColumnSchema } from '../types';

export interface RowProps {
  apr: AprProps;
  farm: FarmProps;
  earned: EarnedProps;
  multiplier: MultiplierProps;
  liquidity: LiquidityProps;
  details: FarmWithStakedValue;
}

interface RowPropsWithLoading extends RowProps {
  userDataReady: boolean;
  isLast: boolean;
}

const cells = {
  apr: Apr,
  farm: Farm,
  earned: Earned,
  details: Details,
  multiplier: Multiplier,
  liquidity: Liquidity,
};

const StyledDetailTr = styled.tr`
  background: ${({ theme }) => theme.card.background};
  border-radius: 0 0 12px 12px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  box-shadow: 0 10px 20px 5px rgba(0, 0, 0, 0.03);
  border-top: none;
  display: block;
  ${({ theme }) => theme.mediaQueries.sm} {
    box-shadow: none;
    border: none;
    border-radius: 0;
    display: table-row;
  }
`;
const StyledTr = styled.tr<{ isLast: boolean }>`
  background: ${({ theme }) => theme.card.background};
  border-radius: 12px 12px 0 0;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  box-shadow: 0 10px 20px 5px rgba(0, 0, 0, 0.03);
  border-bottom: none;
  display: block;
  ${({ theme }) => theme.mediaQueries.sm} {
    box-shadow: none;
    border: none;
    border-radius: 0;
    cursor: pointer;
    display: table-row;
  }
  td: first-child {
    padding-left: 16px;
    width: 220px;
    ${({ theme }) => theme.mediaQueries.md} {
      width: 380px;
    }
    ${({ theme }) => theme.mediaQueries.sm} {
      padding-left: 40px;
    }
  }
  td: last-child {
    padding-right: 16px;
    width: 60px;
    ${({ theme }) => theme.mediaQueries.sm} {
      padding-right: 40px;
    }
  }
  td {
    padding-top: 20px;
    padding-bottom: 20px;
  }
`;

const Row: React.FunctionComponent<RowPropsWithLoading> = (props) => {
  const { userDataReady } = props;
  // const hasStakedAmount = !!useFarmUser(details.pid).stakedBalance.toNumber();
  const [actionPanelExpanded, setActionPanelExpanded] = useState(false);
  const shouldRenderChild = useDelayedUnmount(actionPanelExpanded, 300);

  const toggleActionPanel = () => {
    setActionPanelExpanded(!actionPanelExpanded);
  };

  // useEffect(() => {
  //   setActionPanelExpanded(hasStakedAmount);
  // }, [hasStakedAmount]);

  const { isMd, isXl, isLg } = useMatchBreakpoints();

  const isMobile = !(isMd || isXl || isLg);
  const tableSchema = DesktopColumnSchema;
  const columnNames = tableSchema.map((column) => column.name);
  const handleRenderRow = () => {
    if (!isMobile) {
      return (
        <StyledTr onClick={toggleActionPanel} isLast={props.isLast}>
          {Object.keys(props).map((key) => {
            const columnIndex = columnNames.indexOf(key);
            if (columnIndex === -1) {
              return null;
            }

            switch (key) {
              case 'details':
                return (
                  <td key={key}>
                    <Details actionPanelToggled={actionPanelExpanded} />
                  </td>
                );
              // case 'multiplier':
              //   return null;
              case 'apr':
                return (
                  <td key={key}>
                    <Apr {...props.apr} hideButton={isMobile} />
                  </td>
                );
              default:
                return <td key={key}>{React.createElement(cells[key], { ...props[key], userDataReady })}</td>;
            }
          })}
        </StyledTr>
      );
    }

    return (
      <StyledTr onClick={toggleActionPanel} isLast={props.isLast}>
        <td>
          <CellLayout>
            <Farm {...props.farm} />
          </CellLayout>
        </td>
        <td></td>
        <td></td>
        <td></td>
      </StyledTr>
    );
  };
  return (
    <>
      {handleRenderRow()}
      {shouldRenderChild || isMobile ? (
        <StyledDetailTr>
          <td colSpan={6}>
            <ActionPanel {...props} expanded={actionPanelExpanded || isMobile} />
          </td>
        </StyledDetailTr>
      ) : null}
    </>
  );
};

export default Row;
