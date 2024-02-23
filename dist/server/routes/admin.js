"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: "admin",
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
