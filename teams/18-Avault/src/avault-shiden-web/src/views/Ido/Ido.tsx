import { Flex } from '@my/ui';
import Page from 'components/Layout/Page';
import { chainId } from 'config/constants/tokens';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { Dispatch, useCallback, useMemo } from 'react';
import { useAppDispatch } from 'state';
import { updateState } from 'views/Ido/state/ido/state';
import { useIdoData, useInitIdo } from 'views/Ido/state/ido/hooks';
import { IIdoStateEnum } from 'views/Ido/state/ido/types';
import styled from 'styled-components';
import Contribution from './components/Contribution';
import IdoBanner from './components/IdoBanner';
import InfoContribution from './components/InfoContribution';
import PositionAbsoult from './components/PositionAbsoult';
import useToast from 'hooks/useToast';
const Ido = () => {
  const {
    idoState,
    maxASTRBalance,
    endTime,
    avatEstimatedPrice,
    apr,
    countedAstrAmount,
    rewards,
    lpTotalBalance,
    lpBalance,
    idoInAstrBalance,
    mainTokenPrice,
    startTime,
  } = useIdoData();
  const dispatch: Dispatch<any> = useAppDispatch();

  const { account, library } = useActiveWeb3React();
  const accountkey = useMemo(() => {
    return `${account}-${chainId}`;
  }, [account]);

  useInitIdo(account, library, dispatch, accountkey);
  const { toastSuccess, toastWarning, toastError } = useToast();

  const _maxASTRBalance = useMemo(() => {
    return maxASTRBalance[accountkey] || '0.00';
  }, [maxASTRBalance, accountkey]);
  const _lpBalance = useMemo(() => {
    return lpBalance[accountkey] || '0.00';
  }, [lpBalance, accountkey]);

  // useEffect(() => {
  //   if (dispatch && idoState) {
  //     if (idoState === IIdoStateEnum.INIT) {
  //       dispatch(updateStartTime());
  //     } else if (idoState === IIdoStateEnum.PROCING) {
  //       dispatch(updateEndTime());
  //     }
  //   }
  // }, [dispatch, idoState]);
  const changeIdoState = useCallback(
    (params: IIdoStateEnum) => {
      dispatch(
        updateState({
          idoState: params,
        }),
      );
    },
    [dispatch],
  );
  return (
    <PageStyled>
      <PositionAbsoult changeIdoState={changeIdoState} />
      {/* <IDOGlobalStyle /> */}
      <IdoBanner />
      <FlexStyled>
        {/* 12s  300block */}
        <Contribution
          accountkey={accountkey}
          dispatch={dispatch}
          nextEventTime={startTime}
          lpTotalBalance={lpTotalBalance}
          lpBalance={_lpBalance}
          maxASTRBalance={_maxASTRBalance}
          idoState={idoState}
          account={account}
          library={library}
          toastSuccess={toastSuccess}
          toastWarning={toastWarning}
          toastError={toastError}
        />
        <InfoContribution
          idoInAstrBalance={idoInAstrBalance}
          mainTokenPrice={mainTokenPrice}
          idoState={idoState}
          endTime={endTime}
          avatEstimatedPrice={avatEstimatedPrice}
          apr={apr}
          countedAstrAmount={countedAstrAmount}
          rewards={rewards}
          dispatch={dispatch}
          account={account}
          library={library}
          toastSuccess={toastSuccess}
          toastWarning={toastWarning}
          toastError={toastError}
          accountkey={accountkey}
        />
      </FlexStyled>
    </PageStyled>
  );
};
const PageStyled = styled(Page)`
  padding: 0 0 130px;
`;
const FlexStyled = styled(Flex)`
  align-items: start;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: column-reverse;

  background-image: url('./images/stake/bg_element.svg');
  background-size: 60%;
  background-repeat: no-repeat;
  background-position: right 20px;
  ${({ theme }) => theme.mediaQueries.md} {
    background-position: right center;
    background-size: 420px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
  & > div {
    width: 100%;
    ${({ theme }) => theme.mediaQueries.md} {
      width: 48%;
    }
    ${({ theme }) => theme.mediaQueries.lg} {
      width: 47%;
    }
  }
`;
export default Ido;
