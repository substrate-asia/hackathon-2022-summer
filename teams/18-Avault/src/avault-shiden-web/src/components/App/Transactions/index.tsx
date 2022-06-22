import React from 'react';
import { Button, useModal } from '@my/ui';
import TransactionsModal from './TransactionsModal';
import HistorySvg from '../../svg/history.svg';

const Transactions = () => {
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />);
  return (
    <>
      <Button variant="text" p={0} onClick={onPresentTransactionsModal} height={0}>
        <img src={HistorySvg} alt="" />
      </Button>
    </>
  );
};

export default Transactions;
