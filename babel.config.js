/*
  Babel Configuration for React Native with Expo

  This is a Babel configuration file used for setting up the Babel compiler in a React Native project using Expo. 
  The configuration enables the necessary presets and plugins for the project to work seamlessly.

  Key Features:
  - **babel-preset-expo**: This preset configures Babel to work with Expo, providing the required settings 
    for transforming JavaScript code in a React Native environment.
  - **react-native-reanimated/plugin**: This plugin is specifically for enabling support for 
    the `react-native-reanimated` library. Reanimated is a popular library for building complex animations 
    in React Native, and this plugin ensures that Reanimated works smoothly by enabling its features in the 
    Babel transformation process.

  Functions:
  - **api.cache(true)**: Caches the configuration to optimize performance during development by preventing unnecessary 
    re-compilation of the Babel configuration.
  - **presets**: Defines an array of presets to use for transpiling the code. In this case, it uses the `babel-preset-expo` 
    preset which is tailored for Expo projects.
  - **plugins**: An array of plugins to be applied during the transpilation process. In this case, it includes the 
    `react-native-reanimated/plugin` which enables Babel to handle the special syntax and features of `react-native-reanimated`.

  Purpose:
  This configuration ensures that the project uses Expo’s preset for development, along with the necessary plugin 
  to support the `react-native-reanimated` library.
*/
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],  // Enabling Expo preset for React Native project
    plugins: ['react-native-reanimated/plugin'],  // Adding Reanimated plugin for animations
  };
};
