const {getDefaultConfig} = require('expo/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const config = getDefaultConfig(__dirname);

// Add SQL file support for Drizzle ORM
config.resolver.sourceExts.push('sql');

module.exports = wrapWithReanimatedMetroConfig(config);
