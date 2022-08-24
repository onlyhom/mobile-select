import cpy from "cpy";
import { resolve, dirname } from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import less from "less";
import glob from "fast-glob";

const __dirname = fileURLToPath(import.meta.url);
const sourceDir = resolve(__dirname, "../../src");
const targetDir = resolve(__dirname, "../../dist");
console.log(sourceDir);
const buildLess = async () => {
  await cpy(`${sourceDir}/**/*.less`, targetDir);

  //获取打包后.less文件目录(lib和es一样)
  const lessFils = await glob("**/*.less", { cwd: sourceDir, onlyFiles: true });

  //遍历含有less的目录
  for (let path in lessFils) {
    const filePath = `${sourceDir}/${lessFils[path]}`;
    //获取less文件字符串
    const lessCode = await fs.readFile(filePath, "utf-8");
    //将less解析成css

    const code = await less.render(lessCode, {
      //指定src下对应less文件的文件夹为目录
      paths: [sourceDir, dirname(filePath)],
    });

    //拿到.css后缀path
    const cssPath = lessFils[path].replace(".less", ".css");

    //将css写入对应目录
    await fs.writeFile(resolve(targetDir, cssPath), code.css);
  }
};
buildLess();
