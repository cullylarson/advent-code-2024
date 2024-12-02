import eslintConfigPrettier from "eslint-config-prettier";

export default [
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    rules: {
      indent: ["error", 2, { SwitchCase: 1 }],
      "space-before-function-paren": ["error", "never"],
      "keyword-spacing": "off",
      "brace-style": ["error", "stroustrup", { allowSingleLine: true }],
      "comma-dangle": ["error", "always-multiline"],
      "operator-linebreak": ["error", "before"],
      "object-curly-spacing": ["error", "always"],
      "space-before-function-paren": [
        "error",
        {
          anonymous: "never",
          named: "never",
          asyncArrow: "always",
        },
      ],
    },
  },
];
