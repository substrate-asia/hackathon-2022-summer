import { TokenPairImage } from 'components/TokenImage';
import { chainId, DEFAULT_Token } from 'config/constants/tokens';
import styled from 'styled-components';
import { getImageUrlFromToken } from 'utils';
import { IToken, ITokenType } from '../utils/types';
const TokenPairImageWrap = styled.div`
  width: 52px;
  margin-right: 12px;
`;

const ImgStyled = styled.img`
  width: 32px;
  margin-right: 12px;
`;
const ZapCurrencyLogo = ({ currency }: { currency: IToken }) => {
  if (currency.type === ITokenType.LP) {
    return (
      <TokenPairImageWrap>
        <TokenPairImage
          variant="inverted"
          primaryToken={currency.token.address[chainId]}
          secondaryToken={currency.quoteToken.address[chainId]}
          width={60}
          height={60}
        />
      </TokenPairImageWrap>
    );
  }
  if (!currency.address) {
    return <ImgStyled src={getImageUrlFromToken(DEFAULT_Token[chainId].address)} alt="" />;
  }
  return <ImgStyled src={getImageUrlFromToken(currency.address[chainId])} alt="" />;
};
export default ZapCurrencyLogo;
