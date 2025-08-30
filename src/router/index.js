/**
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layouts'
import EmptyLayout from '@/layouts/EmptyLayout'
import { publicPath, routerMode } from '@/config'

Vue.use(VueRouter)
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true,
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/401'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true,
  },
]

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    name: 'Index',
    redirect: '/index',
    meta: { title: '首页', icon: 'home', tabGroup: 'Index' },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index/index'),
        meta: {
          title: '首页',
          icon: 'home',
          affix: true,
          tabGroup: 'Index',
        },
      },
    ],
  },
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/enterpriseBusinessDivision',
    name: 'Customer',
    meta: { title: '客户', icon: 'closed-captioning', tabGroup: 'Customer' },
    children: [
      {
        path: 'enterpriseBusinessDivision',
        name: 'EnterpriseBusinessDivision',
        component: () => import('@/views/customer/enterpriseBusinessDivision/index'),
        meta: { title: '企业事业部', icon: 'calculator' },
      },
      {
        path: 'enterpriseBusinessDivision/newEditOrDetails',
        name: 'EnterpriseDetail',
        component: () => import('@/views/customer/enterpriseBusinessDivision/newEditOrDetails'),
        meta: {
          title: '详情/编辑',
          activeMenu: '/customer/enterpriseBusinessDivision', // 高亮父菜单
          icon: 'cube',
        },
        hidden: true, // 关键：详情页在菜单中隐藏
        props: true,// 开启 props 传递
      }
    ],
  },
  {
    path: '/match',
    component: Layout,
    redirect: '/match/matchManage',
    name: 'Match',
    meta: { title: '匹配', icon: 'archive', tabGroup: 'Match' },
    children: [
      {
        path: 'matchManage',
        component: EmptyLayout,
        redirect: 'noRedirect',
        name: 'MatchManage',
        meta: { title: '匹配管理', icon: 'archive', },
        children: [
          {
            path: 'matchManage',
            name: 'MatchManage',
            component: () => import('@/views/match/matchManage/index'),
            meta: { title: '匹配记录', icon: 'book-open' },
          },
        ],
      },
    ]
  },
  {
    path: '/vab',
    component: Layout,
    redirect: '/vab/permissions',
    name: 'Vab',
    meta: { title: '组件', icon: 'box-open', tabGroup: 'Vab' },
    children: [
      {
        path: 'table',
        component: () => import('@/views/vab/table/index'),
        name: 'Table',
        meta: {
          title: '表格',
          icon: 'dice-six',
        },
      },
      {
        path: 'icon',
        component: EmptyLayout,
        redirect: 'noRedirect',
        name: 'Icon',
        meta: {
          title: '图标',
          icon: 'box',
        },
        children: [
          {
            path: 'awesomeIcon',
            name: 'AwesomeIcon',
            component: () => import('@/views/vab/icon/index'),
            meta: { title: '常规图标', icon: 'atom' },
          },
          {
            path: 'colorfulIcon',
            name: 'ColorfulIcon',
            component: () => import('@/views/vab/icon/colorfulIcon'),
            meta: { title: '多彩图标', icon: 'bowling-ball' },
          },
        ],
      },
      {
        path: 'webSocket',
        name: 'WebSocket',
        component: () => import('@/views/vab/webSocket/index'),
        meta: { title: 'webSocket', icon: 'certificate' },
      },
      {
        path: 'form',
        name: 'Form',
        component: () => import('@/views/vab/form/index'),
        meta: { title: '表单', icon: 'list-alt' },
      },
      {
        path: 'element',
        name: 'Element',
        component: () => import('@/views/vab/element/index'),
        meta: { title: '常用组件', icon: 'meh-blank' },
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/vab/tree/index'),
        meta: { title: '树', icon: 'air-freshener' },
      },
      {
        path: 'loading',
        name: 'Loading',
        component: () => import('@/views/vab/loading/index'),
        meta: { title: 'loading', icon: 'paw' },
      },
      {
        path: 'backToTop',
        name: 'BackToTop',
        component: () => import('@/views/vab/backToTop/index'),
        meta: { title: '返回顶部', icon: 'arrow-circle-up' },
      },
      {
        path: 'lodash',
        name: 'Lodash',
        component: () => import('@/views/vab/lodash/index'),
        meta: { title: 'lodash', icon: 'arrows-alt' },
      },
      {
        path: 'upload',
        name: 'Upload',
        component: () => import('@/views/vab/upload/index'),
        meta: { title: '上传', icon: 'file-upload' },
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/vab/errorLog/index'),
        meta: { title: '错误日志模拟', icon: 'times-circle' },
      },
      {
        path: 'more',
        name: 'More',
        component: () => import('@/views/vab/more/index'),
        meta: { title: '关于', icon: 'tools' },
      },
    ],
  },
  {
    path: '/personnelManagement',
    component: Layout,
    redirect: '/personnelManagement/userManagement/index',
    name: 'PersonnelManagement',
    meta: { title: '配置', icon: 'users-cog', tabGroup: 'PersonnelManagement' },
    children: [
      {
        path: 'userManagement',
        name: 'UserManagement',
        component: () => import('@/views/personnelManagement/userManagement/index'),
        meta: { title: '用户管理' },
      },
      {
        path: 'roleManagement',
        name: 'RoleManagement',
        component: () => import('@/views/personnelManagement/roleManagement/index'),
        meta: { title: '角色管理' },
      },
      {
        path: 'menuManagement',
        name: 'MenuManagement',
        component: () => import('@/views/personnelManagement/menuManagement/index'),
        // meta: { title: '菜单管理', badge: 'New' },
        meta: { title: '菜单管理' },
      },
    ],
  },
  {
    path: '/mall',
    component: Layout,
    redirect: '/mall/pay/index',
    name: 'Mall',
    meta: {
      title: '商城',
      icon: 'shopping-cart',
      tabGroup: 'Mall',
    },
    children: [
      {
        path: 'pay',
        name: 'Pay',
        component: () => import('@/views/mall/pay/index'),
        meta: {
          title: '支付',
          noKeepAlive: true,
        },
        children: null,
      },
      {
        path: 'goodsList',
        name: 'GoodsList',
        component: () => import('@/views/mall/goodsList/index'),
        meta: {
          title: '商品列表',
        },
      },
    ],
  },
  {
    path: '/error',
    component: EmptyLayout,
    redirect: '/401',
    name: 'Error',
    meta: { title: '错误页', icon: 'bug', tabGroup: 'Error' },
    children: [
      {
        path: '401',
        name: 'Error401',
        component: () => import('@/views/401'),
        meta: { title: '401' },
      },
      {
        path: '404',
        name: 'Error404',
        component: () => import('@/views/404'),
        meta: { title: '404' },
      },
    ],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]

const router = new VueRouter({
  base: publicPath,
  mode: routerMode,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
})

export function resetRouter () {
  location.reload()
}

export default router
