import { Button, Text } from '@my/ui';
import styled from 'styled-components';

// export const ActionContainer = styled.div<{ smallBorder: boolean }>`
//   width: 100%;
//   min-width: 300px;
//   padding: ${({ smallBorder }) => (smallBorder ? '16px' : '0')};
//   border: 1px solid ${({ theme, smallBorder }) => (smallBorder ? theme.colors.cardBorder : theme.colors.cardBackground)};
//   margin-top: ${({ smallBorder }) => (smallBorder ? '10px' : '0')};
//   border-radius: ${({ smallBorder, theme }) => (smallBorder ? theme.radii.card : 0)};
//   background-color: ${({ theme }) => theme.colors.cardBackground};
//   ${({ theme }) => theme.mediaQueries.sm} {
//     min-width: 200px;
//     margin-top: 10px;
//     border-radius: ${({ theme }) => theme.radii.card};
//     min-height: 114px;
//     border: 1px solid ${({ theme }) => theme.colors.cardBorder};
//     padding: 16px;
//   }
//   ${({ theme }) => theme.mediaQueries.md} {
//     max-width: 350px;
//     // width: 50%;
//     margin-top: 0;
//   }
// `;
export const ActionTitles = styled.div``;
export const ActionTitlesTitle = styled(Text)`
  font-weight: 600;
  font-size: 12px;
  line-height: 27px;
  color: ${({ theme }) => theme.colors.text};
`;
export const ActionTitlesBalance = styled(Text)<{ balance: number }>`
  font-weight: 600;
  font-size: 18px;
  color: ${({ theme, balance }) => (balance ? theme.colors.primary : theme.colors.textSubSubtle)};
`;
export const ActionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const LongButton = styled(Button)<{ disabled: boolean }>`
  height: 36px;
  width: 100%;
  margin-top: 4px;
  transition: all 0.3s ease;
  position: relative;
  // &.loading {
  // color: ${({ theme }) => theme.colors.primary};
  // text-align: left;
  // justify-content: space-between;
  // }
`;
