import { resolve } from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import packageJson from "../package.json";
import glob from "fast-glob";

const __dirname = fileURLToPath(import.meta.url);
const sourceDir = resolve(__dirname, "../../");
const targetDir = resolve(__dirname, "../../dist");
const entryFileName = packageJson.entryFileName;

const buildHtml = async () => {
  //获取文件目录(lib和es一样)
  const htmlFils = await glob("index.html", {
    cwd: sourceDir,
    onlyFiles: true,
  });

  for (let path in htmlFils) {
    const sourceFilePath = `${sourceDir}/${htmlFils[path]}`;
    let htmlCode = await fs.readFile(sourceFilePath, "utf-8");
    htmlCode = htmlCode
      .replace(
        '<script type="module">',
        `<link rel="stylesheet" type="text/css" href="./style/mobile-select.css" />
          <script type="text/javascript" src="./mobile-select.iife.js"></script>
          <script type="text/javascript">`
      )
      .replace(
        '<link rel="stylesheet" type="text/css" href="/src/style/demo.css"/>',
        '<link rel="stylesheet" type="text/css" href="./style/demo.css"/>'
      )
      .replace(`import MobileSelect from "/src/${entryFileName}";`, "");
    // TODO format 格式化
    await fs.writeFile(resolve(targetDir, "demo.html"), htmlCode);
  }
};
buildHtml();
