const path = require("path");

const alias = {
    "tea": path.join(__dirname, "./src/tea"),
    "cn": path.join(__dirname, "./src/common"),
    "app": path.join(__dirname, "./src/app"),
}


if (process.env.debug == "local") {
    module.exports = {
        pages: {
            index: {
                entry: path.join(__dirname, "./playground/local/main.js"),
            }
        },
        configureWebpack: {
            resolve: {
                alias,
            }
        }
    }
}
else if (process.env.debug == "remote") {
    module.exports = {
        pages: {
            index: {
                entry: path.join(__dirname, "./playground/remote/main.js"),
            }
        },
        configureWebpack: {
            resolve: {
                alias,
            }
        }
    }
}
else {
    module.exports = {
        configureWebpack: {
            resolve: {
                alias,
            }
        }
    };
}
