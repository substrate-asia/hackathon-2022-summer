import React, { FC } from 'react';
import styled from 'styled-components';
const PolkadotLearnMore_TSX: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <a
        href="https://baidu.medium.com/tutorial-signature-system-for-distributing-kac-reward-d4ec7c59c5c6"
        target="_blank"
        rel="noreferrer"
      >
        Learn More&gt;&gt;
      </a>
    </div>
  );
};

const PolkadotLearnMore = styled(PolkadotLearnMore_TSX)`
  a {
    display: block;
    text-align: center;
    font-weight: 500;
    color: #f1842c;
    font-size: 14px;
    margin-top: 10px;
    margin-bottom: 24px;
  }
`;
export default PolkadotLearnMore;
