
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/my-daily-planner/',
  locale: undefined,
  routes: [
  {
    "renderMode": 1,
    "redirectTo": "/my-daily-planner/tasks",
    "route": "/my-daily-planner"
  },
  {
    "renderMode": 1,
    "route": "/my-daily-planner/tasks"
  },
  {
    "renderMode": 1,
    "route": "/my-daily-planner/calendar"
  },
  {
    "renderMode": 1,
    "route": "/my-daily-planner/credentials"
  },
  {
    "renderMode": 1,
    "route": "/my-daily-planner/backup"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 769, hash: '6647779fb4606c1287e9105ad0b0e0d127b24d7a761a1bbe49f2c4c8d073d2a7', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 969, hash: 'bd100d458d280f18b25e6ac39572cd275f42b735d59d45b221f7d95af7620763', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-KKEWGSK6.css': {size: 332, hash: 'SDjByUaMM6k', text: () => import('./assets-chunks/styles-KKEWGSK6_css.mjs').then(m => m.default)}
  },
};
