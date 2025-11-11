<<<<<<< HEAD
=======
const path = require("path");
const fs = require("fs-extra");
>>>>>>> 189e5da (alterações feitas para o exe)
const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");

module.exports = {
  packagerConfig: {
    asar: true,
    executableName: "projeto-totem",
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
<<<<<<< HEAD
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
=======
>>>>>>> 189e5da (alterações feitas para o exe)
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
<<<<<<< HEAD
=======

  hooks: {
    packageAfterCopy: async (forgeConfig, buildPath) => {
      const src = path.resolve(__dirname, "dist"); 
      const dest = path.join(buildPath, "dist"); 
      if (await fs.pathExists(src)) {
        await fs.copy(src, dest);
      }
    },
  },
>>>>>>> 189e5da (alterações feitas para o exe)
};
