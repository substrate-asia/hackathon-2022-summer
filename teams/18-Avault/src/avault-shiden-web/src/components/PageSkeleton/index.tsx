import React, { FC, useState } from 'react';
import styled from 'styled-components';
import LogoPng from './imgs/logo.png';

const PageSkeleton: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <div className="logo">
        <img src={LogoPng} alt="" />
      </div>
    </div>
  );
};

export default styled(PageSkeleton)`
  position: fixed;
  width: 100px;
  left: 0px;
  top: 0px;
  bottom: 0px;
  background: linear-gradient(0deg, #114228, #40f2f4);
  opacity: 0.1;
`;
