<template>
  <div id="tabs-bar-container" class="tabs-bar-container">
    <el-tabs v-model="tabActive" class="tabs-content" type="card" @tab-click="handleTabClick"
      @tab-remove="handleTabRemove">
      <el-tab-pane v-for="item in visitedRoutes" :key="item.path" :closable="!isAffix(item)" :label="item.meta.title"
        :name="item.path">
        <template #label>
          <!-- 如果路由有图标，则显示图标 -->
          <vab-icon v-if="item.meta.icon" :icon="['fas', item.meta.icon]" class="vab-fas-icon" />
          {{ item.meta.title }}
        </template>
      </el-tab-pane>
    </el-tabs>

    <el-dropdown @command="handleCommand">
      <span style="cursor: pointer">
        更多操作
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown" class="tabs-more">
        <el-dropdown-item command="closeOtherstabs">
          <vab-icon :icon="['fas', 'times-circle']" />
          关闭其他
        </el-dropdown-item>
        <el-dropdown-item command="closeLefttabs">
          <vab-icon :icon="['fas', 'arrow-alt-circle-left']"></vab-icon>
          关闭左侧
        </el-dropdown-item>
        <el-dropdown-item command="closeRighttabs">
          <vab-icon :icon="['fas', 'arrow-alt-circle-right']"></vab-icon>
          关闭右侧
        </el-dropdown-item>
        <el-dropdown-item command="closeAlltabs">
          <vab-icon :icon="['fas', 'ban']"></vab-icon>
          关闭全部
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import path from 'path'
import { mapGetters } from 'vuex'

export default {
  name: 'VabTabsBar',
  data () {
    return {
      affixtabs: [],
      tabActive: '',
    }
  },

  computed: {
    ...mapGetters({
      visitedRoutes: 'tabsBar/visitedRoutes',
      routes: 'routes/routes',
    }),
  },
  watch: {
    $route: {
      handler (route) {
        this.inittabs()
        this.addtabs()
        let tabActive = ''
        this.visitedRoutes.forEach((item, index) => {
          if (item.path === this.$route.path) {
            tabActive = item.path
          }
        })
        this.tabActive = tabActive
      },
      immediate: true,
    },
  },
  mounted () {
    //console.log(this.visitedRoutes);
  },
  methods: {
    async handleTabRemove (tabActive) {
      let view
      this.visitedRoutes.forEach((item, index) => {
        if (tabActive == item.path) {
          view = item
        }
      })
      const { visitedRoutes } = await this.$store.dispatch(
        'tabsBar/delRoute',
        view
      )
      if (this.isActive(view)) {
        this.toLastTag(visitedRoutes, view)
      }
    },
    handleTabClick (tab) {
      const route = this.visitedRoutes.filter((item, index) => {
        if (tab.index == index) return item
      })[0]
      if (this.$route.path !== route.path) {
        this.$router.push({
          path: route.path,
          query: route.query,
          fullPath: route.fullPath,
        })
      } else {
        return false
      }
    },
    isActive (route) {
      return route.path === this.$route.path
    },
    isAffix (tag) {
      return tag.meta && tag.meta.affix
    },
    filterAffixtabs (routes, basePath = '/') {
      let tabs = []
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tabs.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta },
          })
        }
        if (route.children) {
          const temptabs = this.filterAffixtabs(route.children, route.path)
          if (temptabs.length >= 1) {
            tabs = [...tabs, ...temptabs]
          }
        }
      })
      return tabs
    },
    inittabs () {
      const affixtabs = (this.affixtabs = this.filterAffixtabs(this.routes))
      for (const tag of affixtabs) {
        if (tag.name) {
          this.$store.dispatch('tabsBar/addVisitedRoute', tag)
        }
      }
    },
    addtabs () {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tabsBar/addVisitedRoute', this.$route)
      }
      return false
    },
    handleCommand (command) {
      switch (command) {
        case 'refreshRoute':
          this.refreshRoute()
          break
        case 'closeOtherstabs':
          this.closeOtherstabs()
          break
        case 'closeLefttabs':
          this.closeLefttabs()
          break
        case 'closeRighttabs':
          this.closeRighttabs()
          break
        case 'closeAlltabs':
          this.closeAlltabs()
          break
      }
    },
    async refreshRoute () {
      this.$baseEventBus.$emit('reloadrouter-view')
    },
    async closeSelectedTag (view) {
      const { visitedRoutes } = await this.$store.dispatch(
        'tabsBar/delRoute',
        view
      )
      if (this.isActive(view)) {
        this.toLastTag(visitedRoutes, view)
      }
    },
    async closeOtherstabs () {
      const view = await this.toThisTag()
      await this.$store.dispatch('tabsBar/delOthersRoutes', view)
    },
    async closeLefttabs () {
      const view = await this.toThisTag()
      await this.$store.dispatch('tabsBar/delLeftRoutes', view)
    },
    async closeRighttabs () {
      const view = await this.toThisTag()
      await this.$store.dispatch('tabsBar/delRightRoutes', view)
    },
    async closeAlltabs () {
      const view = await this.toThisTag()
      const { visitedRoutes } = await this.$store.dispatch(
        'tabsBar/delAllRoutes'
      )
      if (this.affixtabs.some((tag) => tag.path === view.path)) {
        return
      }
      this.toLastTag(visitedRoutes, view)
    },
    toLastTag (visitedRoutes, view) {
      const latestView = visitedRoutes.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView)
      } else {
        this.$router.push('/')
      }
    },
    async toThisTag () {
      const view = this.visitedRoutes.filter((item, index) => {
        if (item.path === this.$route.fullPath) {
          return item
        }
      })[0]
      if (this.$route.path !== view.path) this.$router.push(view)
      return view
    },
  },
}
</script>

<style lang="scss" scoped>
.tabs-bar-container {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  height: $base-tabs-bar-height;
  padding-right: $base-padding;
  padding-left: $base-padding;
  user-select: none;
  background: $base-color-white;
  border-top: 1px solid #f6f6f6;

  ::v-deep {
    .fold-unfold {
      margin-right: $base-padding;
    }
  }

  .tabs-content {
    width: calc(100% - 90px);
    height: $base-tag-item-height;

    ::v-deep {

      .el-tabs__nav-next,
      .el-tabs__nav-prev {
        height: $base-tag-item-height;
        line-height: $base-tag-item-height;
      }

      .el-tabs__header {
        border-bottom: 0;

        .el-tabs__nav {
          border: 0;
        }

        .el-tabs__item {
          height: 38px;
          padding: 0 30px 0 30px;
          margin-top: 3px;
          margin-right: -18px;
          line-height: 38px;
          text-align: center;
          border: 0;
          transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
          mask: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANoAAAAkCAYAAADvhSSyAAAACXBIWXMAAAsTAAALEwEAmpwYAAABbUlEQVR4nO3d4U3CUBSG4beJA9QNcAJhAtnAOoGOwCaOoBvoCDgBOIHdQDbAH7cJMaHtxcJB6/skJ6Thptw/H+cSktOCn5kCc+AWKJtraaxqYA28A8/N9cktgE9ga1n/tBYcqDhw/QtQHfoh0gitgdkpbrzg/N8klvWbKruz5Xa0CbAi/R6TtDMjdbdOF5k3qzBk0j4VRwzazbC9SKN1nbMo9+j4QTo+SvpuA1z2LcoN2nbYXqRR681R7tFR0gAGTQpg0KQABk0KYNCkAAZNCmDQpAAGTQpg0KQABk0KYNCkAAZNCmDQpAAGTQpg0KQABk0KYNCkAAZNGq4kjTRolRM0x31L3Sb0TMLKCZqTiaVu9/QErW+oyAQHp0p9NqRBqnXbgq6glcATdjQpRw1ctb3ZFrQSeAQejr8fabRegbvcxXPScfHcDxCwrL9YK/Y0qILdgwSnpNHfHhWl4ZbAW/O6LEgplHRC/mEtBfgClkhxraFbr7gAAAAASUVORK5CYII=);
          mask-size: 100% 100%;
          // mask: url(~@/assets/tab_select.png);

          &:hover {
            color: #000 !important;
            background: #dee1e6;
          }

          &.is-active {
            color: var($base-color-default) !important;
            background: #e8f4ff;

            &:hover {
              color: $base-color-default !important;
            }

            &.is-closable {
              padding: 0 30px 0 30px;
            }
          }
        }
      }
    }
  }

  .more {
    display: flex;
    align-content: center;
    align-items: center;
    cursor: pointer;
  }
}
</style>
