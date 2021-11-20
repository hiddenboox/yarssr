export default (api, options, env) => {
    const isDevelopment = env === "development";

    return {
        "presets": [
            [
                "@babel/preset-env",
                {
                    "modules": "auto"
                }
            ],
            ["@babel/preset-react", {
                "runtime": "automatic"
            }]
        ],
        "plugins": [
            "@emotion",
            isDevelopment && ["react-hot-loader/babel"]
        ].filter(Boolean)
    }
}