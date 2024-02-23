import fetchInstance from "../utils/fetch";
import { Response } from "../utils/types";

const redirectRequest = {
  get: async (): Promise<Response> => {
    const data = await fetchInstance(`api/redirects`, "GET");

    return data.json();
  },

  upsert: async (id?: number, formData?: object): Promise<Response> => {
    const data = await fetchInstance(
      `api/redirects${id ? id : ""}`,
      "POST",
      null,
      formData
    );

    return data.json();
  },

  delete: async (id: number): Promise<any> => {
    await fetchInstance(`api/redirects/${id}`, "DELETE", null);

    const data = redirectRequest.get();

    return data;
  },

  getSettings: async () => {
    const data = await fetchInstance(`redirects/settings`, "GET");

    return data.json();
  },
  setSettings: async (data: any) => {
    const response = await fetchInstance(
      `redirects/settings`,
      "POST",
      null,
      data
    );

    return response.json();
  },

  checkDeploy: async (time: number) => {
    const data = await fetchInstance(
      `api/redirects/checkDeploy?time=${time}`,
      "GET"
    );

    return data.json();
  },

  trigger: async () => {
    return await fetchInstance(`api/redirects/trigger`, "GET").then(
      (response) => {
        return response;
      }
    );
  },
};

export default redirectRequest;
