const routes = [
  {

    path: '/admin',
    name: 'Admin',
    redirect: 'dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'inicio',
        path: '', component: () => import('pages/Index.vue')
      },
      {
        name: 'AdminUsuarios',
        path: '/Administracion/AdminUsuarios', component: () => import('pages/Administracion/AdminUsuarios.vue')
      },
      {
        name: 'Tercero',
        path: '/Administracion/Tercero', component: () => import('pages/Administracion/Tercero.vue')
      },
      {
        name: 'Roles',
        path: '/Administracion/Roles', component: () => import('pages/Administracion/Roles.vue')
      },
      {
        name: 'cambioClave',
        path: '/Administracion/cambioClave', component: () => import('pages/Administracion/cambioClave.vue')
      },
      {
        name: 'Carta_Control',
        path: '/Administracion/Carta_Control', component: () => import('pages/Administracion/CartaControl.vue')
      },
      {
        name: 'Dashboard',
        path: '/Administracion/Dashboard', component: () => import('pages/Administracion/Dashboard.vue')
      }
    ]
  },

  {
    path: '/',
    component: () => import('layouts/Inicio.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
