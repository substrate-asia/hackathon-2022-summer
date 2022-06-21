import React from 'react';
import { FC } from "react";

type Props = {
  width: number
  height: number
};

const LogoSVG: FC<Props> = ({width, height}) => {

  return (
    <svg width={width} height={height} viewBox="0 0 64 47" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16.5111" y="6.20923" width="11.1517" height="32.274" transform="rotate(25 16.5111 6.20923)" fill="#0CCCCC" />
      <ellipse cx="7.87364" cy="37.9259" rx="5.57583" ry="6.6732" transform="rotate(25 7.87364 37.9259)" fill="#0CCCCC" />
      <ellipse cx="21.5133" cy="8.67566" rx="5.57583" ry="6.6732" transform="rotate(25 21.5133 8.67566)" fill="#0CCCCC" />
      <rect x="17.5119" y="10.8538" width="11.1517" height="32.274" transform="rotate(-25 17.5119 10.8538)" fill="#32587E" />
      <ellipse cx="36.2562" cy="37.8573" rx="5.57583" ry="6.6732" transform="rotate(-25 36.2562 37.8573)" fill="#32587E" />
      <ellipse cx="22.6166" cy="8.6073" rx="5.57583" ry="6.6732" transform="rotate(-25 22.6166 8.6073)" fill="#32587E" />
      <rect x="37.3821" y="10.6509" width="11.1517" height="32.274" transform="rotate(-25 37.3821 10.6509)" fill="#0CCCCC" />
      <ellipse cx="56.1264" cy="37.6547" rx="5.57583" ry="6.6732" transform="rotate(-25 56.1264 37.6547)" fill="#0CCCCC" />
      <ellipse cx="42.4869" cy="8.40442" rx="5.57583" ry="6.6732" transform="rotate(-25 42.4869 8.40442)" fill="#0CCCCC" />
    </svg>)

};


export default LogoSVG