// rollup.config.js
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const mainConfig = {
  input: 'src/index.ts',
  // React-কে external হিসেবে চিহ্নিত করুন
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      // CommonJS-এ React import ঠিক করার জন্য
      interop: 'auto',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    }
  ],
  plugins: [
    external(),  // Peer dependencies automatically external
    postcss({
      modules: {
        // CSS Modules ক্লাস নেম জেনারেট করুন
        generateScopedName: 'richmoshiur_[name]__[local]__[hash:base64:5]',
      },
      extract: false,
      minimize: true,
      inject: true,  // CSS ইনজেক্ট করুন
      use: ['sass'],
    }),
    resolve({
      extensions,
    }),
    commonjs({
      include: /node_modules/,
    }),
    babel({
      extensions,
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', {
          targets: {
            browsers: ['> 1%', 'last 2 versions', 'not dead']
          },
          modules: false,
        }],
        ['@babel/preset-react', {
          runtime: 'automatic',  // JSX Transform
        }],
        '@babel/preset-typescript'
      ]
    }),
    terser(),
  ]
};

const dtsConfig = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.d.ts',
    format: 'es',
  },
  external: ['react', 'react-dom', /\.css$/],
  plugins: [
    dts({
      respectExternal: true,
    }),
  ],
};

export default [mainConfig, dtsConfig];