<template>
  <div class="table-container">
    <div class="table-top-box">
      <el-input class="w150" v-model="queryForm.userName" maxlength="100" placeholder="名称" />
      <el-input class="w150" v-model="queryForm.companyName" maxlength="100" placeholder="公司名称" />
      <el-button type="primary" @click="handleQuery">查询</el-button>
    </div>


    <el-table border v-loading="loading" :data="dataList" :element-loading-text="'正在加载...'" :height="height">
      <el-table-column label="用户名称" prop="userName" show-overflow-tooltip min-width="80" />
      <el-table-column label="公司名称" prop="companyName" show-overflow-tooltip min-width="150" />
      <el-table-column label="国家标准行业" prop="nationalStandardIndustry" show-overflow-tooltip min-width="120" />
      <el-table-column label="企查查行业" prop="gccIndustry" show-overflow-tooltip min-width="120" />
      <el-table-column label="经营范围" prop="businessScope" show-overflow-tooltip min-width="150" />
      <el-table-column label="企业简介" prop="enterpriseProfile" show-overflow-tooltip min-width="150" />
      <el-table-column label="匹配分数" prop="matchScore" show-overflow-tooltip min-width="60" align="center" />
      <el-table-column label="创建时间" prop="createdAt" show-overflow-tooltip min-width="120" />
      <el-table-column label="更新时间" prop="updatedAt" show-overflow-tooltip min-width="120" />
      <el-table-column label="操作" show-overflow-tooltip min-width="50" align="center">
        <template #default="{ row }">
          <el-button type="text">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :background="true" :current-page="page" :layout="'total, sizes, prev, pager, next'"
      :page-size="limit" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" />
  </div>
</template>

<script>
import { matchRecord } from '@/api/index'

export default {
  filters: {
    statusFilter (status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger',
      }
      return statusMap[status]
    },
  },
  data () {
    return {
      limit: 20,
      page: 1,
      total: 0,//总数
      dataList: [],//列表数据
      loading: true,//加载
      queryForm: {
        userName: "",//用户名
        companyName: "",//公司名称
      }
    }
  },
  computed: {
    height () {
      return this.$baseTableHeight()
    },
  },
  created () {
    this.getData()
  },

  mounted () { },
  methods: {
    // 分页limit查询
    handleSizeChange (val) {
      this.limit = val
      this.getData()
    },

    // 分页切换
    handleCurrentChange (val) {
      this.page = val
      this.getData()
    },

    // 查询
    handleQuery () {
      this.page = 1
      this.getData()
    },

    // 获取数据
    async getData () {
      this.loading = true
      let info = {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.queryForm
        }
      }
      let res = await matchRecord(info)
      if (res.status == 200) {
        this.dataList = res.data.list;
        this.total = res.data.total
        this.loading = false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.table-top-box {
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;

  .w150 {
    width: 150px;
  }

}
</style>