import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import packageJson from "./package.json";

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

export default defineConfig({
  build: {
    // target: "modules",
    outDir: "dist",
    minify: false,
    cssCodeSplit: false, // https://vitejs.cn/config/#build-csscodesplit 如果禁用，整个项目中的所有 CSS 将被提取到一个 CSS 文件中。
    rollupOptions: {
      input: [`src/${packageName}`],
      external: [/\.less/], // 忽略打包文件
      output: [
        {
          // 需要编译成ES5
          format: "iife",
          entryFileNames: `${packageName}.iife.js`,
          // 全局变量名称
          name: getPackageNameCamelCase(),
          // 让打包目录和我们目录对应
          // preserveModules: true,
          // 配置打包根目录
          // dir: "dist",
          preserveModulesRoot: "src", // https://rollupjs.org/guide/en/#outputpreservemodulesroot
          banner: "/* onlyhom my-library version */",
          footer: "/* follow me on Github! @onlyhom */",
        },
        {
          format: "es",
          entryFileNames: `${packageName}.es.js`,
          preserveModulesRoot: "src",
        },
        {
          format: "cjs",
          entryFileNames: `${packageName}.cjs.js`,
          preserveModulesRoot: "src",
        },
      ],
    },
    lib: {
      entry: `src/${entryFileName}`,
      formats: ["es", "cjs"],
    },
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
      targets: [{ src: "src/style/demo.css", dest: "style" }],
    }),
  ],
});
