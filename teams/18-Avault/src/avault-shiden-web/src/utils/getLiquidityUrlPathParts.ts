// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.
import { chainId } from 'config/constants/tokens';
import { getwethAddress } from './addressHelpers';

const getLiquidityUrlPathParts = ({ quoteTokenAddress, tokenAddress }) => {
  const wethAddressString = getwethAddress();
  const quoteTokenAddressString: string = quoteTokenAddress ? quoteTokenAddress[chainId] : null;
  const tokenAddressString: string = tokenAddress ? tokenAddress[chainId] : null;
  const firstPart =
    !quoteTokenAddressString || quoteTokenAddressString === wethAddressString ? 'BNB' : quoteTokenAddressString;
  const secondPart = !tokenAddressString || tokenAddressString === wethAddressString ? 'BNB' : tokenAddressString;
  return `${firstPart}/${secondPart}`;
};

export default getLiquidityUrlPathParts;
