require('ignore-styles')

require('@babel/register')({
  ignore: [/(node_modules)/],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '10',
        },
      },
    ],
    '@babel/preset-react',
  ],
})



process.env.NODE_ENV === 'production' ? require('../dist/server') : require('./server.js')
