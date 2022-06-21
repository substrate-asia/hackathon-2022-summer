import React from 'react';
import { SvgProps } from './types';

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <svg {...props}>
      <path
        fillRule="evenodd"
        fill="rgba(31, 37, 42,0)"
        d="M14.000,0.000 C21.732,0.000 24.000,6.268 24.000,14.000 C28.000,21.732 21.732,24.000 14.000,24.000 C6.268,28.000 0.000,21.732 0.000,14.000 C0.000,6.268 6.268,0.000 14.000,0.000 Z"
      />
      <path
        fillRule="evenodd"
        d="M21.000,9.411 C20.469,9.663 19.938,9.814 19.358,9.864 C19.938,9.511 20.420,8.907 20.614,8.200 C20.083,8.554 19.455,8.806 18.779,8.957 C18.248,8.352 17.523,7.999 16.703,7.999 C15.110,7.999 13.854,9.360 13.854,11.023 C13.854,11.275 13.902,11.477 13.951,11.730 C11.488,11.578 9.412,10.368 7.964,8.554 C7.722,9.007 7.577,9.511 7.577,10.066 C7.577,11.124 8.108,12.032 8.833,12.586 C8.350,12.586 7.915,12.435 7.528,12.183 L7.528,12.233 C7.528,13.696 8.543,14.905 9.846,15.208 C9.605,15.258 9.364,15.308 9.073,15.308 C8.881,15.308 8.688,15.308 8.543,15.258 C8.929,16.468 9.991,17.325 11.247,17.375 C10.281,18.182 9.026,18.686 7.674,18.686 C7.432,18.686 7.191,18.686 6.997,18.636 C8.253,19.493 9.798,19.997 11.391,19.997 C16.703,19.997 19.552,15.359 19.552,11.376 L19.552,10.973 C20.130,10.570 20.614,10.015 21.000,9.411 L21.000,9.411 Z"
      />
    </svg>
  );
};

export default Icon;