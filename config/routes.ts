export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        // authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            path: '/welcome',
            name: 'welcome',
            icon: 'smile',
            component: './Welcome',
          },
          {
            path: '/admin',
            name: 'admin',
            icon: 'crown',
            component: './Admin',
            // authority: ['admin'],
            routes: [
              {
                path: '/admin/sub-page',
                name: 'sub-page',
                icon: 'smile',
                component: './Welcome',
                authority: ['admin'],
              },
              {
                path: '/admin/edit_article',
                name: 'edit_article',
                icon: 'edit',
                component: './EditArticle',
              },
              {
                path: '/admin/article_list',
                name: 'article_list',
                icon: 'table',
                component: './Article',
              },
              {
                path: '/admin/article_category_list',
                name: 'article_category_list',
                icon: 'table',
                component: './ArticleCategory',
              },
              {
                path: '/admin/article_tag_list',
                name: 'article_tag_list',
                icon: 'table',
                component: './Tag',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
