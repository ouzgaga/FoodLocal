module.exports = {
  'extends': 'airbnb',
  'parser' : 'babel-eslint',
  'globals': {
    'fetch'    : false,
    'navigator': false
  },
  'rules'  : {
    "semi": [
      "error",
      "always"
    ],
    'linebreak-style': 'off',
    'react/prefer-stateless-function': 'off',
    'comma-dangle'                   : 'off',
    'space-before-function-paren'    : 'off',
    'key-spacing'                    : 'off',
    'max-len'                        : 'off',
    'no-plusplus'                    : 'off',
    'react/jsx-filename-extension'   : 'off',
    'no-return-assign'               : 'off',
    'no-undef'                       : 'off',
    'react/no-multi-comp'                  : 'off',
    'no-confusing-arrow': 'off',
  }

};
