<template>
  <div v-if="themeBar">
    <vab-icon :icon="['fas', 'palette']" title="主题配置" @click="handleOpenThemeBar" />
    <div class="right-menu-bar" :class="{ 'open': isShowRight }">
      <div class="right-icon" @click="isShowRight = !isShowRight" :title="isShowRight ? '收缩' : '展开'">
        <vab-icon :icon="['fas', isShowRight ? 'angle-left' : 'angle-right']" />
      </div>
      <div class="theme-bar-setting" v-show="isShowRight">
        <div class="bar-item" @click="handleOpenThemeBar">
          <vab-icon :icon="['fas', 'palette']" />
          <p>主题配置</p>
        </div>
        <div class="bar-item" @click="$router.push('/index')" v-if="$route.path !== '/index'">
          <vab-icon :icon="['fas', 'home']" />
          <p>首页</p>
        </div>
      </div>
    </div>
    <el-drawer :visible.sync="drawerVisible" append-to-body direction="rtl" size="300px" title="主题配置">
      <el-scrollbar style="height: 80vh; overflow: hidden">
        <div class="el-drawer__body">
          <el-form ref="form" :model="theme" label-position="top">
            <!-- <el-form-item label="主题">
              <el-radio-group v-model="theme.name">
                <el-radio-button label="default">默认</el-radio-button>
                <el-radio-button label="green">绿荫草场</el-radio-button>
                <el-radio-button label="glory">荣耀典藏</el-radio-button>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item label="布局">
              <el-radio-group v-model="theme.layout">
                <el-radio-button label="vertical">纵向布局</el-radio-button>
                <el-radio-button label="horizontal">横向布局</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="头部">
              <el-radio-group v-model="theme.header">
                <el-radio-button label="fixed">固定头部</el-radio-button>
                <el-radio-button label="noFixed">不固定头部</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="多标签">
              <el-radio-group v-model="theme.tabsBar">
                <el-radio-button label="true">开启</el-radio-button>
                <el-radio-button label="false">不开启</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>

      <div class="el-drawer__footer">
        <el-button type="primary" @click="handleSaveTheme">保存</el-button>
        <el-button type="" @click="drawerVisible = false">取消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { layout as defaultLayout } from '@/config'

export default {
  name: 'VabThemeBar',
  data () {
    return {
      isShowRight: false,//右侧菜单是否展开
      drawerVisible: false,
      theme: {
        name: 'default',
        layout: '',
        header: 'fixed',
        tabsBar: '',
      },
    }
  },
  computed: {
    ...mapGetters({
      layout: 'settings/layout',
      header: 'settings/header',
      tabsBar: 'settings/tabsBar',
      themeBar: 'settings/themeBar',
    }),
  },
  created () {
    const handleTheme = () => {
      this.handleOpenThemeBar()
    }

    this.$baseEventBus.$on('theme', handleTheme)
    const theme = localStorage.getItem('vue-admin-better-theme')
    if (null !== theme) {
      this.theme = JSON.parse(theme)
      this.handleSetTheme()
    } else {
      this.theme.layout = this.layout
      this.theme.header = this.header
      this.theme.tabsBar = this.tabsBar
    }

    this.$once('hook:beforeDestroy', () => {
      this.$baseEventBus.$off('theme', handleTheme)
    })
  },
  methods: {
    ...mapActions({
      changeLayout: 'settings/changeLayout',
      changeHeader: 'settings/changeHeader',
      changeTabsBar: 'settings/changeTabsBar',
    }),
    handleIsMobile () {
      return document.body.getBoundingClientRect().width - 1 < 992
    },
    handleOpenThemeBar () {
      this.drawerVisible = true
    },
    handleSetTheme () {
      let { name, layout, header, tabsBar } = this.theme
      localStorage.setItem(
        'vue-admin-better-theme',
        `{
            "name":"${name}",
            "layout":"${layout}",
            "header":"${header}",
            "tabsBar":"${tabsBar}"
          }`
      )
      if (!this.handleIsMobile()) this.changeLayout(layout)
      this.changeHeader(header)
      this.changeTabsBar(tabsBar)
      document.getElementsByTagName('body')[0].className = `vue-admin-better-theme-${name}`
      this.drawerVisible = false
    },
    handleSaveTheme () {
      this.handleSetTheme()
    },
    handleSetDfaultTheme () {
      let { name } = this.theme
      document.getElementsByTagName('body')[0].classList.remove(`vue-admin-better-theme-${name}`)
      localStorage.removeItem('vue-admin-better-theme')
      this.$refs['form'].resetFields()
      Object.assign(this.$data, this.$options.data())
      this.changeHeader(defaultLayout)
      this.theme.name = 'default'
      this.theme.layout = this.layout
      this.theme.header = this.header
      this.theme.tabsBar = this.tabsBar
      this.drawerVisible = false
      location.reload()
    },

  },
}
</script>

<style lang="scss" scoped>
@mixin right-bar {
  width: 60px;
  min-height: 60px;
  text-align: center;
  cursor: pointer;
  background: $base-color-blue;
  border-radius: $base-border-radius;

  >div {
    padding-top: 10px;
    border-bottom: 0 !important;

    &:hover {
      opacity: 0.9;
    }

    &+div {
      border-top: 1px solid $base-color-white;
    }

    p {
      padding: 0;
      margin: 0;
      font-size: $base-font-size-small;
      line-height: 30px;
      color: $base-color-white;
    }
  }
}

.right-menu-bar {
  position: relative;
  position: fixed;
  right: 0px;
  width: 80px; // 面板宽度
  z-index: $base-z-index;
  top: calc((100vh - 110px) / 2);
  display: flex;
  transition: all 0.3s ease-in-out; // 加入过渡动画
  transform: translateX(calc(100% - 22px));
  align-items: center;
  min-height: 112px;

  &.open {
    transform: translateX(0px);
  }

  .right-icon {
    height: 60px;
    width: 18px;
    background: #eee;
    border-radius: 8px 0 0 8px;
    padding-left: 3px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;

    &:hover {
      background: #ddd;
    }

    svg {
      color: #ccc !important;
      font-size: 15px;
      margin-right: 0 !important
    }
  }

  .theme-bar-setting {
    @include right-bar;


    .bar-item {
      border-top: 0;
    }

    ::v-deep {
      svg:not(:root).svg-inline--fa {
        display: block;
        margin-right: auto;
        margin-left: auto;
        color: $base-color-white;
      }

      .svg-icon {
        display: block;
        margin-right: auto;
        margin-left: auto;
        font-size: 20px;
        color: $base-color-white;
        fill: $base-color-white;
      }
    }
  }

}

.el-drawer__body {
  padding: 20px;
}

.el-drawer__footer {
  border-top: 1px solid #dedede;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 10px 0 0 20px;
  height: 50px;
}
</style>
<style lang="scss">
.el-drawer__wrapper {
  outline: none !important;

  * {
    outline: none !important;
  }
}

.vab-color-picker {
  .el-color-dropdown__link-btn {
    display: none;
  }
}
</style>
