import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace "SmartToDoList" with your repo name (case-sensitive)
export default defineConfig({
  plugins: [react()],
  base: '/SmartToDoList/'
})
