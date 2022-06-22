// import getTimePeriods from 'utils/getTimePeriods';
import { AutoRenewIcon, Button, Flex } from '@my/ui';
import ConnectWalletButton from 'components/ConnectWalletButton';
import { useMemo } from 'react';
import { IGovernanceUserData, ILockAVATModalState, ILockedState } from 'views/Governance/state/governance/types';
import styled from 'styled-components';
import Countdown from './StakeComponents/Countdown';
import StakeBalance from './StakeComponents/Balance';
interface IProps {
  lockedState: ILockedState;
  userData: IGovernanceUserData;
  account: string;
  onClickModal: any;
  handleApprove: any;
  requestedApprovalPendingTx: boolean;
}
const Stake = ({ lockedState, userData, account, onClickModal, handleApprove, requestedApprovalPendingTx }: IProps) => {
  return useMemo(() => {
    const {
      veAVATBalanceDisplay = '0',
      AVATLockedDisplay = '-',
      withdrawalDateDisplay = '-',
      remainderBlock = 0,
      isApproved = false,
    } = userData || {};
    return (
      <div>
        <StakeStyled lockedState={lockedState}>
          <StakeBalance
            veAVATBalanceDisplay={veAVATBalanceDisplay}
            AVATLockedDisplay={AVATLockedDisplay}
            withdrawalDateDisplay={withdrawalDateDisplay}
          />
          {/* 12s  300block */}
          <Countdown nextEventTime={12 * remainderBlock} lockedState={lockedState} onClickModal={onClickModal} />
          {lockedState !== ILockedState.init ? (
            <FlexButton bottom="5">
              <Button
                disabled={lockedState === ILockedState.locked ? false : true}
                onClick={() => {
                  onClickModal(ILockAVATModalState.ADDAMOUNT);
                }}
              >
                Lock more
              </Button>
              <Button
                className="last-child"
                disabled={lockedState === ILockedState.withdraw ? false : true}
                variant="tertiary"
                onClick={() => {
                  onClickModal(ILockAVATModalState.WITHDRAW);
                }}
              >
                Withdraw
              </Button>
            </FlexButton>
          ) : account ? (
            isApproved ? (
              <LongButton
                onClick={() => {
                  onClickModal(ILockAVATModalState.INIT);
                }}
              >
                Create Lock
              </LongButton>
            ) : (
              <FlexButton bottom="8">
                <Button
                  isLoading={requestedApprovalPendingTx}
                  // endIcon={<AutoRenewIcon spin color="currentColor" /> }
                  endIcon={requestedApprovalPendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
                  onClick={() => {
                    handleApprove();
                  }}
                >
                  Approve
                </Button>
                <Button variant="secondary" disabled={true}>
                  Create Lock
                </Button>
              </FlexButton>
            )
          ) : (
            <ConnectWalletButtonStyle />
          )}
        </StakeStyled>
      </div>
    );
  }, [lockedState, handleApprove, userData, onClickModal, account, requestedApprovalPendingTx]);
};

const StakeStyled = styled.div<{ lockedState: ILockedState }>`
  position: relative;
  padding: 8% 5% 0;
  width: 100%;
  height: 100%;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 6% 5% 8%;
  }
`;
const LongButton = styled(Button)`
  width: 90%;
  border-radius: 12px;
  font-size: 18px;
  height: 60px;
  position: absolute;
  bottom: 7%;
  left: 5%;
`;
const ConnectWalletButtonStyle = styled(ConnectWalletButton)`
  width: 90%;
  border-radius: 12px;
  font-size: 18px;
  height: 60px;
  position: absolute;
  bottom: 7%;
  left: 5%;
  background-image: none;
  background-color: ${({ theme }) => theme.colors.primary};
`;
const FlexButton = styled(Flex)<{ bottom: string }>`
  width: 90%;
  position: absolute;
  bottom: ${({ bottom }) => bottom}%;
  left: 5%;
  align-items: center;
  justify-content: space-between;
  button {
    border-radius: 12px;
    font-size: 15px;
    width: 48%;
    height: 48px;
    &.last-child {
      &.pancake-button--disabled {
        background-color: #201f43;
      }
      background-color: transparent;
    }
  }
`;
export default Stake;
