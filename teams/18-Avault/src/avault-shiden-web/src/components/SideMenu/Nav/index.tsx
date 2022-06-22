import React, { FC } from 'react';
import { menuItemsDefault } from '../config';
import SmallNav from './SmallNav';
import BigNav from './BigNav';
const Nav: FC<{ collapsed: boolean }> = ({ collapsed }) => {
  return collapsed ? <SmallNav menuItems={menuItemsDefault} /> : <BigNav menuItems={menuItemsDefault} />;
};
export default Nav;
