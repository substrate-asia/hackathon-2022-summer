import React, { FC } from 'react';
import styled from 'styled-components';
import { Text } from '@my/ui';
import NoHavePng from './nohave.png';

const NoList: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <img src={NoHavePng} alt="" />
      <Text fontSize="12px" mb={{ xs: '16px', md: '20px' }} mt={{ xs: '10px', md: '15px' }} textAlign="center">
        There's nothing here.
      </Text>
    </div>
  );
};

export default styled(NoList)`
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
