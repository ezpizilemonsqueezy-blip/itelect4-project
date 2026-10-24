import { useState } from "react";

export interface UseToggleResult {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
}

export function useToggle(initialValue: boolean): UseToggleResult {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = (): void => {
    setValue((currentValue) => !currentValue);
  };

  const setTrue = (): void => {
    setValue(true);
  };

  const setFalse = (): void => {
    setValue(false);
  };

  return { value, toggle, setTrue, setFalse };
}
