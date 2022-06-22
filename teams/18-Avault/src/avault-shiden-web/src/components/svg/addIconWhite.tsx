import { SvgProps } from 'components/svg/types';
import useTheme from 'hooks/useTheme';
import React from 'react';
const AddIconWhite: React.FC<SvgProps> = () => {
  const { theme } = useTheme();
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="49px" height="48px">
      <path
        fillRule="evenodd"
        fill={theme.colors.background}
        d="M12.920,0.0 L36.919,0.0 C43.547,0.0 48.920,5.372 48.920,12.0 L48.920,35.999 C48.920,42.627 43.547,48.0 36.919,48.0 L12.920,48.0 C6.292,48.0 0.920,42.627 0.920,35.999 L0.920,12.0 C0.920,5.372 6.292,0.0 12.920,0.0 Z"
      />
      <path
        fillRule="evenodd"
        fill={theme.colors.primary}
        d="M30.999,25.999 L26.999,25.999 L26.999,30.0 C26.999,31.104 26.104,31.999 24.999,31.999 C23.895,31.999 22.999,31.104 22.999,30.0 L22.999,25.999 L19.0,25.999 C17.895,25.999 17.0,25.104 17.0,23.999 C17.0,22.895 17.895,22.0 19.0,22.0 L22.999,22.0 L22.999,17.999 C22.999,16.895 23.895,15.999 24.999,15.999 C26.104,15.999 26.999,16.895 26.999,17.999 L26.999,22.0 L30.999,22.0 C32.104,22.0 33.0,22.895 33.0,23.999 C33.0,25.104 32.104,25.999 30.999,25.999 Z"
      />
    </svg>
  );
};
export default AddIconWhite;
