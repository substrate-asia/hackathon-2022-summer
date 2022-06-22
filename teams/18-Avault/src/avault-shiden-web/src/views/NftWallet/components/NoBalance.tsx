import React, { FC } from 'react';
import styled from 'styled-components';
import { Button, Text } from '@my/ui';
import NoHavePng from '../img/nohave.png';
import { Link } from 'react-router-dom';

const NoBalance: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <img src={NoHavePng} alt="" />
      <Text fontSize="12px" mb={{ xs: '16px', md: '20px' }} mt={{ xs: '10px', md: '15px' }}>
        There's nothing here. Go look somewhere else
      </Text>
      <Link to="/nft/pools">
        <Button height="40px" maxWidth="220px" variant={'secondary'}>
          To NFT Markets
        </Button>
      </Link>
    </div>
  );
};

export default styled(NoBalance)`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  > .show {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 278px;
    img {
      height: 100%;
    }
  }
`;
