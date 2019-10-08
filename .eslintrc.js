module.exports = {
    root: true,
    env: {
        node: true
    },
    // extends: ['plugin:vue/essential', '@vue/standard', '@vue/prettier'],
    extends: ['plugin:vue/essential', '@vue/standard'],
    rules: {
        // 'prettier/prettier': [
        //     'error',
        //     {
        //         singleQuote: true,
        //         trailingComma: 'none',
        //         bracketSpacing: true,
        //         jsxBracketSameLine: true,
        //         semi: false,
        //         tabWidth: 4
        //     }
        // ],
        // 'prettier/prettier': 'error',
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // allow async-await
        'generator-star-spacing': 'off',
        // indentSize === 4
        indent: ['error', 4, { SwitchCase: 1 }],
        // disallow a space before function parenthesis
        'space-before-function-paren': [
            'error',
            {
                anonymous: 'always',
                named: 'never',
                asyncArrow: 'always'
            }
        ]
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
