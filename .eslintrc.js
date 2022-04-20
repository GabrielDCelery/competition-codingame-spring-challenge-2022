module.exports = {
    parser: '@typescript-eslint/parser',
    env: {
        node: true,
        es6: true,
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:unicorn/recommended',
        'plugin:promise/recommended',
        'prettier',
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier', 'unicorn', 'promise', 'import'],
    rules: {
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            typescript: {},
        },
    },
};