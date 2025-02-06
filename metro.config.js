// // Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { 
    input: "./global.css" 
});

// const config = getDefaultConfig(__dirname);
// const { transformer, resolver } = config;
// // Add nativewind configuration
// const nativeWindConfig = withNativeWind(config, {
//   input: "./global.css", // Specify your global CSS file for NativeWind
// });
// // Add custom resolver for `.css` files
// nativeWindConfig.resolver.sourceExts = [
//   ...nativeWindConfig.resolver.sourceExts, 
//   "css"
// ];

// // Add react-native-svg-transformer configuration
// nativeWindConfig.transformer = {
//     ...transformer,
//     babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
// };
  
// nativeWindConfig.resolver = {
//     ...resolver,
//     assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
//     sourceExts: [...resolver.sourceExts, "svg"],
// };
// module.exports = nativeWindConfig;