import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/

const baseApiUrl = 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api';
const baseSocketUrl = 'wss://ws1.aliceblueonline.com/NorenWS';

export default defineConfig({
  plugins: [react()],
  server: {
    // https: false,
    proxy: {
      '/api': {
        target: baseApiUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/sockets': {
        target: baseSocketUrl,
        ws: true,
      }
    }
  }
})
