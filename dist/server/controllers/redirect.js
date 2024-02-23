"use strict";
/**
 *  controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController("plugin::redirects.redirect", ({ strapi }) => ({
    async dashboard(ctx, next) {
        const sanitizedQuery = await this.sanitizeQuery(ctx);
        const data = await strapi
            .service("plugin::redirects.redirect")
            .dashboard(sanitizedQuery);
        return { data: data.results, meta: data.pagination };
    },
    async upsert(ctx, next) {
        var _a;
        const sanitizedQuery = await this.sanitizeQuery(ctx);
        const { source, destination } = ctx.request.body.data;
        const entry = (await strapi.entityService.findMany("plugin::redirects.redirect", { filters: { source, destination } }));
        if (entry.length > 0) {
            return { data: {}, error: "Entry already exists" };
        }
        await strapi
            .service("plugin::redirects.redirect")
            .upsert((_a = sanitizedQuery.id) !== null && _a !== void 0 ? _a : undefined, ctx.request.body.data);
        const data = await strapi
            .service("plugin::redirects.redirect")
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
        }
        catch (err) {
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
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async getSettings(ctx) {
        try {
            ctx.body = await strapi
                .plugin("redirects")
                .service("redirect")
                .getSettings();
        }
        catch (err) {
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
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
}));
