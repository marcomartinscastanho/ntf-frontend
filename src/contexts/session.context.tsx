import React, { createContext, FC, PropsWithChildren, useContext } from "react";
import { usePersistState } from "../utils/use-persist-state";

interface ISessionContext {
  ntToken: string | undefined;
  backendAccessToken: string | undefined;
  backendRefreshToken: string | undefined;
  setNtToken: (st: string) => void;
  setBackendAccessToken: (st: string) => void;
  setBackendRefreshToken: (st: string) => void;
  clearNtToken: () => void;
  clearBackendAccessToken: () => void;
  clearBackendRefreshToken: () => void;
}

export const SessionContext = createContext<ISessionContext>({} as ISessionContext);

export const SessionProvider: FC<PropsWithChildren> = ({ children }) => {
  const [ntToken, setNtToken] = usePersistState<string>("ntToken");
  const [backendAccessToken, setBackendAccessToken] = usePersistState<string>("backendAccessToken");
  const [backendRefreshToken, setBackendRefreshToken] = usePersistState<string>("backendRefreshToken");

  const clearNtToken = () => setNtToken(undefined);
  const clearBackendAccessToken = () => setBackendAccessToken(undefined);
  const clearBackendRefreshToken = () => setBackendRefreshToken(undefined);

  const value = {
    ntToken,
    backendAccessToken,
    backendRefreshToken,
    setNtToken,
    setBackendAccessToken,
    setBackendRefreshToken,
    clearNtToken,
    clearBackendAccessToken,
    clearBackendRefreshToken,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => useContext(SessionContext);
