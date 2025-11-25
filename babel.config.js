module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // NativeWind v4 uses metro.config.js, NOT babel plugin
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
