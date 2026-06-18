import nextra from 'nextra'

const withNextra = nextra({})

const isProd = process.env.NODE_ENV === 'production'

export default withNextra({
  output: 'export',
  trailingSlash: true,
  basePath: isProd ? '/typescript' : '',
  assetPrefix: isProd ? '/typescript/' : '',
  images: {
    unoptimized: true
  },
})
