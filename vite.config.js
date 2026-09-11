import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// __BUILD_TIME__ подставляется в момент сборки — у каждого деплоя он свой,
// это самый простой способ убедиться, что открыт именно новый билд.
export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})
