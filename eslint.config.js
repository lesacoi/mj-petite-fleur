// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
    {
        files: ["src/**/*.js", "src/**/*.ts"],
        ignores: ["**/parser/*"],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.strictTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
            eslintConfigPrettier,
        ],
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/restrict-template-expressions": "off",
            "@typescript-eslint/consistent-type-definitions": "off",
            "@typescript-eslint/no-unnecessary-type-assertion": "off",
            "@typescript-eslint/no-misused-promises": [
                "error",
                {
                "checksVoidReturn": {
                    "arguments": false
                }
                }
            ]
        }
    },
);