import React from 'react';
import { SvgProps } from '@my/ui';
import styled from 'styled-components';
const IconMenuStyled = styled.div`
  --color: ${({ theme }) => theme.colors.text};
  width: 24px;
  height: 24px;
  padding: 0;
  margin: 0;
  outline: none;
  position: relative;
  border: none;
  background: none;
  cursor: pointer;
  -webkit-appearence: none;
  -webkit-tap-highlight-color: transparent;
  svg[data-v-5bf3ac00] {
    width: 48px;
    height: 36px;
    top: -6px;
    left: -14px;
    stroke: ${({ theme }) => theme.colors.text};
    stroke-width: 2px;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    display: block;
    position: absolute;
  }
  svg path[data-v-5bf3ac00] {
    -webkit-transition: stroke-dasharray var(--duration, 0.85s) var(--easing, ease) var(--delay, 0s),
      stroke-dashoffset var(--duration, 0.85s) var(--easing, ease) var(--delay, 0s);
    transition: stroke-dasharray var(--duration, 0.85s) var(--easing, ease) var(--delay, 0s),
      stroke-dashoffset var(--duration, 0.85s) var(--easing, ease) var(--delay, 0s);
    stroke-dasharray: var(--array-1, 26px) var(--array-2, 100px);
    stroke-dashoffset: var(--offset, 126px);
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
  vg path[data-v-5bf3ac00]:nth-child(2) {
    --duration: 0.7s;
    --easing: ease-in;
    --offset: 100px;
    --array-2: 74px;
  }
  svg path[data-v-5bf3ac00]:nth-child(3) {
    --offset: 133px;
    --array-2: 107px;
  }
  &.active svg path[data-v-5bf3ac00] {
    --offset: 57px;
  }
  &.active svg path[data-v-5bf3ac00]:first-child,
  &.active svg path[data-v-5bf3ac00]:nth-child(3) {
    --delay: 0.15s;
    --easing: cubic-bezier(0.2, 0.4, 0.2, 1.1);
  }
  &.active svg path[data-v-5bf3ac00]:nth-child(2) {
    --duration: 0.4s;
    --offset: 2px;
    --array-1: 1px;
  }
  &.active svg path[data-v-5bf3ac00]:nth-child(3) {
    --offset: 58px;
  }
`;
interface ISvgProps extends SvgProps {
  active: boolean;
}
const IconMenu: React.FC<ISvgProps> = ({ active }) => {
  return (
    <IconMenuStyled className={active ? 'active' : ''}>
      <svg data-v-5bf3ac00="" viewBox="0 0 64 48">
        <path data-v-5bf3ac00="" d="M19,15 L45,15 C70,15 58,-2 49.0177126,7 L19,37"></path>
        <path data-v-5bf3ac00="" d="M19,24 L45,24 C61.2371586,24 57,49 41,33 L32,24"></path>
        <path data-v-5bf3ac00="" d="M45,33 L19,33 C-8,33 6,-2 22,14 L45,37"></path>
      </svg>
    </IconMenuStyled>
    // <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className="design-iconfont">
    //   <g transform="translate(10 12)" fillRule="evenodd">
    //     <rect width="20" height="3" rx="1.5" />
    //     <rect y="7" width="20" height="3" rx="1.5" />
    //     <rect y="14" width="20" height="3" rx="1.5" />
    //   </g>
    // </svg>
  );
};

export default IconMenu;
