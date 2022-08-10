import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import packageJson from "./package.json";
import path from "path";

const packageName = packageJson.name;
const entryFileName = packageJson.entryFileName;
const getPackageNameCamelCase = () => {
  try {
    return packageName
      .split("-")
      .map((word) => {
        return word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word;
      })
      .join("");
  } catch (err) {
    throw new Error("Name property in package.json is missing.");
  }
};

const fileName = {
  es: `${packageName}.es.js`,
  umd: `${packageName}.umd.js`,
  iife: `${packageName}.iife.js`,
};

export default defineConfig({
  build: {
    outDir: "dist",
    minify: true,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, `src/${entryFileName}`),
      name: getPackageNameCamelCase(),
      formats: ["es", "umd", "iife"],
      fileName: (format) => fileName[format],
    },
    rollupOptions: {
      external: [/\.less/], // 忽略打包文件, 另做处理
    }
  },
  plugins: [
    {
      // 把js文件里的 .less换成.css
      name: "style",
      generateBundle(config, bundle) {
        // 这里可以获取打包后的文件目录以及代码code
        const keys = Object.keys(bundle);
        for (const key of keys) {
          const bundler: any = bundle[key as any];
          // rollup内置方法,将所有输出文件code中的.less换成.css,因为我们当时没有打包less文件
          this.emitFile({
            type: "asset",
            fileName: key, // 文件名名不变
            source: bundler.code.replace(/\.less/g, ".css"),
          });
        }
      },
    },
    viteStaticCopy({
      targets: [
        { src: "src/style/demo.css", dest: "style" },
        { src: "README.md", dest: "./" },
        { src: "package.json", dest: "./" },
      ],
    }),
  ],
});
