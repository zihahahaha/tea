let local = [];

import { Demo } from "app";

local[0] = {
    app: {
        name: "demo",
        wndClass: {
            icon: "/demoicon.png",
        },
        id: "demo",
        view: Demo,
    },
    shortcut: {
        wndParam: {},
        id: "demo",
        shortcutIcon: "demoicon.png",
        shortcutTitle: "blog",
    },
}

export default local;