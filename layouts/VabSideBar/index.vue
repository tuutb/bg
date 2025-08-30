<template>
  <el-scrollbar :class="{ 'is-collapse': collapse }" class="side-bar-container">
    <!-- logo 可以根据实际替换 -->
    <!-- <vab-logo /> -->
    <el-tabs v-model="activeTab" tab-position="left" class="custom-tab" @tab-click="handleTabClick">
      <el-tab-pane v-for="tab in tabList" :key="tab.name" :label="tab.label" :name="tab.name">
        <div class="tab-icons" slot="label">
          <vab-icon v-if="tab.icon" :icon="['fas', tab.icon]" class="vab-fas-icon" />
          {{ tab.label }}
        </div>
        <el-menu :active-text-color="variables['menu-color-active']" :background-color="variables['menu-background']"
          :collapse="collapse" :collapse-transition="false" :default-active="activeMenu" :default-openeds="defaultOpens"
          :text-color="variables['menu-color']" :unique-opened="uniqueOpened" mode="vertical"
          @select="handleMenuSelect">
          <div class="logo-box">客户端</div>
          <el-divider content-position="center" class="title-line">
            {{ tab.label }}
          </el-divider>
          <template v-for="route in currentMenus">
            <vab-side-bar-item :key="route.path" :full-path="route.path" :item="route" />
          </template>
        </el-menu>
      </el-tab-pane>
    </el-tabs>
  </el-scrollbar>
</template>

<script>

import variables from '@/styles/variables.scss'
import { mapGetters } from 'vuex'
import { defaultOopeneds, uniqueOpened } from '@/config'

export default {
  name: 'VabSideBar',
  components: {
  },
  data () {
    return {
      resizeTimer: null,
      windowWidth: window.innerWidth,  // 当前窗口宽度
      uniqueOpened,
      activeTab: 'Index',
      tabList: [
        {
          name: 'Index',
          label: '首页',
          icon: 'home',
        },
        {
          name: 'Customer',
          label: '客户',
          icon: 'closed-captioning',
        },
        {
          name: 'Match',
          label: '匹配',
          icon: 'archive',
        },
        {
          name: 'Vab',
          label: '组件',
          icon: 'box-open',
        },
        {
          name: 'PersonnelManagement',
          label: '配置',
          icon: 'users-cog',
        },
        {
          name: 'Mall',
          label: '商城',
          icon: 'shopping-cart',
        },
        {
          name: 'Error',
          label: '错误页',
          icon: 'bug',
        },
      ],
    }
  },
  mounted () {
    this.$nextTick(() => {
      const tabGroup = this.findTabGroup(this.$route);
      this.activeTab = tabGroup || 'Index';
      if (this.$route.path === '/index' || this.$route.meta?.affix) {
        this.$store.commit('settings/foldSideBar')
      }
    })

    // 初始判断窗口宽度
    this.updateCollapseStatus()

    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize)
  },
  computed: {
    ...mapGetters({
      collapse: 'settings/collapse',
      routes: 'routes/routes',
    }),
    defaultOpens () {
      if (this.collapse) {
        return []
      }
      return defaultOopeneds
    },
    activeMenu () {
      // 返回当前路由激活菜单, 这里简单返回路由path或meta.activeMenu
      const route = this.$route
      if (route.meta && route.meta.activeMenu) {
        return route.meta.activeMenu
      }
      return route.path
    },
    variables () {
      return variables
    },

    currentMenus () {
      // 没有去掉顶级菜单
      // const filterRoutes = (routes, group, isRoot = true) => {
      //     return routes
      //         .filter(r => {
      //             if (!r.meta) return false
      //             return isRoot ? r.meta.tabGroup === group : true
      //         })
      //         .map(r => {
      //             const item = {
      //                 ...r,
      //                 label: r.meta.title,
      //                 icon: r.meta.icon,
      //                 routeName: r.name,
      //             }

      //             if (r.children && r.children.length > 0) {
      //                 item.children = filterRoutes(r.children, group, false)
      //             }

      //             return item
      //         })
      //         // 没有 children 并且自身没有 component 的，不显示
      //         .filter(r => r.children?.length || r.component)
      // }

      // return filterRoutes(this.routes, this.activeTab)

      // 去掉本身的顶级菜单
      const filterRoutes = (routes, group, parentPath = '', isRoot = true) => {
        const result = [];

        routes.forEach(route => {
          // 顶级判断 tabGroup，不匹配则跳过
          if (!route.meta || (isRoot && route.meta.tabGroup !== group)) return;

          const fullPath = `${parentPath}/${route.path}`.replace(/\/+/g, '/');

          if (route.children && route.children.length > 0) {
            // 递归过滤子路由
            const filteredChildren = filterRoutes(route.children, group, fullPath, false);

            if (isRoot) {
              // 顶级菜单不显示，直接展开子菜单作为一级菜单
              result.push(...filteredChildren);
            } else {
              // 非顶级保留当前菜单
              if (filteredChildren.length > 0) {
                result.push({
                  ...route,
                  path: fullPath,
                  label: route.meta.title,
                  icon: route.meta.icon,
                  routeName: route.name,
                  children: filteredChildren,
                });
              } else if (route.component) {
                result.push({
                  ...route,
                  path: fullPath,
                  label: route.meta.title,
                  icon: route.meta.icon,
                  routeName: route.name,
                  children: [],
                });
              }
            }
          } else if (route.component) {
            // 叶子节点直接加入
            result.push({
              ...route,
              path: fullPath,
              label: route.meta.title,
              icon: route.meta.icon,
              routeName: route.name,
            });
          }
        });

        return result;
      };

      return filterRoutes(this.routes, this.activeTab);
    }
  },
  beforeDestroy () {
    // 清除监听器
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    // 监听窗口尺寸变化
    handleResize () {
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this.windowWidth = window.innerWidth
        this.updateCollapseStatus()
      }, 100)  // 延迟100ms执行
    },

    // 根据窗口宽度判断是否折叠菜单
    updateCollapseStatus () {
      // 小于1440px时自动折叠菜单
      const shouldCollapse = this.windowWidth < 1440;
      // 如果当前的折叠状态与预期不一致，才进行更新
      if (this.collapse !== shouldCollapse) {
        this.$store.dispatch('settings/changeCollapse', shouldCollapse);
      }
    },

    // 递归查找路由记录的tabGroup
    findTabGroup (route) {
      if (!route) return null;
      if (route.meta && route.meta.tabGroup) return route.meta.tabGroup;

      // 如果路由有 matched 数组，向上找
      if (route.matched && route.matched.length > 0) {
        for (let i = route.matched.length - 1; i >= 0; i--) {
          const record = route.matched[i];
          if (record.meta && record.meta.tabGroup) return record.meta.tabGroup;
        }
      }
      return null;
    },
    // 点击tab切换
    handleTabClick (tab) {
      this.activeTab = tab.name
      if (tab.name == 'Index') {
        this.$router.push('/index').catch(() => { })
        this.$store.dispatch('settings/foldSideBar')  // 自动折叠
      } else {
        this.$store.dispatch('settings/openSideBar') //  展开
      }
    },
    // 点击菜单跳转
    handleMenuSelect (index) {
      // 菜单点击，做路由跳转或其他操作
      this.$router.push(index).catch(() => { })
    }
  },
  watch: {
    '$route' (to) {
      const tabGroup = this.findTabGroup(to);
      this.activeTab = to.meta?.affix ? 'Index' : tabGroup;
      if (to.meta?.affix) {
        this.$store.dispatch('settings/foldSideBar')  // 自动折叠
      } else {
        this.$store.dispatch('settings/openSideBar') //  展开
      }
    }
  }
}
</script>

<style scoped lang="scss">
@mixin active {
  &:hover {
    color: #1890ff !important;
    // background-color: $base-menu-background-active !important;
    background-color: #e8f4ff !important;
  }

  &.is-active {
    color: #1890ff !important;
    background-color: #e8f4ff !important;
  }
}

.side-bar-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: $base-z-index;
  width: $base-left-menu-width;
  height: 100vh;
  overflow: hidden;
  background: $base-color-white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  transition: width $base-transition-time;

  .logo-box {
    padding-right: 15px;
    padding-left: 6px;
    margin-left: 64px !important;
    color: #515a6e !important;
    background: $base-color-white !important;
    display: inline-block;
    margin-left: 5px;
    overflow: hidden;
    font-size: 20px;
    line-height: 55px;
    color: $base-color-white;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }

  .el-divider {
    margin: 5px 7px 25px 7px;
    width: 93%;
  }

  .el-divider__text {
    color: #515a6e;
  }

  .tab-icons {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    align-items: center;
    line-height: 30px;
    justify-content: center;
    font-size: 14px !important;

    svg {
      margin-top: 6px;

      &:hover {
        opacity: 1;
      }
    }
  }

  &.is-collapse {
    width: $base-left-menu-width-min;
    border-right: 0;

    ::v-deep {
      .el-menu {
        transition: width $base-transition-time;
      }

      .el-menu--collapse {
        border-right: 0;

        .el-submenu__icon-arrow {
          right: 10px;
          margin-top: -3px;
        }

        .el-menu-item,
        .el-submenu {
          text-align: center;
        }
      }
    }
  }

  ::v-deep {
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    .el-menu {
      border: 0;

      .vab-fas-icon {
        padding-right: 3px;
        font-size: $base-font-size-default;
        display: inline-block;
        width: 14px;
        margin-top: -2px;
      }

      .vab-remix-icon {
        padding-right: 3px;
        font-size: $base-font-size-default + 2;
      }
    }

    .el-menu-item,
    .el-submenu__title {
      height: $base-menu-item-height;
      line-height: $base-menu-item-height;
      vertical-align: middle;
    }

    .el-menu-item {
      @include active;
      min-width: auto;
      background-color: $base-color-white !important;
      color: #303133 !important;
      align-items: center;
    }
  }

  :deep(.el-tabs) {
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .el-tabs__nav.is-left {
      position: relative;
      padding-top: 55px;

      /* 给logo留空间 */
      &::before {
        cursor: default;
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 60px;
        background: url('~@/assets/logo.png') no-repeat center center;
        background-size: contain;
      }
    }

    .el-menu {
      background: transparent !important;
    }

    .el-submenu__title,
    .el-menu {
      background-color: $base-color-white !important;
      color: #303133 !important;
    }

    .el-submenu__title i {
      color: #303133 !important;
    }

    .el-tabs__active-bar {
      display: none;
    }

    .el-tabs__nav-wrap {
      margin-right: 0 !important;

      &.is-left::after {
        display: none;
      }
    }

    .el-tabs__header {
      background: #282c34 !important;
      height: 100vh;
      width: 66px;
      text-align: center;
      position: fixed;
      left: 0;

      &.is-left {
        margin-right: 0 !important;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .el-tabs__content {
      margin-left: 66px;
      min-height: 100vh;
    }

    .el-tabs__item {
      margin-bottom: 12px;
      border-radius: 5px;
      padding: 5px !important;
      width: 54px;
      height: 54px;
      text-align: center !important;
      color: $base-color-white;
      overflow: hidden;

      &.is-active {
        background: $base-color-blue;
      }
    }
  }
}
</style>
