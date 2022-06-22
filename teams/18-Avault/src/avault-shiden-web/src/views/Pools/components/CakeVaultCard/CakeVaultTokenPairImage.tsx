import React from 'react';
import { TokenPairImage, ImageProps } from '@my/ui';
import { Kaco } from 'config/constants/tokens';
import { getAddress } from 'utils/addressHelpers';
import { chainKey } from 'config';

const CakeVaultTokenPairImage: React.FC<Omit<ImageProps, 'src'>> = (props) => {
  const primaryTokenSrc = `/images/tokens/${chainKey}/${getAddress(Kaco.address)}.svg`;

  return <TokenPairImage primarySrc={primaryTokenSrc} secondarySrc="/images/tokens/autorenew.svg" {...props} />;
};

export default CakeVaultTokenPairImage;
