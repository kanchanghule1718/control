import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/pecopp',                     // set base path for deployment in subdirectory for local
  base: '/pecopp_pestcontrol',            // set base path for deployment in subdirectory for live
})
