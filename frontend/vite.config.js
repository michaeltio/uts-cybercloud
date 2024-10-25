import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const base = process.env.CUSTOM_PATH ? `/${process.env.CUSTOM_PATH}/` : '/michael-tio';

export default defineConfig({
  base,
  plugins: [vue()],
})