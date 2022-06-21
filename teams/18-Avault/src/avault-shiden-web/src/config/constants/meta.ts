import { ContextApi } from 'contexts/Localization/types';
import { PageMeta } from './types';

export const DEFAULT_META: PageMeta = {
  title: 'Avault',
  description:
    'The most popular AMM on BSC by user count! Earn KAC through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by Avault), NFTs, and more, on a platform you can trust.',
  image: 'https://kaco.finance/images/hero.png',
};

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `Vault | Avault`,
      };
    case '/vault':
      return {
        title: `Vault | Avault`,
      };
    case '/zap':
      return {
        title: `Zap | Avault`,
      };
    case '/farms':
      return {
        title: `Farms | Avault`,
      };
    case '/governance':
      return {
        title: `Governance | Avault`,
      };
    case '/ido':
      return {
        title: `IDO | Avault`,
      };
    case '/stake':
      return {
        title: `Stake | Avault`,
      };
    default:
      return null;
  }
};
