import React from 'react';
import styled from 'styled-components';
// import { useFarmUser } from 'state/farms/hooks';
// import { useTranslation } from 'contexts/Localization';
// import { Text } from '@my/ui';
// import { getBalanceNumber } from 'utils/formatBalance';
import { Token } from 'config/constants/types';
import { chainId } from 'config/constants/tokens';
import { TokenPairImage } from 'components/TokenImage';

export interface FarmProps {
  label?: string;
  pid: number;
  token: Token;
  quoteToken: Token;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  > div {
    > .label {
      font-size: 13px;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text};
      ${({ theme }) => theme.mediaQueries.sm} {
        font-size: 16px;
      }
    }
    > .ratio {
      margin-top: 11px;
      font-size: 14px;
      color: #9da6a6;
    }
  }
`;

const TokenWrapper = styled.div`
  margin-right: 8px;

  width: 47px;
  height: 47px;
  text-align: center;

  background-image: url('./images/farm_img_bg.svg');
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
  padding: 4px;
  margin-bottom: 20px;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 56px;
    height: 56px;
    margin-bottom: 0;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-right: 20px;
    margin-bottom: 0;
    // width: 70px;
  }
  img {
    display: inline-block;
    height: 100%;
  }
`;

const Farm: React.FunctionComponent<FarmProps> = ({ token, quoteToken, label, pid }) => {
  // const { stakedBalance } = useFarmUser(pid);
  // const { t } = useTranslation();
  // const rawStakedBalance = getBalanceNumber(stakedBalance);

  // const handleRenderFarming = (): JSX.Element => {
  //   if (rawStakedBalance) {
  //     return (
  //       <Text color="textSubtle" fontSize="12px" bold textTransform="uppercase">
  //         {t('Farming')}
  //       </Text>
  //     );
  //   }

  //   return null;
  // };
  return (
    <Container>
      {/* <TokenWrapper>
        <img src={getImageUrlFromToken(label)} alt="" />
      </TokenWrapper> */}
      <TokenWrapper>
        <TokenPairImage
          variant="inverted"
          primaryToken={token.address[chainId]}
          secondaryToken={quoteToken.address[chainId]}
          width={48}
          height={48}
        />
      </TokenWrapper>
      <DivStyled>
        <div className="label">{label}</div>
        {/* <div className="ratio"><span>kacoSwap</span></div> */}
      </DivStyled>
    </Container>
  );
};
const DivStyled = styled.div`
  margin-bottom: 20px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-bottom: 0;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 0;
  }
`;
export default Farm;
