
const routes = [
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/Administracion/AdminUsuarios', component: () => import('pages/Administracion/AdminUsuarios.vue') },
      { path: '/Administracion/Tercero', component: () => import('pages/Administracion/Tercero.vue') },
      { path: '/Administracion/Roles', component: () => import('pages/Administracion/Roles.vue') },
      { path: '/Administracion/cambioClave', component: () => import('pages/Administracion/cambioClave.vue') },
      { path: '/Administracion/Carta_Control', component: () => import('pages/Administracion/CartaControl.vue') }
    ]
  },

  {
    path: '/',
    component: () => import('layouts/Inicio.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
