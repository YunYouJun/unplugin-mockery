// vite.config.ts
import path from "node:path";
import { defineConfig } from "file:///Users/yunyou/repos/gh/yyj/unplugin-mockery/node_modules/.pnpm/vite@5.4.0_@types+node@22.2.0_sass@1.77.8_terser@5.31.5/node_modules/vite/dist/node/index.js";
import Vue from "file:///Users/yunyou/repos/gh/yyj/unplugin-mockery/node_modules/.pnpm/@vitejs+plugin-vue@5.1.2_vite@5.4.0_@types+node@22.2.0_sass@1.77.8_terser@5.31.5__vue@3.4.37_typescript@5.5.4_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Layouts from "file:///Users/yunyou/repos/gh/yyj/unplugin-mockery/node_modules/.pnpm/vite-plugin-vue-layouts@0.11.0_vite@5.4.0_@types+node@22.2.0_sass@1.77.8_terser@5.31.5__vue-r_2wikrw5hanngx7sdjid2qhhww4/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import Components from "file:///Users/yunyou/repos/gh/yyj/unplugin-mockery/node_modules/.pnpm/unplugin-vue-components@0.27.3_@babel+parser@7.25.3_@nuxt+kit@3.12.4_magicast@0.3.4_rollup@4._2kwnjsblspkyslhpszhtv3cngu/node_modules/unplugin-vue-components/dist/vite.js";
import AutoImport from "file:///Users/yunyou/repos/gh/yyj/unplugin-mockery/node_modules/.pnpm/unplugin-auto-import@0.18.2_@nuxt+kit@3.12.4_magicast@0.3.4_rollup@4.20.0__@vueuse+core@10.11_rjsie6xcttkr5oqwujguul4lke/node_modules/unplugin-auto-import/dist/vite.js";
import Markdown from "file:///Users/yunyou/repos/gh/yyj/unplugin-mockery/node_modules/.pnpm/unplugin-vue-markdown@0.26.2_rollup@4.20.0_vite@5.4.0_@types+node@22.2.0_sass@1.77.8_terser@5.31.5_/node_modules/unplugin-vue-markdown/dist/vite.js";
import VueI18n from "file:///Users/yunyou/repos/gh/yyj/unplugin-mockery/node_modules/.pnpm/@intlify+unplugin-vue-i18n@4.0.0_rollup@4.20.0_vue-i18n@9.13.1_vue@3.4.37_typescript@5.5.4__/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import VueDevTools from "file:///Users/yunyou/repos/gh/yyj/unplugin-mockery/node_modules/.pnpm/vite-plugin-vue-devtools@7.3.7_@nuxt+kit@3.12.4_magicast@0.3.4_rollup@4.20.0__rollup@4.20.0_v_c7kmjukotan5qx6vtvxjb3oagu/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import LinkAttributes from "file:///Users/yunyou/repos/gh/yyj/unplugin-mockery/node_modules/.pnpm/markdown-it-link-attributes@4.0.1/node_modules/markdown-it-link-attributes/index.js";
import Unocss from "file:///Users/yunyou/repos/gh/yyj/unplugin-mockery/node_modules/.pnpm/unocss@0.61.9_postcss@8.4.41_rollup@4.20.0_vite@5.4.0_@types+node@22.2.0_sass@1.77.8_terser@5.31.5_/node_modules/unocss/dist/vite.mjs";
import Shiki from "file:///Users/yunyou/repos/gh/yyj/unplugin-mockery/node_modules/.pnpm/@shikijs+markdown-it@1.12.1/node_modules/@shikijs/markdown-it/dist/index.mjs";
import VueRouter from "file:///Users/yunyou/repos/gh/yyj/unplugin-mockery/node_modules/.pnpm/unplugin-vue-router@0.10.2_rollup@4.20.0_vue-router@4.4.3_vue@3.4.37_typescript@5.5.4___vue@3.4.37_typescript@5.5.4_/node_modules/unplugin-vue-router/dist/vite.js";
import { VueRouterAutoImports } from "file:///Users/yunyou/repos/gh/yyj/unplugin-mockery/node_modules/.pnpm/unplugin-vue-router@0.10.2_rollup@4.20.0_vue-router@4.4.3_vue@3.4.37_typescript@5.5.4___vue@3.4.37_typescript@5.5.4_/node_modules/unplugin-vue-router/dist/index.js";
import consola from "file:///Users/yunyou/repos/gh/yyj/unplugin-mockery/node_modules/.pnpm/consola@3.2.3/node_modules/consola/dist/index.mjs";
import colors from "file:///Users/yunyou/repos/gh/yyj/unplugin-mockery/node_modules/.pnpm/picocolors@1.0.1/node_modules/picocolors/picocolors.js";
import { componentsDir } from "file:///Users/yunyou/repos/gh/yyj/unplugin-mockery/node_modules/.pnpm/@advjs+gui@0.0.7-beta.5_vue@3.4.37_typescript@5.5.4_/node_modules/@advjs/gui/dist/node/index.mjs";
var __vite_injected_original_dirname = "/Users/yunyou/repos/gh/yyj/unplugin-mockery/client";
var prefix = `monaco-editor/esm/vs`;
var vite_config_default = defineConfig(({ mode }) => {
  consola.info(`[client] Running in ${colors.green(mode)} mode`);
  return {
    build: {
      target: "esnext",
      outDir: path.resolve(__vite_injected_original_dirname, "../dist-client"),
      minify: false,
      // 'esbuild',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            monacoEditor: [`${prefix}/editor/editor.main`],
            jsonWorker: [`${prefix}/language/json/json.worker`],
            cssWorker: [`${prefix}/language/css/css.worker`],
            htmlWorker: [`${prefix}/language/html/html.worker`],
            tsWorker: [`${prefix}/language/typescript/ts.worker`],
            editorWorker: [`${prefix}/editor/editor.worker`]
          }
        }
      }
    },
    resolve: {
      alias: {
        "~/": `${path.resolve(__vite_injected_original_dirname, "src")}/`
      }
    },
    server: {
      proxy: {
        // http://localhost:3000/_mockery_api_/xxx => http://localhost:51224/_mockery_api_/xxx
        "^/_mockery_api_/.*": {
          target: "http://localhost:51224",
          changeOrigin: true
        }
      }
    },
    plugins: [
      Vue({
        include: [/\.vue$/, /\.md$/]
      }),
      // https://github.com/posva/unplugin-vue-router
      VueRouter({
        extensions: [".vue", ".md"],
        dts: "src/typed-router.d.ts"
      }),
      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts(),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          "vue",
          "vue-i18n",
          "@vueuse/head",
          "@vueuse/core",
          VueRouterAutoImports,
          {
            // add any other imports you were relying on
            "vue-router/auto": ["useLink"]
          }
        ],
        dts: "src/auto-imports.d.ts",
        dirs: [
          "src/composables",
          "src/stores"
        ],
        vueTemplate: true
      }),
      // https://github.com/antfu/unplugin-vue-components
      Components({
        // allow auto load markdown components under `./src/components/`
        extensions: ["vue", "md"],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: "src/components.d.ts",
        dirs: [
          "src/components",
          componentsDir
        ]
      }),
      // https://github.com/antfu/unocss
      // see uno.config.ts for config
      Unocss(),
      // https://github.com/unplugin/unplugin-vue-markdown
      // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
      Markdown({
        wrapperClasses: "prose prose-sm m-auto text-left",
        headEnabled: true,
        async markdownItSetup(md) {
          md.use(LinkAttributes, {
            matcher: (link) => /^https?:\/\//.test(link),
            attrs: {
              target: "_blank",
              rel: "noopener"
            }
          });
          md.use(await Shiki({
            defaultColor: false,
            themes: {
              light: "vitesse-light",
              dark: "vitesse-dark"
            }
          }));
        }
      }),
      // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
      VueI18n({
        runtimeOnly: true,
        compositionOnly: true,
        fullInstall: true,
        include: [path.resolve(__vite_injected_original_dirname, "locales/**")]
      }),
      // https://github.com/webfansplz/vite-plugin-vue-devtools
      VueDevTools()
    ],
    // https://github.com/vitest-dev/vitest
    test: {
      include: ["test/**/*.test.ts"],
      environment: "jsdom"
    },
    // https://github.com/antfu/vite-ssg
    ssgOptions: {
      script: "async",
      formatting: "minify",
      crittersOptions: {
        reduceInlineStyles: false
      }
    },
    ssr: {
      // TODO: workaround until they support native ESM
      noExternal: ["workbox-window", /vue-i18n/]
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMveXVueW91L3JlcG9zL2doL3l5ai91bnBsdWdpbi1tb2NrZXJ5L2NsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3l1bnlvdS9yZXBvcy9naC95eWovdW5wbHVnaW4tbW9ja2VyeS9jbGllbnQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3l1bnlvdS9yZXBvcy9naC95eWovdW5wbHVnaW4tbW9ja2VyeS9jbGllbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IFZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgTGF5b3V0cyBmcm9tICd2aXRlLXBsdWdpbi12dWUtbGF5b3V0cydcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IE1hcmtkb3duIGZyb20gJ3VucGx1Z2luLXZ1ZS1tYXJrZG93bi92aXRlJ1xuaW1wb3J0IFZ1ZUkxOG4gZnJvbSAnQGludGxpZnkvdW5wbHVnaW4tdnVlLWkxOG4vdml0ZSdcbmltcG9ydCBWdWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnXG5pbXBvcnQgTGlua0F0dHJpYnV0ZXMgZnJvbSAnbWFya2Rvd24taXQtbGluay1hdHRyaWJ1dGVzJ1xuaW1wb3J0IFVub2NzcyBmcm9tICd1bm9jc3Mvdml0ZSdcbmltcG9ydCBTaGlraSBmcm9tICdAc2hpa2lqcy9tYXJrZG93bi1pdCdcbmltcG9ydCBWdWVSb3V0ZXIgZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlci92aXRlJ1xuaW1wb3J0IHsgVnVlUm91dGVyQXV0b0ltcG9ydHMgfSBmcm9tICd1bnBsdWdpbi12dWUtcm91dGVyJ1xuaW1wb3J0IGNvbnNvbGEgZnJvbSAnY29uc29sYSdcblxuaW1wb3J0IGNvbG9ycyBmcm9tICdwaWNvY29sb3JzJ1xuXG5pbXBvcnQgeyBjb21wb25lbnRzRGlyIH0gZnJvbSAnQGFkdmpzL2d1aS9ub2RlJ1xuXG5jb25zdCBwcmVmaXggPSBgbW9uYWNvLWVkaXRvci9lc20vdnNgXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc29sYS5pbmZvKGBbY2xpZW50XSBSdW5uaW5nIGluICR7Y29sb3JzLmdyZWVuKG1vZGUpfSBtb2RlYClcblxuICByZXR1cm4ge1xuICAgIGJ1aWxkOiB7XG4gICAgICB0YXJnZXQ6ICdlc25leHQnLFxuICAgICAgb3V0RGlyOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vZGlzdC1jbGllbnQnKSxcbiAgICAgIG1pbmlmeTogZmFsc2UsIC8vICdlc2J1aWxkJyxcbiAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgICAgbW9uYWNvRWRpdG9yOiBbYCR7cHJlZml4fS9lZGl0b3IvZWRpdG9yLm1haW5gXSxcbiAgICAgICAgICAgIGpzb25Xb3JrZXI6IFtgJHtwcmVmaXh9L2xhbmd1YWdlL2pzb24vanNvbi53b3JrZXJgXSxcbiAgICAgICAgICAgIGNzc1dvcmtlcjogW2Ake3ByZWZpeH0vbGFuZ3VhZ2UvY3NzL2Nzcy53b3JrZXJgXSxcbiAgICAgICAgICAgIGh0bWxXb3JrZXI6IFtgJHtwcmVmaXh9L2xhbmd1YWdlL2h0bWwvaHRtbC53b3JrZXJgXSxcbiAgICAgICAgICAgIHRzV29ya2VyOiBbYCR7cHJlZml4fS9sYW5ndWFnZS90eXBlc2NyaXB0L3RzLndvcmtlcmBdLFxuICAgICAgICAgICAgZWRpdG9yV29ya2VyOiBbYCR7cHJlZml4fS9lZGl0b3IvZWRpdG9yLndvcmtlcmBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnfi8nOiBgJHtwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyl9L2AsXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHByb3h5OiB7XG4gICAgICAgIC8vIGh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9fbW9ja2VyeV9hcGlfL3h4eCA9PiBodHRwOi8vbG9jYWxob3N0OjUxMjI0L19tb2NrZXJ5X2FwaV8veHh4XG4gICAgICAgICdeL19tb2NrZXJ5X2FwaV8vLionOiB7XG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo1MTIyNCcsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgcGx1Z2luczogW1xuICAgICAgVnVlKHtcbiAgICAgICAgaW5jbHVkZTogWy9cXC52dWUkLywgL1xcLm1kJC9dLFxuICAgICAgfSksXG5cbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wb3N2YS91bnBsdWdpbi12dWUtcm91dGVyXG4gICAgICBWdWVSb3V0ZXIoe1xuICAgICAgICBleHRlbnNpb25zOiBbJy52dWUnLCAnLm1kJ10sXG4gICAgICAgIGR0czogJ3NyYy90eXBlZC1yb3V0ZXIuZC50cycsXG4gICAgICB9KSxcblxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL0pvaG5DYW1waW9uSnIvdml0ZS1wbHVnaW4tdnVlLWxheW91dHNcbiAgICAgIExheW91dHMoKSxcblxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLWF1dG8taW1wb3J0XG4gICAgICBBdXRvSW1wb3J0KHtcbiAgICAgICAgaW1wb3J0czogW1xuICAgICAgICAgICd2dWUnLFxuICAgICAgICAgICd2dWUtaTE4bicsXG4gICAgICAgICAgJ0B2dWV1c2UvaGVhZCcsXG4gICAgICAgICAgJ0B2dWV1c2UvY29yZScsXG4gICAgICAgICAgVnVlUm91dGVyQXV0b0ltcG9ydHMsXG4gICAgICAgICAge1xuICAgICAgICAgICAgLy8gYWRkIGFueSBvdGhlciBpbXBvcnRzIHlvdSB3ZXJlIHJlbHlpbmcgb25cbiAgICAgICAgICAgICd2dWUtcm91dGVyL2F1dG8nOiBbJ3VzZUxpbmsnXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBkdHM6ICdzcmMvYXV0by1pbXBvcnRzLmQudHMnLFxuICAgICAgICBkaXJzOiBbXG4gICAgICAgICAgJ3NyYy9jb21wb3NhYmxlcycsXG4gICAgICAgICAgJ3NyYy9zdG9yZXMnLFxuICAgICAgICBdLFxuICAgICAgICB2dWVUZW1wbGF0ZTogdHJ1ZSxcbiAgICAgIH0pLFxuXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcbiAgICAgIENvbXBvbmVudHMoe1xuICAgICAgICAvLyBhbGxvdyBhdXRvIGxvYWQgbWFya2Rvd24gY29tcG9uZW50cyB1bmRlciBgLi9zcmMvY29tcG9uZW50cy9gXG4gICAgICAgIGV4dGVuc2lvbnM6IFsndnVlJywgJ21kJ10sXG4gICAgICAgIC8vIGFsbG93IGF1dG8gaW1wb3J0IGFuZCByZWdpc3RlciBjb21wb25lbnRzIHVzZWQgaW4gbWFya2Rvd25cbiAgICAgICAgaW5jbHVkZTogWy9cXC52dWUkLywgL1xcLnZ1ZVxcP3Z1ZS8sIC9cXC5tZCQvXSxcbiAgICAgICAgZHRzOiAnc3JjL2NvbXBvbmVudHMuZC50cycsXG4gICAgICAgIGRpcnM6IFtcbiAgICAgICAgICAnc3JjL2NvbXBvbmVudHMnLFxuICAgICAgICAgIGNvbXBvbmVudHNEaXIsXG4gICAgICAgIF0sXG4gICAgICB9KSxcblxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3Vub2Nzc1xuICAgICAgLy8gc2VlIHVuby5jb25maWcudHMgZm9yIGNvbmZpZ1xuICAgICAgVW5vY3NzKCksXG5cbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS91bnBsdWdpbi91bnBsdWdpbi12dWUtbWFya2Rvd25cbiAgICAgIC8vIERvbid0IG5lZWQgdGhpcz8gVHJ5IHZpdGVzc2UtbGl0ZTogaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3ZpdGVzc2UtbGl0ZVxuICAgICAgTWFya2Rvd24oe1xuICAgICAgICB3cmFwcGVyQ2xhc3NlczogJ3Byb3NlIHByb3NlLXNtIG0tYXV0byB0ZXh0LWxlZnQnLFxuICAgICAgICBoZWFkRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgYXN5bmMgbWFya2Rvd25JdFNldHVwKG1kKSB7XG4gICAgICAgICAgbWQudXNlKExpbmtBdHRyaWJ1dGVzLCB7XG4gICAgICAgICAgICBtYXRjaGVyOiAobGluazogc3RyaW5nKSA9PiAvXmh0dHBzPzpcXC9cXC8vLnRlc3QobGluayksXG4gICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICB0YXJnZXQ6ICdfYmxhbmsnLFxuICAgICAgICAgICAgICByZWw6ICdub29wZW5lcicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pXG4gICAgICAgICAgbWQudXNlKGF3YWl0IFNoaWtpKHtcbiAgICAgICAgICAgIGRlZmF1bHRDb2xvcjogZmFsc2UsXG4gICAgICAgICAgICB0aGVtZXM6IHtcbiAgICAgICAgICAgICAgbGlnaHQ6ICd2aXRlc3NlLWxpZ2h0JyxcbiAgICAgICAgICAgICAgZGFyazogJ3ZpdGVzc2UtZGFyaycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pKVxuICAgICAgICB9LFxuICAgICAgfSksXG5cbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9pbnRsaWZ5L2J1bmRsZS10b29scy90cmVlL21haW4vcGFja2FnZXMvdW5wbHVnaW4tdnVlLWkxOG5cbiAgICAgIFZ1ZUkxOG4oe1xuICAgICAgICBydW50aW1lT25seTogdHJ1ZSxcbiAgICAgICAgY29tcG9zaXRpb25Pbmx5OiB0cnVlLFxuICAgICAgICBmdWxsSW5zdGFsbDogdHJ1ZSxcbiAgICAgICAgaW5jbHVkZTogW3BhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdsb2NhbGVzLyoqJyldLFxuICAgICAgfSksXG5cbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJmYW5zcGx6L3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29sc1xuICAgICAgVnVlRGV2VG9vbHMoKSxcbiAgICBdLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3ZpdGVzdC1kZXYvdml0ZXN0XG4gICAgdGVzdDoge1xuICAgICAgaW5jbHVkZTogWyd0ZXN0LyoqLyoudGVzdC50cyddLFxuICAgICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgfSxcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS92aXRlLXNzZ1xuICAgIHNzZ09wdGlvbnM6IHtcbiAgICAgIHNjcmlwdDogJ2FzeW5jJyxcbiAgICAgIGZvcm1hdHRpbmc6ICdtaW5pZnknLFxuICAgICAgY3JpdHRlcnNPcHRpb25zOiB7XG4gICAgICAgIHJlZHVjZUlubGluZVN0eWxlczogZmFsc2UsXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICBzc3I6IHtcbiAgICAgIC8vIFRPRE86IHdvcmthcm91bmQgdW50aWwgdGhleSBzdXBwb3J0IG5hdGl2ZSBFU01cbiAgICAgIG5vRXh0ZXJuYWw6IFsnd29ya2JveC13aW5kb3cnLCAvdnVlLWkxOG4vXSxcbiAgICB9LFxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3VSxPQUFPLFVBQVU7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
