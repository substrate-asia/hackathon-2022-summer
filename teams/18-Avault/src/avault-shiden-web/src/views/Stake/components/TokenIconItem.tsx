import { FC } from 'react';
import styled from 'styled-components';
import { Flex } from '@my/ui';
import { getImageUrlFromToken } from 'utils';

interface IProps {
  symbol: string;
  tokenAddress: string;
}
const TokenStyle = styled(Flex)`
  width: 100px;
  height: 32px;
  line-height: 32px;
  font-size: 15px;
  align-items: center;
  justify-content: start;

  img {
    width: 32px;
    margin-right: 8px;
  }
`;

const TokenIconItem: FC<IProps> = ({ symbol, tokenAddress }) => {
  return (
    <TokenStyle>
      <img src={getImageUrlFromToken(tokenAddress)} alt={tokenAddress} />
      <h2>{symbol}</h2>
    </TokenStyle>
  );
};
export default TokenIconItem;
