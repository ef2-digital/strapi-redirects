"use strict";
/**
 *  service
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const utils_1 = require("@strapi/utils");
const fetch = require("node-fetch");
function getPluginStore() {
    return strapi.store({
        environment: "",
        type: "plugin",
        name: "todo",
    });
}
async function createDefaultConfig() {
    const pluginStore = getPluginStore();
    const value = {
        webhook: "https://example.com/webhook",
    };
    await pluginStore.set({ key: "settings", value });
    return pluginStore.get({ key: "settings" });
}
exports.default = strapi_1.factories.createCoreService("plugin::redirects.redirect", ({ strapi }) => ({
    async dashboard(params) {
        params = Object.assign({ ...params }, { populate: "*", sort: "id:desc" });
        let { results, pagination } = await super.find(params);
        results = results.map((result) => {
            return {
                id: result.id,
                attributes: (({ id, ...object }) => object)(result),
            };
        });
        return { results, pagination };
    },
    async upsert(id, data) {
        if (id) {
            await super.update({ id }, data);
        }
        else {
            await super.create({ data: data });
        }
    },
    async getSettings() {
        const pluginStore = getPluginStore();
        let config = await pluginStore.get({ key: "settings" });
        if (!config) {
            config = await createDefaultConfig();
        }
        return config;
    },
    async setSettings(settings) {
        const value = settings;
        const pluginStore = getPluginStore();
        await pluginStore.set({ key: "settings", value });
        return pluginStore.get({ key: "settings" });
    },
    async checkDeploy(time) {
        const { ApplicationError } = utils_1.errors;
        const pluginStore = getPluginStore();
        let settings = await pluginStore.get({ key: "settings" });
        const { token, team, projectId, deploymentUrl, branch } = settings === null || settings === void 0 ? void 0 : settings.data;
        const status = await this.deploy(token, team, projectId, branch, "from", time);
        if (status === "BUILDING") {
            throw new ApplicationError("Please wait for the current deployment to finish");
        }
        return status;
    },
    async deploy(token, team, projectId, branch, filter, time) {
        const url = `https://api.vercel.com/v6/deployments?projectId=${projectId}&teamId=${team}&meta-deployHookRef=${branch}&limit=1&${filter}=${time}`;
        const headers = new fetch.Headers({
            Authorization: `Bearer ${token}`,
        });
        const deploysJson = await fetch(url, {
            method: "get",
            mode: "cors",
            headers,
        }).then((res) => res.json());
        const deploy = deploysJson === null || deploysJson === void 0 ? void 0 : deploysJson.deployments;
        if (deploy.length > 0) {
            return deploy[0].state;
        }
        return false;
    },
    async trigger() {
        const pluginStore = getPluginStore();
        let settings = await pluginStore.get({ key: "settings" });
        const { token, team, projectId, deploymentUrl, branch } = settings === null || settings === void 0 ? void 0 : settings.data;
        const jobJson = await fetch(deploymentUrl, {
            method: "post",
            mode: "cors",
        }).then((res) => res.json());
        const job = jobJson.job;
        const jobTime = job.createdAt;
        return new Promise((resolve, reject) => {
            const intervalId = setInterval(async () => {
                const status = await this.deploy(token, team, projectId, branch, "since", jobTime);
                if (status !== "BUILDING") {
                    clearInterval(intervalId);
                    resolve(status);
                }
            }, 5000);
        });
    },
}));
