module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          react: '../../node_modules/react',
          'react-native': '../../node_modules/react-native',
        },
      },
    ],
  ],
};
