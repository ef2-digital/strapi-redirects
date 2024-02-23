import * as React from "react";
import { createContext, useReducer } from "react";
import { RedirectActions, redirectReducer } from "./redirectReducer";

export interface RedirectContextInterface {
  redirects: {
    attributes: { source: string; destination: string; createdAt: string };
    id: number;
  }[];
}

const initialState = {
  redirects: [],
};

const RedirectContext = createContext<{
  state: RedirectContextInterface;
  dispatch: React.Dispatch<RedirectActions>;
}>({
  state: initialState,
  dispatch: () => null,
});

const RedirectProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(redirectReducer, initialState);

  return (
    <RedirectContext.Provider value={{ state, dispatch }}>
      {children}
    </RedirectContext.Provider>
  );
};

export { RedirectContext, RedirectProvider };
