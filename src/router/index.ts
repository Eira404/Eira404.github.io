import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false })
import { Elfland } from '@/core/elfland/core'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home/index.vue')
    },
    {
      path: '/archives',
      name: 'archives',
      component: () => import('../views/Archives/index.vue')
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/Categories/index.vue')
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import('../views/Tags/index.vue')
    },
    {
      path: '/diagram',
      name: 'diagram',
      component: () => import('../views/Links/index.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/blog/:articlePath',
      name: 'article',
      component: () => import('../views/Article/index.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/playground',
      name: 'playground',
      component: () => import('../views/Playground/index.vue')
    },
    {
      path: '/ts-playground',
      name: 'ts-playground',
      component: () => import('../views/TSPlayground/index.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      redirect: '/'
    }
  ]
})

const elfland = Elfland.getInstance(router)

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  // console.log('beforeEach ready to precheck')
  if (!elfland.routerPromise.precheck(to, from, next)) return
  // console.log('beforeEach precheck finish, ready to check')
  if (!(await elfland.routerPromise.check(to, from, next))) return
  // console.log('beforeEach check finish')
  next()
})

router.afterEach((to, from, failure) => {
  // console.log('afterEach ready to postcheck')
  elfland.routerPromise.postcheck(to, from)
  // console.log('afterEach postcheck finish')
  NProgress.done()
})

export default router
