// import postcssNesting from 'postcss-nesting'; // Tidak diperlukan di v4
import tailwindcss from '@tailwindcss/postcss';
// import autoprefixer from 'autoprefixer'; // Tidak diperlukan di v4

export default {
  plugins: [
    // postcssNesting(), // Tidak diperlukan di v4
    tailwindcss(),
    // autoprefixer(), // Tidak diperlukan di v4
  ],
};