import React, { useState } from 'react';
import { Flex } from '@my/ui';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { BIG_ZERO } from 'utils/bigNumber';
import { useAppDispatch } from 'state';
import { fetchFarmUserDataAsync } from 'state/farms';
// import { usePriceCakeBusd } from 'state/farms/hooks';
import useToast from 'hooks/useToast';
import { useTranslation } from 'contexts/Localization';
import useHarvestFarm from '../../../hooks/useHarvestFarm';
import { ActionTitlesTitle, ActionTitlesBalance, LongButton, ActionContent } from './styles';
import styled from 'styled-components';
import { ActionContainer } from 'style/TableStyled';
import { FarmWithStakedValue } from '../FarmTable';
import masterChef_aAVT from 'config/abi/masterchef_aavt_shiden.json';

interface HarvestActionProps extends FarmWithStakedValue {
  pid: number;
  userDataReady: boolean;
  displayBalance: string | JSX.Element;
  earnings: BigNumber;
  lpSymbol: string;
  lpMasterChef: string;
}
const RewardsTitleStyled = styled(Flex)<{ disabled: boolean }>`
  display: ${({ disabled }) => (disabled ? 'none' : 'block')};
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: flex;
  }
`;
const FlexStyled = styled(Flex)`
  margin-top: 0;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`;
const ActionContentStyled = styled(ActionContent)<{ disabled: boolean }>`
  width: ${({ disabled }) => (disabled ? '100%' : '80px')};
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
  }
`;
const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({
  pid,
  earnings,
  displayBalance,
  userDataReady,
  lpMasterChef,
  lpSymbol,
}) => {
  const { toastSuccess, toastError } = useToast();

  const [pendingTx, setPendingTx] = useState(false);
  const { onReward } = useHarvestFarm(masterChef_aAVT, lpMasterChef, pid);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const disabled = earnings.eq(BIG_ZERO) || pendingTx || !userDataReady;
  return (
    <ActionContainer smallBorder={disabled ? false : true}>
      <FlexStyled>
        <RewardsTitleStyled disabled={disabled}>
          <ActionTitlesTitle>AVATDummy Rewards</ActionTitlesTitle>
          <ActionTitlesBalance balance={(earnings || BIG_ZERO).toNumber()}>{displayBalance}</ActionTitlesBalance>
        </RewardsTitleStyled>
        <ActionContentStyled disabled={disabled}>
          <LongButton
            variant="primary"
            disabled={disabled}
            onClick={async () => {
              setPendingTx(true);
              try {
                await onReward();
                toastSuccess(
                  `${t('Harvested')}!`,
                  t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'KAC' }),
                );
              } catch (e) {
                toastError(
                  t('Error'),
                  t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
                );
                console.error(e);
              } finally {
                setPendingTx(false);
              }
              dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }));
            }}
          >
            {!disabled ? 'Claim' : t('Harvest')}
          </LongButton>
        </ActionContentStyled>
      </FlexStyled>
    </ActionContainer>
  );
};

export default HarvestAction;
