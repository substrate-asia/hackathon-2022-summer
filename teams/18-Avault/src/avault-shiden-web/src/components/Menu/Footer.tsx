import React from 'react';
import styled from 'styled-components';
import { Flex } from '@my/ui';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    justify-content: space-between;
    flex-direction: row;
  }
`;
const Footer = () => {
  return (
    <Wrapper>
      <Flex flexDirection={['column', 'column', 'row']} alignItems="center" />
      <Flex
        flexGrow={1}
        alignItems="center"
        width={['100%', '100%', '100%', 'auto']}
        justifyContent={['center', 'center', 'center', 'flex-end']}
      />
    </Wrapper>
  );
};

export default Footer;
