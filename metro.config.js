// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add '.cjs' to source extensions for compatibility
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

module.exports = config;
