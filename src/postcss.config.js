module.exports = {
  plugins: [
    require('postcss-fixes'),
    require('autoprefixer'),
    require('cssnano')({
      'safe': true,
      'calc': false
  }),
    require('postcss-sort-media-queries')
  ]
}