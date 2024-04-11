//@ts-nocheck
/**
 *  controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "plugin::redirects.redirect",
  ({ strapi }) => ({
    async dashboard(ctx, next) {
      const sanitizedQuery = await this.sanitizeQuery(ctx);

      const data = await strapi
        .service("plugin::redirects.redirect")!
        .dashboard(sanitizedQuery);

      return { data: data.results, meta: data.pagination };
    },

    async upsert(ctx, next) {
      const sanitizedQuery = await this.sanitizeQuery(ctx);
      const { source, destination } = ctx.request.body.data;

      if (!source.startsWith("/") || !destination.startsWith("/")) {
        return {
          data: {},
          error:
            "Source and Destination both need to start with an '/' character.",
        };
      }

      const entry = (await strapi.entityService.findMany(
        "plugin::redirects.redirect",
        { filters: { source, destination } }
      )) as Array<any>;

      if (entry.length > 0) {
        return { data: {}, error: "Entry already exists" };
      }

      await strapi
        .service("plugin::redirects.redirect")!
        .upsert(sanitizedQuery.id ?? undefined, ctx.request.body.data);

      const data = await strapi
        .service("plugin::redirects.redirect")!
        .dashboard(sanitizedQuery);

      return { data: data.results, meta: data.pagination };
    },

    async checkDeploy(ctx) {
      const sanitizedQuery = await this.sanitizeQuery(ctx);

      try {
        return {
          status: await strapi
            .plugin("redirects")
            .service("redirect")
            .checkDeploy(sanitizedQuery.time),
        };
      } catch (err) {
        ctx.throw(500, err);
      }
    },

    async trigger(ctx) {
      try {
        return {
          status: await strapi
            .plugin("redirects")
            .service("redirect")
            .trigger(),
        };
      } catch (err) {
        ctx.throw(500, err);
      }
    },
    async getSettings(ctx) {
      try {
        ctx.body = await strapi
          .plugin("redirects")
          .service("redirect")
          .getSettings();
      } catch (err) {
        ctx.throw(500, err);
      }
    },
    async setSettings(ctx) {
      const { body } = ctx.request;

      try {
        await strapi.plugin("redirects").service("redirect").setSettings(body);

        ctx.body = await strapi
          .plugin("redirects")
          .service("redirect")
          .getSettings();
      } catch (err) {
        ctx.throw(500, err);
      }
    },
  })
);
