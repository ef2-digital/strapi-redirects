export default {
  type: "content-api",
  routes: [
    {
      method: "GET",
      path: "/trigger",
      handler: "redirect.trigger",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/checkDeploy",
      handler: "redirect.checkDeploy",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/",
      handler: "redirect.find",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/",
      handler: "redirect.dashboard",
      config: {
        auth: false,
        policies: [],
      },
    },

    {
      method: "POST",
      path: "/",
      handler: "redirect.upsert",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/:id",
      handler: "redirect.delete",
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};
