import { useEffect, useRef } from "react";

export interface UsePreviousResult<T> {
  previousValue: T | undefined;
}

export function usePrevious<T>(value: T): UsePreviousResult<T> {
  const previousValueRef = useRef<T | undefined>(undefined);

  useEffect(() => {
    previousValueRef.current = value;
  }, [value]);

  return { previousValue: previousValueRef.current };
}
