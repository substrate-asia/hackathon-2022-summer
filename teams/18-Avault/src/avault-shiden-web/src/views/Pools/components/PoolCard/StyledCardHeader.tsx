import React from 'react';
import { CardHeader, Heading, Text, Flex } from '@my/ui';
import styled from 'styled-components';
import { useTranslation } from 'contexts/Localization';
import { Token } from 'config/constants/types';
import { TokenPairImage } from 'components/TokenImage';
import CakeVaultTokenPairImage from '../CakeVaultCard/CakeVaultTokenPairImage';
import { chainId } from 'config/constants/tokens';

const Wrapper = styled(CardHeader)<{ isFinished?: boolean; background?: string }>`
  background: ${({ isFinished, background, theme }) =>
    isFinished ? theme.colors.backgroundDisabled : theme.colors.gradients[background]};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
`;

const StyledCardHeader: React.FC<{
  earningToken: Token;
  stakingToken: Token;
  isAutoVault?: boolean;
  isFinished?: boolean;
  isStaking?: boolean;
}> = ({ earningToken, stakingToken, isFinished = false, isAutoVault = false, isStaking = false }) => {
  const { t } = useTranslation();
  const isCakePool = earningToken.symbol === 'KAC' && stakingToken.symbol === 'KAC';
  const background = isStaking ? 'bubblegum' : 'cardHeader';

  const getHeadingPrefix = () => {
    if (isAutoVault) {
      // vault
      return t('Auto');
    }
    if (isCakePool) {
      // manual cake
      return t('Manual');
    }
    // all other pools
    return t('Earn');
  };

  const getSubHeading = () => {
    if (isAutoVault) {
      return t('Automatic restaking');
    }
    if (isCakePool) {
      return t('Earn KAC, stake KAC');
    }
    return t('Stake %symbol%', { symbol: stakingToken.symbol });
  };

  return (
    <Wrapper isFinished={isFinished} background={background}>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column">
          <Heading color={isFinished ? 'textDisabled' : 'body'} scale="lg">
            {`${getHeadingPrefix()} ${earningToken.symbol}`}
          </Heading>
          <Text color={isFinished ? 'textDisabled' : 'textSubtle'}>{getSubHeading()}</Text>
        </Flex>
        {isAutoVault ? (
          <CakeVaultTokenPairImage width={64} height={64} />
        ) : (
          <TokenPairImage
            primaryToken={earningToken[chainId]}
            secondaryToken={stakingToken[chainId]}
            width={64}
            height={64}
          />
        )}
      </Flex>
    </Wrapper>
  );
};

export default StyledCardHeader;
