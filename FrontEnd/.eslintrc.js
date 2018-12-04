module.exports = {
  'extends': 'airbnb',
  'parser' : 'babel-eslint',
  'globals': {
    'fetch'    : false,
    'navigator': false
  },
  'rules'  : {
    'react/prefer-stateless-function': 'off',
    'comma-dangle'                   : 'off',
    'space-before-function-paren'    : 'off',
    'key-spacing'                    : 'off',
    'max-len'                        : 'off',
    'no-plusplus'                    : 'off'
  }

};
