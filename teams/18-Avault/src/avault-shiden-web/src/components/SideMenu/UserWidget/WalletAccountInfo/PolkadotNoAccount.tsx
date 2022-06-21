import React, { FC } from 'react';
import styled from 'styled-components';
import { Button } from '@my/ui';
const PolkadotNoAccount_TSX: FC<{ className?: string; connectWallet: () => void }> = ({ className, connectWallet }) => {
  return (
    <div className={className}>
      <Button onClick={connectWallet}>Connect Wallet</Button>
    </div>
  );
};

const PolkadotNoAccount = styled(PolkadotNoAccount_TSX)`
  padding: 0 30px 20px;
  button {
    width: 100%;
    border-radius: 16px;
  }
`;
export default PolkadotNoAccount;
