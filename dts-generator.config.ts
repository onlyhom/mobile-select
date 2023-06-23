// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require("./package.json");

const packageName = packageJson.name;
const entryFileName = packageJson.entryFileName;
const config = {
  entries: [
    {
      filePath: `src/${entryFileName}`,
      outFile: `dist/${packageName}.d.ts`,
      noCheck: false
    }
  ]
};

module.exports = config;
