import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/


export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      // dev specific config
      plugins: [react()],
    }
  } else {
    // command === 'build'
    const env = loadEnv(mode, process.cwd(), '')

    return {
      // build specific config
      plugins: [react()],
      base: '/qyzhao/',

      define: {
        __APP_ENV__: JSON.stringify(env.APP_ENV),
      },

      build: {
        // generate .vite/manifest.json in outDir
        manifest: true,
        //   rollupOptions: {
        //     // overwrite default .html entry
        //     input: '/src/main.jsx',
        //   },
      },
    }
  }
})

// export default defineConfig(({ command, mode }) => {
//   // Load env file based on `mode` in the current working directory.
//   // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
//   const env = loadEnv(mode, process.cwd(), '')
//   return {
//     // vite config
//     define: {
//       __APP_ENV__: JSON.stringify(env.APP_ENV),
//     },
//   }
// })