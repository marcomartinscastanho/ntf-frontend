import { useState } from "react";
import { LocalStorage } from "../services/local-storage";

export const usePersistState = <T>(storageKey: string, initialState?: T) => {
  const [state, setInternalState] = useState<T | undefined>(LocalStorage.get(storageKey) ?? initialState);

  const setState = (newState: T | undefined) => {
    if (!!newState) {
      LocalStorage.set(storageKey, newState);
    } else {
      LocalStorage.remove(storageKey);
    }
    setInternalState(newState);
  };

  return [state, setState] as const;
};

export default usePersistState;
