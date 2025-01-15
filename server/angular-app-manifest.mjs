
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://Abyss-Storm.github.io/docusign/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/https://Abyss-Storm.github.io/docusign"
  }
],
  assets: {
    'index.csr.html': {size: 543, hash: '5876b4e752f124e621c224785ee43d3bd640bc208ee9b166c09179bee9cf8f23', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1056, hash: '52a17be73d03527c62ef0249151e8e94fbe7f41d005cdc034f3403d324e23f94', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 1676, hash: '17e9af4f739ac18aba559cd0025053d529ecf1daa3102764bf8c1c390e5fcc62', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
