fx_version 'adamant'
game 'common'

name 'ghmattimysql'
description 'MySQL Middleware for fivem using mysql.js.'
author 'Matthias Mandelartz'
version '1.2.3'
url 'https://github.com/GHMatti/ghmattimysql'

server_scripts {
  'ghmattimysql-server.js',
  'ghmattimysql-server.lua',
}

client_script 'ghmattimysql-client.js'

files {
  'ui/index.html',
  'ui/app.js',
  'ui/app.css',
  'ui/app.css',
  'ui/fonts/alegreya-sans-v9-latin-300.woff',
  'ui/fonts/alegreya-sans-v9-latin-500.woff',
  'ui/fonts/alegreya-sans-v9-latin-700.woff',
  'ui/fonts/alegreya-sans-v9-latin-regular.woff',
  'ui/fonts/alegreya-sans-v9-latin-300.woff2',
  'ui/fonts/alegreya-sans-v9-latin-500.woff2',
  'ui/fonts/alegreya-sans-v9-latin-700.woff2',
  'ui/fonts/alegreya-sans-v9-latin-regular.woff2',
  'ui/fonts/MaterialIcons-Regular.eot',
  'ui/fonts/MaterialIcons-Regular.ttf',
  'ui/fonts/MaterialIcons-Regular.woff',
  'ui/fonts/MaterialIcons-Regular.woff2',
}

ui_page 'ui/index.html'
