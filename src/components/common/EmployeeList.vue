<template>
  <div class="custom-tree-add-depart">
    <treeselect :options="addMenuListDepart" v-model="deptId" placeholder="请选择部门" clearValueText="清除"
      :normalizer="normalizer" @input="addMenuLiSelect" :searchable="false" />
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: { Treeselect },
  props: {
    modelValue: {
      type: [String, Number, null],
      default: null,
    },
    apiUrl: {
      type: Function
    }
  },
  data () {
    return {
      addMenuListDepart: [], // 树形结构数据
      deptId: this.modelValue, // 用 props 初始化本地值
      normalizer (node) {
        return {
          id: node.id,
          label: node.deptName,
          children: node.sysDepartmentList || []
        }
      }
    }
  },
  created () {
    this.setSelData()
  },
  methods: {
    async setSelData () {
      const res = await this.apiUrl()
      if (res.status === 200) {
        this.addMenuListDepart = res.data
        this.$nextTick(() => {
          if (this.modelValue != null) {
            this.deptId = this.modelValue
          }
        })
      }
    },
    addMenuLiSelect () {
      // 更新父组件 v-model
      this.$emit('update:modelValue', this.deptId)
      // 触发自定义事件给父组件
      this.$emit('getemployeeListNew', this.deptId)
    }
  }
}
</script>

<style lang="scss">
.custom-tree-add-depart {
  width: 150px;
  height: 32px;

  .vue-treeselect {
    height: 100%;

    .vue-treeselect__control {
      height: 100%;

      .vue-treeselect__single-value {
        line-height: 30px
      }

      .vue-treeselect__placeholder {
        line-height: 30px
      }
    }
  }
}
</style>
