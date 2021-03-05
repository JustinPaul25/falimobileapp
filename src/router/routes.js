
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/login', component: () => import('pages/Login.vue') },
      { path: '/menu', component: () => import('pages/Menu.vue') },
      { path: '/tutorials', component: () => import('pages/Tutorials.vue') },
      { path: '/stories', component: () => import('pages/Stories.vue')},
      { path: '/stories/:id', component: () => import('pages/Story.vue')},
      { path: '/stories/:id/terms', component: () => import('pages/Terms.vue')},
      { path: '/stories/:id/quiz', component: () => import('pages/Quiz.vue')},
      { path: '/progress', component: () => import('pages/Progress.vue')},
      { path: '/result', component: () => import('pages/Result.vue')},
      { path: '/settings', component: () => import('pages/Setting.vue')},
      { path: '/profile', component: () => import('pages/Profile.vue')},
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
