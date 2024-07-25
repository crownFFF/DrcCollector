import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  css: {
    preprocessorOptions: {
      css: {
        additionalData: `
          @import "slick-carousel/slick/slick.css";
          @import "slick-carousel/slick/slick-theme.css";
        `
      }
    }
  }
});
