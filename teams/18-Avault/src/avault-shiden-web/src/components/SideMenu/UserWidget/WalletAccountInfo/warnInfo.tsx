import React from 'react';
import { useTooltip, Box, BoxProps } from '@my/ui';
import styled from 'styled-components';
import WarnSvg from './img/icon_warn.svg';

interface Props extends BoxProps {
  text: string | React.ReactNode;
}

const WarnInfoWrapper = styled.div`
  :hover,
  :focus {
    opacity: 0.7;
  }
`;

const WarnInfo: React.FC<Props> = ({ text, ...props }) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(text, {
    tootipStyle: { background: '#20272c', fontSize: '12px', color: '#f0842b', textAlign: 'center', overflow: 'hidden' },
    placement: 'top-end',
    hideArrow: true,
    tooltipOffset: [20, 10],
    trigger: 'hover',
  });

  return (
    <Box {...props} width="20px" height="20px">
      {tooltipVisible && tooltip}
      <WarnInfoWrapper ref={targetRef}>
        <img src={WarnSvg} alt="" />
      </WarnInfoWrapper>
    </Box>
  );
};

export default WarnInfo;
