import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

export default {
  base: '/greenfutureinnovation/', // Replace this with your Netlify site's subpath
  build: {
    outDir: 'dist' // Ensure this matches your build folder
  }
};
