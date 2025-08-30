/**
 * @description 路由守卫
 */
import router from '@/router'
import store from '@/store'
import VabProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/pageTitle'
import { progressBar, recordRoute, routesWhiteList } from '@/config'
import { nextTick } from 'vue'
VabProgress.configure({
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
})
router.beforeResolve(async (to, from, next) => {
  if (progressBar) VabProgress.start()
  let hasToken = store.getters['user/accessToken']//获取token

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      if (progressBar) VabProgress.done()
    } else {
      // 判断是否已经初始化动态路由
      const routesInitialized = store.getters['routes/routesInitialized']
      if (!routesInitialized) {
        // 未初始化：动态加载所有路由并添加到 router
        const accessRoutes = await store.dispatch('routes/setAllRoutes')
        accessRoutes.forEach(route => router.addRoute(route))
        // 设置标志：避免重复添加
        store.commit('routes/setRoutesInitialized', true)
        // 重定向当前路径（替换模式）以触发新路由
        nextTick(() => {
          next({ ...to, replace: true })
        })
      } else {
        // 已初始化，直接放行
        next()
      }
    }
  } else {
    if (routesWhiteList.indexOf(to.path) !== -1) {
      // 白名单页面（如 login）直接放行
      next()
    } else {
      // 非白名单页面，跳转到 login 页面
      if (recordRoute) {
        next(`/login?redirect=${to.path}`) // 可记录来源路径用于登录后重定向
      } else {
        next('/login')
      }

      if (progressBar) VabProgress.done()
    }
  }
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
})
// 路由跳转结束后关闭进度条
router.afterEach(() => {
  if (progressBar) VabProgress.done()
})
