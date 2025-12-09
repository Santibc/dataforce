import { useLayoutEffect, useRef } from 'react';

export function useLatestRef<T>(args: T) {
  // const refs = args.map((cb) => useRef(cb));
  const argsRef = useRef(args);

  useLayoutEffect(() => {
    // deleteRef.current = onDelete;
    argsRef.current = args;
  });

  return argsRef.current;
}
