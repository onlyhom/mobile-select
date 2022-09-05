import { resolve } from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import packageJson from "../package.json" assert { type: "json" }; // Import assertions became required after v17.5.0 (related to this change:github.com/nodejs/node/pull/40785).
import glob from "fast-glob";

const __dirname = fileURLToPath(import.meta.url);
const targetDir = resolve(__dirname, "../../dist");
const packageVersion = packageJson.version;

const addCommentBanner = async () => {
  const files = await glob("**/mobile-select.*{js,css,d.ts}", {
    cwd: targetDir,
    onlyFiles: true,
  });

  for (let path in files) {
    const sourceFilePath = `${targetDir}/${files[path]}`;
    let jsCode = await fs.readFile(sourceFilePath, "utf-8");
    jsCode =
      `/*
* mobile-select v${packageVersion}
* Homepage: https://github.com/onlyhom/mobile-select
* Released under the MIT License.
* (c) 2017-present
*/
` + jsCode;
    await fs.writeFile(sourceFilePath, jsCode);
  }
};
addCommentBanner();
