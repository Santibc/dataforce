import * as React from 'react';
import { SVGProps } from 'react';
const ClipboardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <path
      fill="#637381"
      fillRule="evenodd"
      d="M15.5 2h-7A1.5 1.5 0 0 0 7 3.5v1A1.5 1.5 0 0 0 8.5 6h7A1.5 1.5 0 0 0 17 4.5v-1A1.5 1.5 0 0 0 15.5 2Z"
      clipRule="evenodd"
    />
    <path
      fill="#637381"
      d="M17 4.5A2.5 2.5 0 0 1 14.5 7h-5A2.5 2.5 0 0 1 7 4.5H6a2 2 0 0 0-2 2V19a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V6.5a2 2 0 0 0-2-2h-1Z"
      opacity={0.32}
    />
    <path
      fill="#637381"
      fillRule="evenodd"
      d="M8 12a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm0 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Z"
      clipRule="evenodd"
    />
  </svg>
);
export default ClipboardIcon;
