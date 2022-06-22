import React from 'react';
import styled from 'styled-components';
// import { useTranslation } from 'contexts/Localization';
// import { Text } from '@my/ui';
// import { getBalanceNumber } from 'utils/formatBalance';
import { TokenPairImage } from 'components/TokenImage';
import { getImageUrlFromToken } from 'utils';
import DefaultImg from 'components/DefaultImg';

export interface VaultProps {
  label?: string;
  token0Address: string;
  token1Address: string;
  farmProject?: string;
  isSingle?: boolean;
}

const Container = styled.div`
  display: flex;
  align-items: center;
`;
const LabelStyled = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-left: 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
    margin-left: -6px;
  }
  p {
    margin-top: 6px;
    font-size: 12px;
    font-weight: 500;
  }
`;

const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 55px;
  .img {
    display: block;
    width: 62%;
    margin: 0 auto;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    padding-right: 20px;
    width: 70px;
  }
`;

const Vault: React.FunctionComponent<VaultProps> = ({ token0Address, token1Address, label, farmProject, isSingle }) => {
  return (
    <Container>
      <TokenWrapper>
        {isSingle ? (
          token0Address ? (
            <img src={getImageUrlFromToken(token0Address)} className="img" alt="" />
          ) : (
            <DefaultImg />
          )
        ) : token0Address ? (
          <TokenPairImage
            variant="inverted"
            primaryToken={token0Address}
            secondaryToken={token1Address}
            width={60}
            height={60}
          />
        ) : (
          <DefaultImg />
        )}
      </TokenWrapper>
      <LabelStyled>
        <h2>{label}</h2>
        <p>{farmProject ?? 'Kacoswap'}</p>
      </LabelStyled>
    </Container>
  );
};

export default Vault;
