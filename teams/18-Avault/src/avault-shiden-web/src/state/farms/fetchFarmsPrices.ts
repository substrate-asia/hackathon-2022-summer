import { chainId } from 'config/constants/tokens';
import { Farm } from 'state/types';
// import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber';
// import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers';
// import { FARM_QUOTE_QUOTE_TOKEN_SYMBOL } from 'config/constants/farms';
import { PublicFarmData } from './fetchPublicFarmData';

// const getFarmFromTokenSymbol = (farms: Farm[], tokenSymbol: string, preferredQuoteTokens?: string[]): Farm => {
//   const farmsWithTokenSymbol = farms.filter((farm) => farm.token.symbol === tokenSymbol);
//   const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens);
//   return filteredFarm;
// };

// const getFarmBaseTokenPrice = (farm: Farm, quoteTokenFarm: Farm, bnbPriceBusd: BigNumber): BigNumber => {
//   const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote);

//   if (farm.quoteToken.symbol === 'BUSD' || farm.quoteToken.symbol === 'USDT' || farm.quoteToken.symbol === 'USDC') {
//     return hasTokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO;
//   }

//   if (farm.quoteToken.symbol === FARM_QUOTE_QUOTE_TOKEN_SYMBOL) {
//     return hasTokenPriceVsQuote ? bnbPriceBusd.times(farm.tokenPriceVsQuote) : BIG_ZERO;
//   }

//   // We can only calculate profits without a quoteTokenFarm for BUSD/BNB farms
//   if (!quoteTokenFarm) {
//     return BIG_ZERO;
//   }

//   // Possible alternative farm quoteTokens:
//   // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
//   // If the farm's quote token isn't BUSD or wBNB, we then use the quote token, of the original farm's quote token
//   // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - BNB, (pBTC - BNB)
//   // from the BNB - pBTC price, we can calculate the PNT - BUSD price
//   if (quoteTokenFarm.quoteToken.symbol === FARM_QUOTE_QUOTE_TOKEN_SYMBOL) {
//     const quoteTokenInBusd = bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote);
//     return hasTokenPriceVsQuote && quoteTokenInBusd
//       ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
//       : BIG_ZERO;
//   }

//   if (
//     quoteTokenFarm.quoteToken.symbol === 'BUSD' ||
//     quoteTokenFarm.quoteToken.symbol === 'USDT' ||
//     quoteTokenFarm.quoteToken.symbol === 'USDC'
//   ) {
//     const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote;
//     return hasTokenPriceVsQuote && quoteTokenInBusd
//       ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
//       : BIG_ZERO;
//   }

//   // Catch in case token does not have immediate or once-removed BUSD/wBNB quoteToken
//   return BIG_ZERO;
// };

// const getFarmQuoteTokenPrice = (farm: Farm, quoteTokenFarm: Farm, bnbPriceBusd: BigNumber): BigNumber => {
//   if (farm.quoteToken.symbol === 'BUSD' || farm.quoteToken.symbol === 'USDC' || farm.quoteToken.symbol === 'USDT') {
//     return BIG_ONE;
//   }

//   if (farm.quoteToken.symbol === FARM_QUOTE_QUOTE_TOKEN_SYMBOL) {
//     return bnbPriceBusd;
//   }

//   if (!quoteTokenFarm) {
//     return BIG_ZERO;
//   }

//   if (quoteTokenFarm.quoteToken.symbol === FARM_QUOTE_QUOTE_TOKEN_SYMBOL) {
//     return quoteTokenFarm.tokenPriceVsQuote ? bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO;
//   }

//   if (
//     quoteTokenFarm.quoteToken.symbol === 'BUSD' ||
//     quoteTokenFarm.quoteToken.symbol === 'USDT' ||
//     quoteTokenFarm.quoteToken.symbol === 'USDC'
//   ) {
//     return quoteTokenFarm.tokenPriceVsQuote ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO;
//   }

//   return BIG_ZERO;
// };

const fetchFarmsPrices = (farms: (Farm & PublicFarmData)[], priceVsBusdMap: Record<string, string>) => {
  // console.log({ priceVsBusdMap });
  const farmsWithPrices = farms.map((farm) => {
    const tokenAddress: string = farm.token.address[chainId];
    const quoteTokenAddress: string = farm.quoteToken.address[chainId];
    const token = {
      ...farm.token,
      busdPrice: priceVsBusdMap[tokenAddress.toLowerCase()] ? priceVsBusdMap[tokenAddress.toLowerCase()] : '1',
    };
    const quoteToken = {
      ...farm.quoteToken,
      busdPrice: priceVsBusdMap[quoteTokenAddress.toLowerCase()]
        ? priceVsBusdMap[quoteTokenAddress.toLowerCase()]
        : '1',
    };
    return { ...farm, token, quoteToken };
  });

  return farmsWithPrices;
};

// const fetchFarmsPrices_ = async (farms: (Farm & PublicFarmData)[]) => {
//   const bnbBusdFarm = farms.find((farm: Farm) => farm.pid === BUSD_BNB_LP_PID);
//   const bnbPriceBusd = bnbBusdFarm.tokenPriceVsQuote ? new BigNumber(bnbBusdFarm.tokenPriceVsQuote) : BIG_ZERO;

//   const farmsWithPrices = farms.map((farm) => {
//     const quoteTokenFarm = getFarmFromTokenSymbol(farms, farm.quoteToken.symbol);
//     const baseTokenPrice = getFarmBaseTokenPrice(farm, quoteTokenFarm, bnbPriceBusd);
//     let quoteTokenPrice = getFarmQuoteTokenPrice(farm, quoteTokenFarm, bnbPriceBusd);

//     if (farm.pid === 18) {
//       quoteTokenPrice = new BigNumber(20.57);
//     } else if (farm.pid === 19) {
//       quoteTokenPrice = new BigNumber(0.9272);
//     }

//     const token = { ...farm.token, busdPrice: baseTokenPrice.toJSON() };
//     const quoteToken = { ...farm.quoteToken, busdPrice: quoteTokenPrice.toJSON() };

//     // console.log(
//     //   `token ${farm.token.symbol} vs:${farm.tokenPriceVsQuote.slice(0, 5)} price:${token.busdPrice.slice(0, 5)}`,
//     //   `token ${farm.quoteToken.symbol}: price-${quoteToken.busdPrice.slice(0, 5)}`,
//     // );

//     return { ...farm, token, quoteToken };
//   });

//   return farmsWithPrices;
// };

export default fetchFarmsPrices;
