import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { Text } from '@my/ui';
import { NFTPathConfig, IMenuDetail } from '../config';
export const NftContentIn = () => {
  const { pathname } = useLocation();
  return (
    <>
      {NFTPathConfig.map((item: IMenuDetail, index) => (
        <NavLink
          to={item.link}
          key={index}
          onClick={() => {
            if (item.link.indexOf('https://') > -1) {
              window.open(item.link);
              return;
            }
          }}
          active={pathname.startsWith(item.link) ? 't' : 'f'}
        >
          <div className="icon-holder">{item.img()}</div>
          <div className="fr">
            <h3>{item.text}</h3>
            <DetailText>{item.detail}</DetailText>
          </div>
        </NavLink>
      ))}
    </>
  );
};
const DetailText = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 12px;
  font-weight: 500;
`;
const NavLink = styled(Link)<{ active: 't' | 'f' }>`
  width: 100%;
  display: flex;
  align-items: start;
  font-size: 16px;
  transition: all 0.3s ease;
  font-weight: 600;
  margin-right: 34px;
  padding: 10px 10px 12px;
  border-radius: 12px;
  margin-top: 10px;
  background-color: ${({ theme, active }) => (active === 't' ? theme.colors.cardBorder : theme.colors.cardBackground)};
  svg {
    width: 36px;
    height: 36px;
    margin-right: 12px;
    fill: ${({ theme, active }) => (active === 't' ? theme.colors.primary : theme.colors.text)};
  }
  h3 {
    padding: 4px 0;
    color: ${({ theme, active }) => (active === 't' ? theme.colors.primary : theme.colors.text)};
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.cardBorder};
    h3 {
      color: ${({ theme }) => theme.colors.primary};
    }
    svg {
      fill: ${({ theme }) => theme.colors.primary};
    }
  }
`;
const NftContent = (
  <>
    <NftContentIn />
  </>
);
export default NftContent;
