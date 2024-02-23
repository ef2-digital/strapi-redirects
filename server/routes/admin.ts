export default {
  type: "admin", // other type available: content-api.
  routes: [
    {
      method: "GET",
      path: "/settings",
      handler: "redirect.getSettings",
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/settings",
      handler: "redirect.setSettings",
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
