module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["react"],
  rules: {
    "react/prop-types": "off",
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
};
