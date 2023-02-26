import commonjs from '@rollup/plugin-commonjs';

export default {
  plugins: [
    commonjs({
      namedExports: {
        'popper.js': ['createPopper']
      }
    })
  ]
}
