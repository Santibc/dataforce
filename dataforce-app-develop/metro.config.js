const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure to handle Node.js built-in modules properly
config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    // Ignore Node.js built-in modules that start with 'node:'
    if (moduleName.startsWith('node:')) {
      return {
        type: 'empty',
      };
    }
    // Use default resolution for everything else
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;
