import styled from 'styled-components';

export const ActionContainer = styled.div<{ smallBorder: boolean }>`
  width: 100%;
  min-width: 250px;
  padding: ${({ smallBorder }) => (smallBorder ? '16px' : '0')};
  border: 1px solid ${({ theme, smallBorder }) => (smallBorder ? theme.colors.cardBorder : theme.colors.cardBackground)};
  margin-top: ${({ smallBorder }) => (smallBorder ? '10px' : '0')};
  border-radius: ${({ smallBorder, theme }) => (smallBorder ? theme.radii.card : 0)};
  background-color: ${({ theme }) => theme.colors.cardBackground};
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 10px;
    border-radius: ${({ theme }) => theme.radii.card};
    min-height: 114px;
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
    padding: 16px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 350px;
    width: 50%;
    margin-top: 0;
  }
`;
export const ActionContainerSize = styled.div<{ smallBorder: boolean }>`
  width: 100%;
  min-width: 250px;
  // padding: ${({ smallBorder }) => (smallBorder ? '16px' : '0')};
  margin-top: ${({ smallBorder }) => (smallBorder ? '10px' : '0')};
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 10px;
    min-height: 114px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 350px;
    width: 50%;
    margin-top: 0;
  }
`;
export const ActionContainerBg = styled.div<{ smallBorder: boolean }>`
  border: 1px solid ${({ theme, smallBorder }) => (smallBorder ? theme.colors.cardBorder : theme.colors.cardBackground)};
  border-radius: ${({ smallBorder, theme }) => (smallBorder ? theme.radii.card : 0)};
  background-color: ${({ theme }) => theme.colors.cardBackground};
  ${({ theme }) => theme.mediaQueries.sm} {
    border-radius: ${({ theme }) => theme.radii.card};
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
    padding: 16px;
  }
`;

export const InfoContainer = styled.div`
  display: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: end;
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    align-items: start;
    max-width: 300px;
    min-width: 120px;
    margin-right: 10%;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 200px;
    min-width: 80px;
  }
`;
