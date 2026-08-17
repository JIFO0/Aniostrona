// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";

const isExport = process.env.EXPORT_STATIC === "1";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
    // Enable SSG prerendering during static export so pages build as fully populated HTML.
    prerender: isExport ? {
      routes: ["/", "/cv", "/poradnik-wizytowka"],
    } : undefined,
  },
  vite: {
    // Disable mcpPlugin during static export build to avoid Windows path separator bug in @lovable.dev/mcp-js
    plugins: isExport ? [] : [mcpPlugin()],
    // Allow the export script to override the output directory via env variable.
    build: {
      outDir: process.env.VITE_BUILD_OUTDIR ?? "dist",
      emptyOutDir: true,
    },
    // Expose EXPORT_STATIC to import.meta.env so cv.tsx can detect static export mode.
    define: {
      "import.meta.env.EXPORT_STATIC": JSON.stringify(process.env.EXPORT_STATIC ?? ""),
      "import.meta.env.CV_STATIC_PASSWORD": JSON.stringify(
        isExport ? (process.env.CV_PASSWORD ?? process.env.CV_STATIC_PASSWORD ?? "") : "",
      ),
    },
  },
});




