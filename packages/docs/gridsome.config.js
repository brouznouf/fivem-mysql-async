// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const remark = {
  plugins: [
    '@gridsome/remark-prismjs',
  ]
};

module.exports = {
  siteName: 'ghmattimysql',
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'content/pages/**/*.md',
        typeName: 'WebPage',
        remark,
      },
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'content/configOptions/**/*.md',
        typeName: 'ConfigOption',
        remark,
      },
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'content/serverVars/**/*.md',
        typeName: 'ServerVar',
        remark,
      },
    },
  ]
}
