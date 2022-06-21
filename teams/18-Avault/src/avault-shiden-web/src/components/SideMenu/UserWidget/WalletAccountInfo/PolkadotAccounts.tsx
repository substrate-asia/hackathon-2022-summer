import React, { FC, useState } from 'react';
import styled from 'styled-components';
import AccountEVM from './AccountEVM';
import PolkadotNoAccount from './PolkadotNoAccount';
import PolkadoAccountInfo from './PolkadoAccountInfo';
import PolkadotLearnMore from './PolkadotLearnMore';
type Phase = 'none' | 'setup' | 'shop' | 'battle' | 'result';

const PolkadotAccount_TSX: FC<{ className?: string }> = ({ className }) => {
  const [phase, setPhase] = useState<Phase>(
    (window.localStorage.getItem('PolkadotAccount_TSX_phase') as Phase) || 'none',
  );
  const connectWallet = () => {
    setPhase('setup');
    window.localStorage.setItem('PolkadotAccount_TSX_phase', 'setup');
  };

  if (phase === 'setup') {
    return (
      <div className={className}>
        <p className="text">Bind Shiden address</p>
        <PolkadoAccountInfo />
      </div>
    );
  }
  return (
    <div className={className}>
      <p className="text">Bind Shiden address</p>
      <PolkadotNoAccount connectWallet={connectWallet} />
    </div>
  );
};
const PolkadotAccount = styled(PolkadotAccount_TSX)`
  .text {
    font-size: 14px;
    font-weight: 500;
    color: #9da6a6;
    margin-bottom: 12px;
    margin-top: 20px;
    padding: 0 30px;
  }
`;

const PolkadotAccounts: React.ReactNode = (
  <>
    <AccountEVM />
    <PolkadotAccount />
    <PolkadotLearnMore />
  </>
);

export default PolkadotAccounts;
