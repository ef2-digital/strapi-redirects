import { RedirectContextInterface } from "./useRedirect";

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum Types {
  Add = "ADD_REDIRECT",
  Remove = "REMOVE_REDIRECT",
  Edit = "EDIT_REDIRECT",
  Set = "SET_REDIRECTS",
}

export type RedirectActions =
  ActionMap<RedirectPayload>[keyof ActionMap<RedirectPayload>];

type RedirectPayload = {
  [Types.Edit]: {
    source: string;
    destination: string;
  };

  [Types.Add]: {
    source: string;
    destination: string;
  };

  [Types.Remove]: {
    id: number;
  };

  [Types.Set]: {
    redirects: {
      attributes: { source: string; destination: string; createdAt: string };
      id: number;
    }[];
  };
};

export const redirectReducer = (
  state: RedirectContextInterface,
  action: RedirectActions
) => {
  switch (action.type) {
    case Types.Set:
      state.redirects = action.payload.redirects;

      return { ...state };

    case Types.Edit:
    // const { title } = action.payload;

    // state.form.attributes.title = title;

    // return { ...state };
    case Types.Remove:

    default:
      return state;
  }
};
