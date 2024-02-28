import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/


export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {

  return {
    base: "/",
    plugins: [react()],
    preview: {
     port: 8888,
     strictPort: true,
    },
    server: {
     port: 8888,
     strictPort: true,
     host: true,
     origin: "http://0.0.0.0:8080",
    },
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