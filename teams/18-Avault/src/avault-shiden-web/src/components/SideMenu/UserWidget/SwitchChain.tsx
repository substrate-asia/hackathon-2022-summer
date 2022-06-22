import React from 'react';
import { Text, Flex, useTooltip, Heading } from '@my/ui';
import BscSvg from '../imgs/icon_bsc.svg';
import SelectedSvg from '../imgs/icon_select.svg';
import SdnSvg from '../imgs/icon_sd.png';
import SlSvg from '../imgs/icon_sl.svg';
import { chainKey } from 'config';
import styled from 'styled-components';
import { CHAINKEY } from '@my/sdk';

const FlexStyled = styled(Flex)`
  cursor: pointer;
  margin-bottom: 12px;
  padding: 14px 19px;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.background02};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`;
const SwitchChain = () => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(SwitchChainTooltip, {
    trigger: 'click',
    tootipStyle: { padding: '30px 34px 20px' },
    placement: 'top-end',
    hideArrow: false,
    tooltipOffset: [20, 10],
  });
  return (
    <>
      {tooltipVisible && tooltip}
      <Flex
        style={{ cursor: 'pointer', transition: 'all .3s ease' }}
        ref={targetRef}
        alignItems="center"
        height="40px"
        width="92px"
        justifyContent="space-between"
        padding="0px 12px"
      >
        {chainKey === CHAINKEY.SDN ? (
          <>
            <img style={{ width: '20px' }} src={SdnSvg} alt="" />
            <Text color="text" fontSize="14px" bold>
              SDN
            </Text>
          </>
        ) : (
          <>
            <img style={{ width: '20px' }} src={BscSvg} alt="" />
            <Text color="text" fontSize="14px" bold>
              BSC
            </Text>
          </>
        )}
        <img
          style={{ width: '9px', height: '5px', transform: tooltipVisible ? '' : 'scaleY(-1)' }}
          src={SlSvg}
          alt=""
        />
      </Flex>
    </>
  );
};

const SwitchChainTooltip = (
  <div>
    <Heading>Select a Network</Heading>
    <Text width="80%" fontSize="12px" bold mb="26px" mt="12px" color="textSubtle">
      You are currently browsing Avault on {chainKey} network
    </Text>
    <FlexStyled onClick={() => (window.location.href = 'https://www.kaco.finance/')}>
      <Flex alignItems="center">
        <img src={BscSvg} width="24px" alt="" />
        <Text color="primary" bold ml="21px">
          BSC
        </Text>
      </Flex>
      {chainKey === CHAINKEY.SDN ? null : <img src={SelectedSvg} style={{ width: '24px' }} alt="" />}
    </FlexStyled>

    <FlexStyled onClick={() => (window.location.href = 'https://shiden.kaco.finance/')}>
      <Flex alignItems="center">
        <img src={SdnSvg} width="24px" alt="" />
        <Text color="primary" bold ml="21px">
          SDN
        </Text>
      </Flex>
      {chainKey === CHAINKEY.SDN ? <img src={SelectedSvg} style={{ width: '24px' }} alt="" /> : null}
    </FlexStyled>
  </div>
);

export default SwitchChain;
