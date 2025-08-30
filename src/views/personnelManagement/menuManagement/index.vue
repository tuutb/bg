<template>
  <div class="menuManagement-container">
    <el-divider content-position="left">
      演示环境仅做基础功能展示，若想实现不同角色的真实菜单配置，需将settings.js路由加载模式改为all模式，由后端全面接管路由渲染与权限控制
    </el-divider>
    <el-row>
      <el-col :lg="4" :md="8" :sm="24" :xl="4" :xs="24">
        <!-- <el-tree
          :data="data"
          :default-expanded-keys="['root']"
          node-key="id"
          :props="defaultProps"
          @node-click="handleNodeClick"
        /> -->
        <el-tree :data="data" node-key="id" :props="defaultProps" :default-expanded-keys="['root']"
          :expand-on-click-node="false" highlight-current @node-click="handleNodeClick">
          <template #default="{ node, data }">
            <div class="custom-node" :class="{
              'is-root': node.level === 1,
              'is-leaf': node.isLeaf,
            }">
              <!-- 连接线区域 -->
              <span class="tree-lines" v-if="node.level > 1">
                <span class="line-vertical"></span>
                <span class="line-horizontal"></span>
              </span>

              <!-- 图标和文字 -->
              <i :class="getIconClass(data.permission)" class="node-icon"></i>
              <span class="node-label">{{ data.label }}</span>
            </div>
          </template>
        </el-tree>
      </el-col>
      <el-col :lg="20" :md="16" :sm="24" :xl="20" :xs="24">
        <vab-query-form>
          <vab-query-form-top-panel :span="12">
            <el-button icon="el-icon-plus" type="primary" @click="handleEdit">添加</el-button>
          </vab-query-form-top-panel>
        </vab-query-form>
        <el-table v-loading="listLoading" border :data="list" default-expand-all
          :element-loading-text="elementLoadingText" row-key="path"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
          <el-table-column label="name" prop="name" show-overflow-tooltip />
          <el-table-column label="路径" prop="path" show-overflow-tooltip />
          <el-table-column label="是否隐藏" show-overflow-tooltip>
            <template #default="{ row }">
              <span>
                {{ row.hidden ? '是' : '否' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="是否一直显示当前节点" show-overflow-tooltip>
            <template #default="{ row }">
              <span>
                {{ row.alwaysShow ? '是' : '否' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="vue文件路径" prop="component" show-overflow-tooltip />
          <el-table-column label="重定向" prop="redirect" show-overflow-tooltip />
          <el-table-column label="标题" prop="meta.title" show-overflow-tooltip />
          <el-table-column label="图标" show-overflow-tooltip>
            <template #default="{ row }">
              <span v-if="row.meta">
                <vab-icon v-if="row.meta.icon" :icon="['fas', row.meta.icon]" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="是否固定" show-overflow-tooltip>
            <template #default="{ row }">
              <span v-if="row.meta">
                {{ row.meta.affix ? '是' : '否' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="是否无缓存" show-overflow-tooltip>
            <template #default="{ row }">
              <span v-if="row.meta">
                {{ row.meta.noKeepAlive ? '是' : '否' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="badge" show-overflow-tooltip>
            <template #default="{ row }">
              <span v-if="row.meta">
                {{ row.meta.badge }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" show-overflow-tooltip width="200">
            <template #default="{ row }">
              <el-button type="text" @click="handleEdit(row)">编辑</el-button>
              <el-button type="text" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
import { getRouterList as getList } from '@/api/router'
import { doDelete, getTree } from '@/api/menuManagement'
import Edit from './components/MenuManagementEdit'

export default {
  name: 'MenuManagement',
  components: { Edit },
  data () {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      list: [],
      listLoading: true,
      elementLoadingText: '正在加载...',
      timeOutID: null,
    }
  },
  async created () {
    const roleData = await getTree()
    this.data = roleData.data
    this.fetchData()
  },

  beforeDestroy () {
    clearTimeout(this.timeOutID)
  },
  methods: {
    getIconClass (permission) {
      switch (permission) {
        case 'admin':
          return 'el-icon-user';
        case 'editor':
          return 'el-icon-edit';
        default:
          return 'el-icon-folder';
      }
    },
    handleEdit (row) {
      if (row.path) {
        this.$refs['edit'].showEdit(row)
      } else {
        this.$refs['edit'].showEdit()
      }
    },
    handleDelete (row) {
      if (row.id) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          const { msg } = await doDelete({ ids: row.id })
          this.$baseMessage(msg, 'success')
          this.fetchData()
        })
      }
    },
    async fetchData () {
      this.listLoading = true

      const { data } = await getList()
      this.list = data
      this.timeOutID = setTimeout(() => {
        this.listLoading = false
      }, 300)
    },
    handleNodeClick () {
      this.fetchData()
    },
  },
}
</script>
<style scoped lang="scss">
.custom-node {
  display: flex;
  align-items: center;
  position: relative;
  height: 30px;
}

.node-icon {
  margin-right: 6px;
  color: $base-color-default;
}

.node-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 连接线容器 */
.tree-lines {
  position: absolute;
  left: 0;
  top: 0;
  width: 20px;
  height: 100%;
}

/* 垂直线 */
.line-vertical {
  position: absolute;
  left: -10px;
  top: -13px;
  bottom: 0;
  width: 1px;
  border-left: 1px dashed #dcdfe6;
}

/* 横线 */
.line-horizontal {
  position: absolute;
  top: 50%;
  left: -9px;
  width: 10px;
  height: 1px;
  border-top: 1px dashed #dcdfe6;
  transform: translateY(-50%);
}

/* 顶级节点不显示线 */
.is-root .tree-lines {
  display: none;
}
</style>
