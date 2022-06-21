import React, { FC } from 'react';
import { useMatchBreakpoints, Flex } from '@my/ui';
import { TableHeaderStyled } from './VaultTable/VaultTable';
import styled from 'styled-components';
import { OptionProps } from 'components/Select/Select';
import SortIcon, { ISortDir } from 'components/SortIcon';
const TextStyled = styled(Flex)`
  padding-top: 30px;
  font-weight: 600;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
  text-align: left;
`;
const TextStyledCursor = styled(TextStyled)`
  cursor: pointer;
`;
const FirstTh = styled(TextStyled)`
  padding-left: 20px;

  ${({ theme }) => theme.mediaQueries.sm} {
    // padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 40px;
  }
`;
const SortIconStyled = styled(SortIcon)`
  width: 12px;
  margin-left: 4px;
  cursor: pointer;
`;
interface Iprops {
  sortKey: string;
  sortDir: ISortDir;
  onOptionChange?: (option: OptionProps) => void;
}
const TableHeader: FC<Iprops> = ({ sortKey, sortDir, onOptionChange }) => {
  const { isXl, isLg } = useMatchBreakpoints();
  const isMobile = !(isXl || isLg);
  const HandleClick = (label: string, value: string) => {
    const side: ISortDir =
      sortKey === value
        ? sortDir === ISortDir.default
          ? ISortDir.down
          : sortDir === ISortDir.down
          ? ISortDir.up
          : sortDir === ISortDir.up
          ? ISortDir.default
          : ISortDir.down
        : ISortDir.down;
    onOptionChange({
      label: label,
      side: side,
      value: value,
    });
  };
  if (!isMobile) {
    return (
      <TableHeaderStyled>
        <tr>
          <td>
            <FirstTh>Token</FirstTh>
          </td>
          <TrStyled>
            <TextStyled>Net Value</TextStyled>
          </TrStyled>
          <TrStyled>
            <TextStyledCursor onClick={() => HandleClick('TVL', 'liquidity')}>
              <p>TVL</p>
              <SortIconStyled sortDir={sortKey === 'liquidity' ? sortDir : ISortDir.default} />
            </TextStyledCursor>
          </TrStyled>
          <TrStyled>
            <TextStyledCursor onClick={() => HandleClick('APY', 'apy')}>
              <p>APR</p>
              <SortIconStyled sortDir={sortKey === 'apy' ? sortDir : ISortDir.default} />
            </TextStyledCursor>
          </TrStyled>
          <TrStyled>
            <TextStyled>wallet balance</TextStyled>
          </TrStyled>
          <TrStyled>
            <TextStyled></TextStyled>
          </TrStyled>
        </tr>
      </TableHeaderStyled>
    );
  }
  // mobie
  return null;
};
const TrStyled = styled.th`
  padding-left: 18px;
`;
export default TableHeader;
