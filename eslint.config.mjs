import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            "no-undef": "warn",
            "no-console": "off",
            "@typescript-eslint/no-explicit-any": "error",
            "no-const-assign": "error",
            "@typescript-eslint/array-type": "error",
            "@typescript-eslint/consistent-type-assertions": "error",
            "@typescript-eslint/init-declarations": "error",
            "@typescript-eslint/no-confusing-non-null-assertion": "error",
            // "@typescript-eslint/typedef": [
            //     "warn",
            //     {
            //         variableDeclaration: true,
            //     },
            // ],
        },
    },
    {
        ignores: ["dist/*"],
    },
];
