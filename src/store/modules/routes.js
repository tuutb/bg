/**
 * @description 路由拦截状态管理模块
 * 用于动态控制路由加载，支持全量/部分路由管理
 */
import { asyncRoutes, constantRoutes } from '@/router'

const state = () => ({
  routes: [],//最终用于显示在侧边栏和路由中的完整路由（constant + async）
  routesInitialized: false,//是否已初始化动态路由（避免重复添加）
})
const getters = {
  routes: (state) => state.routes,
  routesInitialized: (state) => state.routesInitialized,
}
const mutations = {
  // 设置完整路由表（constantRoutes + 动态 routes）
  setAllRoutes (state, routes) {
    state.routes = constantRoutes.concat(routes)
  },
  // 标记动态路由是否已初始化
  setRoutesInitialized (state, initialized) {
    state.routesInitialized = initialized
  },
}
const actions = {
  // 异步加载全部动态路由（取消权限控制，默认全量添加）
  async setAllRoutes ({ commit }) {
    const accessRoutes = asyncRoutes
    commit('setAllRoutes', accessRoutes)
    return accessRoutes
  },
}
export default { state, getters, mutations, actions }
