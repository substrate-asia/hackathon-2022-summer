import { SvgProps } from 'components/svg/types';
import useTheme from 'hooks/useTheme';
import React from 'react';
const MinusIconPrimary: React.FC<SvgProps> = () => {
  const { theme } = useTheme();
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="52px" height="51px">
      {/* <path
        fillRule="evenodd"
        stroke={theme.colors.primary}
        strokeWidth="2px"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        fill="none"
        d="M13.919,1.0 L37.919,1.0 C44.547,1.0 49.919,6.372 49.919,13.0 L49.919,36.999 C49.919,43.627 44.547,49.0 37.919,49.0 L13.919,49.0 C7.292,49.0 1.919,43.627 1.919,36.999 L1.919,13.0 C1.919,6.372 7.292,1.0 13.919,1.0 Z"
      /> */}
      <path
        fillRule="evenodd"
        fill={theme.colors.primary}
        d="M19.999,23.0 L32.0,23.0 C33.104,23.0 33.999,23.895 33.999,24.999 C33.999,26.104 33.104,26.999 32.0,26.999 L19.999,26.999 C18.895,26.999 17.999,26.104 17.999,24.999 C17.999,23.895 18.895,23.0 19.999,23.0 Z"
      />
    </svg>
  );
};
export default MinusIconPrimary;
