import * as React from 'react';
import { SVGProps } from 'react';
const MessageIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <path
      fill="#637381"
      fillRule="evenodd"
      d="M18 14a8 8 0 0 1-11.45 7.22 1.671 1.671 0 0 0-1.15-.13l-1.227.329a1.3 1.3 0 0 1-1.591-1.592L2.91 18.6a1.67 1.67 0 0 0-.13-1.15A8 8 0 1 1 18 14ZM6.5 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm3.5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm3.5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      clipRule="evenodd"
    />
    <path
      fill="#637381"
      d="M17.984 14.508c.108-.044.214-.092.32-.142.29-.14.622-.189.934-.105l.996.267a1.056 1.056 0 0 0 1.293-1.294l-.266-.996a1.357 1.357 0 0 1 .105-.935A6.5 6.5 0 1 0 9.491 6.016a8 8 0 0 1 8.493 8.492Z"
      opacity={0.6}
    />
  </svg>
);
export default MessageIcon;
