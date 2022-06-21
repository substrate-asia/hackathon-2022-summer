import { SvgProps } from 'components/svg/types';
import React from 'react';

const DocLink: React.FC<SvgProps> = (props) => {
  return (
    <svg {...props}>
      <defs></defs>
      <g id="图层_2" data-name="图层 2">
        <g id="图层_1-2" data-name="图层 1">
          <path
            className="cls-1"
            d="M10.26.45A1.75,1.75,0,0,0,9.08,0H.89A1,1,0,0,0,0,1V15a1,1,0,0,0,.89,1H13.35a1,1,0,0,0,.9-1V4.82a1.78,1.78,0,0,0-.59-1.31ZM6.48,12.82H3.31a.8.8,0,0,1,0-1.6H6.48a.81.81,0,0,1,0,1.6ZM8.72,9.61H3.31a.8.8,0,0,1,0-1.6H8.72a.8.8,0,0,1,0,1.6Zm1.48-3.2H3.31a.77.77,0,0,1-.72-.81.76.76,0,0,1,.72-.8H10.2a.76.76,0,0,1,.71.8A.76.76,0,0,1,10.2,6.41Z"
          />
        </g>
      </g>
    </svg>
  );
};

export default DocLink;
