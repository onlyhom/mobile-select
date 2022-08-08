import { resolve } from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import packageJson from "../package.json";
import glob from "fast-glob";

const __dirname = fileURLToPath(import.meta.url);
const targetDir = resolve(__dirname, "../../dist");
const packageVersion = packageJson.version;

const addJSCommentBanner = async () => {
  const jsFils = await glob("*.js", {
    cwd: targetDir,
    onlyFiles: true,
  });

  //遍历含有less的目录
  for (let path in jsFils) {
    const sourceFilePath = `${targetDir}/${jsFils[path]}`;
    //获取less文件字符串
    let jsCode = await fs.readFile(sourceFilePath, "utf-8");
    jsCode = `/**
* mobile-select v${packageVersion}
* Homepage: https://github.com/onlyhom/mobile-select
* Released under the MIT License.
* (c) 2017-present
*/
` + jsCode;
    await fs.writeFile(sourceFilePath, jsCode);
  }
};
addJSCommentBanner();
