<template>
  <div class="table-container">
    <div class="top-box">
      <div class="left-box">
        <div class="depart">
          <div class="depart-tt">所属部门：</div>
          <EmployeeList :apiUrl="getDepartCurrTreeFn" @getemployeeListNew="getemployeeListNew" v-show="isShowDepartTree"
            :model-value="deptNewId" />
        </div>
        <el-select v-model="tabActive" class="select-info">
          <el-option v-for="(item, index) in tabData" :label="item.title" :value="item.value" :key="index"></el-option>
        </el-select>
        <div class="top-btn">
          <el-button type="primary">导入</el-button>
          <el-button type="primary" @click="handleTransfer">转移</el-button>
          <el-button type="primary" @click="handleToGround">同步落地</el-button>
          <el-button type="primary" @click="handelCoordinate">项目配合</el-button>
          <el-button type="primary" @click="goDetail(0, 3)">添加客户</el-button>
        </div>
      </div>
      <div class="right-box">
        <el-input class="w150" maxlength="50" @keyup.enter.native="searchEnter" v-model="searchForm.projectName"
          placeholder="项目名称" />
        <el-date-picker class="w230" v-model="searchForm.searchTime" type="daterange" range-separator="至"
          start-placeholder="录入时间" end-placeholder="更新时间" value-format="yyyy-MM-dd"></el-date-picker>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <div class="high-txt" @click="isAdvancedQuery = !isAdvancedQuery" title="高级查询">
          <vab-icon :icon="['fas', 'filter']" />
        </div>
      </div>
    </div>
    <el-table border class="custom-table" v-loading="loading" :data="pageData.list"
      @selection-change="handleSelectionChange" :element-loading-text="'正在加载...'" :height="height">
      <el-table-column type="selection" fixed width="55"></el-table-column>
      <el-table-column prop="projectName" fixed :label="'状态/项目名称'" min-width="200" :filters="statueList"
        :filter-multiple="false">
        <template slot-scope="scope">
          <div class="project-name">
            <div v-if="scope.row.state && scope.row.state != '--' && scope.row.state != 6"
              :class="[getColorName(scope.row.state), 'state-box']">
              <i v-if="scope.row.state == 1">
                了解中
              </i>
              <i v-if="scope.row.state == 3 && $route.query.tabType == 10">
                无意向
              </i>
              <i v-if="scope.row.state == 7">
                创建中
              </i>
              <i v-if="scope.row.state == 2">
                有意向
              </i>
              <i v-if="scope.row.state == 4">
                黑名单
              </i>
              <i v-if="scope.row.state == 5">
                未拨通
              </i>
            </div>
            <p :class="['project-txt', { w100: !scope.row.state }]" :title="scope.row.projectName">{{
              scope.row.projectName
              || '--' }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="'融资轮次/公司/团队名称'" prop="companyName" min-width="200" :filters="stageList"
        :filter-multiple="false">
        <template slot-scope="scope">
          <div class="company-name">
            <div :title="scope.row.stage" v-if="scope.row.stage && scope.row.stage != '--'" :class="['company-box']">
              {{ scope.row.stage }}
            </div>
            <p :class="['companyname-txt', { w100: !scope.row.stage }]" :title="scope.row.companyName">
              {{ scope.row.companyName || '--' }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="projectField" :formatter="row => row.projectField || '--'"
        label="项目领域" min-width="150"></el-table-column>
      <el-table-column prop="head" :label="'学历/负责人姓名'" min-width="200" :filters="eduList" :filter-multiple="false">
        <template slot-scope="scope">
          <div class="head-name">
            <div v-if="scope.row.eduBackground && scope.row.eduBackground != '--'" :class="['head-box']">
              {{ scope.row.eduBackground }}
            </div>
            <p :class="['head-txt', { w100: !scope.row.eduBackground }]" :title="scope.row.head">{{ scope.row.head ||
              '--' }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="appeal" :formatter="row => row.appeal || '--'" label="诉求"
        min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="phone" label="联系方式" min-width="150">
        <template slot-scope="scope">
          <el-tooltip placement="top">
            <div slot="content">
              <p>微信：{{ scope.row.wechatNumber }}</p>
              <!-- <template v-if="$getUserPermission('customerMana-phone')">
                <p :class="[{ 'blue cursor': scope.row.landline && scope.row.landline != '--' }]"
                  @click="handleCall(scope.row.id, scope.row.landline)">座机：{{ scope.row.landline }}</p>
                <p v-if="scope.row.isMulti && scope.row.isMulti != '--'" class="blue cursor"
                  @click="selectCall(scope.row.id, scope.row.phoneList)">电话：{{ scope.row.phone }}</p>
                <p v-else class="blue cursor" @click="handleCall(scope.row.id, scope.row.phone)">
                  电话：{{ scope.row.phone }}</p>
              </template> -->
              <template>
                <p>座机：{{ scope.row.landline }}</p>
                <p>电话：{{ scope.row.phone }}</p>
              </template>
              <p>QQ：{{ scope.row.qqNumber }}</p>
            </div>
            <span v-if="scope.row.wechatNumber && scope.row.wechatNumber != '--'">{{ scope.row.wechatNumber }}</span>
            <span v-else-if="scope.row.phone && scope.row.phone != '--'">{{ scope.row.phone }}</span>
            <span v-else-if="scope.row.landline && scope.row.landline != '--'">{{ scope.row.landline }}</span>
            <span v-else-if="scope.row.qqNumber && scope.row.qqNumber != '--'">{{ scope.row.qqNumber }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="oneDescription" :formatter="row => row.oneDescription || '--'"
        label="一句话描述" min-width="120">
      </el-table-column>
      <el-table-column align="center" label="异地发展计划" min-width="110">
        <template slot-scope="scope">
          {{ scope.row.isSettle == 1 ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="跟进记录" min-width="150">
        <template slot-scope="scope">
          <!-- <span class="check" v-if="
              scope.row.followUpText != '--' &&
              $getUserPermission(
                tableType == 1
                  ? 'customerBusiness-follow'
                  : 'customerMana-follow'
              )
            " @click="checkFollowUp(scope.row.id, scope.row.departmentId)">{{ scope.row.followUpText
            }}</span> -->
          <span>{{ scope.row.followUpText || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="followName" :formatter="row => row.followName || '--'" label="跟进人"
        min-width="130">
      </el-table-column>
      <el-table-column show-overflow-tooltip label="更新时间" min-width="120" prop="updateTime"></el-table-column>
      <el-table-column show-overflow-tooltip label="录入人" min-width="140" prop="adminName"></el-table-column>
      <el-table-column show-overflow-tooltip prop="createTime" label="录入时间" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip label="所属部门" min-width="140" prop="departmentName"></el-table-column>
      <el-table-column show-overflow-tooltip prop="source" :formatter="row => row.source || '--'" label="来源"
        min-width="110"></el-table-column>
      <el-table-column show-overflow-tooltip prop="dataSource" align="center" label="新增/认领" min-width="110">
        <template slot-scope="scope">
          <i v-if="scope.row.dataSource == 1"> 新增 </i>
          <i v-else> 认领 </i>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right" align="center">
        <template slot-scope="scope">
          <div class="operate-box">
            <div class="btn" @click="goDetail(scope.row.id, 1)">详情</div>
            <div class="btn" @click="goDetail(scope.row.id, 2)">编辑
            </div>
            <div class="btn" @click="handelCoordinate(scope.row)">项目配合</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :background="true" :current-page="page" :layout="'total, sizes, prev, pager, next'"
      :page-size="limit" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" />

    <!-- 高级查询 -->
    <SearchDialog :searchDialog.sync="isAdvancedQuery" :projectFieldList="projectFieldList"
      @handleFormClick="handleFormClick" />
    <!-- 项目配合 -->
    <CoordinationDialog :fromType="2" @handelSuccess="getData()" :coordinateProjectIdArr="coordinateProjectIdArr"
      :cooperateCompanyNameArr="cooperateCompanyNameArr" :coordinationDialog.sync="coordinationDialog" />
    <!-- 同步落地 -->
    <SyncFallDialog :syncFalllDialog.sync="syncFalllDialog" @handelSuccess="getData()"
      :landingDataList="landingDataList" :syncFallList="syncFallList" :fromType="2"></SyncFallDialog>
    <!-- 转移 -->
    <TransferDialog :transferPopShow.sync="transferPopShow" @handleSucessTransfer="getData()" />
  </div>
</template>

<script>
import { getCustomer, getDepartCurrTree, getSelectOption } from '@/api/index'
import EmployeeList from '@/components/common/EmployeeList.vue'
import CoordinationDialog from './dialogComponents/coordinationDialog.vue';//项目配合
import SyncFallDialog from './dialogComponents/syncFallDialog.vue';//同步落地
import TransferDialog from './dialogComponents/transferDialog.vue';//同步落地
import SearchDialog from './dialogComponents/searchDialog.vue';//查询
export default {
  components: {
    EmployeeList, CoordinationDialog, SyncFallDialog, TransferDialog, SearchDialog
  },
  data () {
    return {
      getDepartCurrTreeFn: getDepartCurrTree,//部门接口
      isShowDepartTree: false,//是否显示部门数级下拉
      tabActive: 1,
      tabData: [
        { title: "部门客户列表", type: 0, value: 1 },
        { title: "个人客户列表", type: 15, value: 2 },
        { title: "意向池", type: 6, value: 3 },
        { title: "黑名单", type: 15, value: 4 },
        { title: "报名列表", type: "", value: 5 },
        { title: "报名审核", type: "", value: 6 },
        { title: "历史记录", type: "", value: 7 },
      ],
      projectFieldList: [],//项目领域数据集合
      pageData: {},//整个数据
      loading: true,//加载
      limit: 20,
      total: 99,
      page: 1,
      isAdvancedQuery: false,//是否为高级查询
      searchForm: {
        projectName: "",//项目名称
        searchTime: [],//查询时间
      },//所有的搜索参数对象
      deptNewId: 1,//部门归属id 
      cooperateCompanyNameArr: [], //配合项目名称集合
      coordinateProjectIdArr: [], //配合项目id集合
      multipleSelection: [],
      coordinationDialog: false,//项目配合弹框
      landingDataList: [],//同步落地
      syncFallList: [], //同步数据id
      syncFalllDialog: false,//同步落地弹框
      transferPopShow: false, // 转移弹框
      handleTransList: [],//转移数据id
      statueList: [
        {
          value: 7,
          text: "A(创建中)",
        },
        {
          value: 2,
          text: "B(有意向)",
        },
        {
          value: 1,
          text: "C(了解中)",
        },
        // {
        //   value: 3,
        //   text: "无意向",
        // },
        {
          value: 4,
          text: "黑名单",
        },
        {
          value: 5,
          text: "未拨通",
        },
      ],
      stageList: [],//融资情况下拉
      eduList: [],//学历数据下拉
      tableHead: {},//表头字段
      allHead: true,// 表头是否全选
    }
  },
  computed: {
    height () {
      return this.$baseTableHeight();//表格高度
    },
  },
  created () {
    this.getSelectIfo()//获取下拉数据
    this.getData();//获取列表数据
  },
  mounted () {
    setTimeout(() => {
      this.isShowDepartTree = true
    }, 150);
  },
  methods: {
    // 获取子组件查询的数据
    handleFormClick (data) {
      this.searchForm = Object.assign({}, this.searchForm, data);
      this.handleQuery()
    },
    //回车键按下搜索
    searchEnter (e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode == 13) {
        this.handleQuery()
      }
    },

    // 列表选择框选择事件
    handleSelectionChange (val) {
      this.multipleSelection = val;
      this.landingDataList = [];
      this.cooperateCompanyNameArr = [];
      for (let index = 0; index < this.multipleSelection.length; index++) {
        this.landingDataList.push(this.multipleSelection[index]);
        this.cooperateCompanyNameArr.push(
          this.multipleSelection[index].companyName
        );
      }
    },

    // 转移
    handleTransfer () {
      this.$message.closeAll();
      let list = [];
      for (let index = 0; index < this.multipleSelection.length; index++) {
        list.push(this.multipleSelection[index].id);
      }
      if (!list.length) {
        this.$message.error("请选择目标转移客户数据");
        return false
      }
      this.handleTransList = list;
      this.transferPopShow = true;
    },

    //项目落地
    handleToGround () {
      this.$message.closeAll();
      let list = [];
      for (let index = 0; index < this.multipleSelection.length; index++) {
        list.push(this.multipleSelection[index].id);
      }
      if (this.landingDataList.length) {
        this.syncFallList = list;
        this.syncFalllDialog = true;
      } else {
        this.$message.error("请先勾选需要同步落地的项目");
      }
    },

    //项目配合
    handelCoordinate (item) {
      this.$message.closeAll();
      if (item) {
        this.cooperateCompanyNameArr = [item.companyName];
        this.coordinateProjectIdArr = [item.id];
      } else {
        var list = [];
        for (let index = 0; index < this.multipleSelection.length; index++) {
          list.push(this.multipleSelection[index].id);
        }
        this.coordinateProjectIdArr = list;
        if (!this.coordinateProjectIdArr.length) {
          this.$message.error("请先勾选需要配合的项目");
          return;
        }
      }
      this.coordinationDialog = true;
    },

    // 跳转详情
    goDetail (id, type) {
      if (id) {
        this.$router.push({
          path: 'enterpriseBusinessDivision/newEditOrDetails',
          query: {
            id: id,
            operateType: type,
            isEdit: 1
          }
        })
      } else {
        this.$router.push({
          path: 'enterpriseBusinessDivision/newEditOrDetails',
          query: {
            operateType: type,
            isEdit: 1
          }
        })
      }
    },

    //所属部门组件方法
    getemployeeListNew (deptId) {
      // deptId就是子组件传过来的值
      this.deptNewId = deptId;
    },

    // 获取数据下拉
    async getSelectIfo () {
      let res = await getSelectOption()
      if (res.status == 200 && res.data) {
        // 获取项目行业领域
        this.projectFieldList = res.data.projectFieldList || []
        // 获取融资状态
        if (res.data.stage && res.data.stage.length > 0) {
          let filtersData = res.data.stage.map(item => ({
            text: item.name,
            value: item.id
          }));
          this.stageList = filtersData;
        }
        // 获取学历
        if (res.data.edu.length > 0) {
          let filtersData2 = res.data.edu.map(item => ({
            text: item.label,
            value: item.value
          }));
          this.eduList = filtersData2;
        }
      }
    },

    //根据状态获取不同类名
    getColorName (type) {
      let classNmae = '';
      switch (type) {
        case 1:
          classNmae = 'purple-bg';
          break;
        case 2:
          classNmae = 'blue-bg';
          break;
        case 3:
        case 5:
          classNmae = 'red-bg';
          break;
        case 4:
          classNmae = 'grey-bg';
          break;
        case 7:
          classNmae = 'orange-bg';
          break;
      }
      return classNmae
    },

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
      let queryFormFiltered = { ...this.searchForm }
      delete queryFormFiltered.searchTime
      delete queryFormFiltered.projectField

      let info = {
        params: {
          page: this.page,
          limit: this.limit,
          ...queryFormFiltered,
          fromTime: this.searchForm.searchTime && this.searchForm.searchTime.length ? this.searchForm.searchTime[0] : '',
          toTime: this.searchForm.searchTime && this.searchForm.searchTime.length ? this.searchForm.searchTime[1] : '',
          projectFieldId: this.searchForm.projectField && this.searchForm.projectField.length ? this.searchForm.projectField[0] : 0,
          projectFieldSecondId: this.searchForm.projectField && this.searchForm.projectField.length ? this.searchForm.projectField[1] : 0,
        }
      }
      let res = await getCustomer(info)
      if (res.status == 200) {
        this.pageData = res.data;
        this.total = res.data.total;
        this.loading = false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.top-box {
  align-items: center;
  display: flex;
  padding-bottom: 20px;
  justify-content: space-between;

  .left-box {
    display: flex;
    align-items: center;

    .depart {
      display: flex;
      align-items: center;
      min-width: 220px;

      .depart-tt {
        display: inline-block;
        color: #666;
        font-size: 14px;
        line-height: 30px;
      }
    }


    .select-info {
      width: 150px;
      margin-left: 10px;
    }

    .top-btn {
      display: flex;
      align-items: center;
      margin-left: 10px;
    }
  }

  .right-box {
    display: flex;
    gap: 10px;
    align-items: center;

    :deep(.el-range-separator) {
      line-height: 26px;
      font-size: 12px;
    }

    .high-txt {
      cursor: pointer;

      svg {
        color: #999;

        &:hover {
          color: $base-color-default;
        }
      }
    }
  }
}



.filter-box {
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .left-box {
    width: 90%;
  }
}

.w150 {
  width: 150px;
}

.w230 {
  width: 230px;
}

.operate-box {
  display: flex;
  align-items: center;
  gap: 12px;

  .btn {
    font-size: 14px;
    cursor: pointer;
    color: $base-color-default;
  }
}

.company-name,
.head-name {
  display: flex;
  align-items: center;

  .company-box,
  .head-box {
    width: 70px;
    height: 20px;
    line-height: 20px;
    color: $base-color-default;
    background: #e1e8ff;
    font-size: 12px;
    text-align: center;
    margin-right: 6px;
    border-radius: 3px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .companyname-txt,
  .head-txt {
    width: calc(100% - 70px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.project-name {
  display: flex;
  align-items: center;

  .state-box {
    font-size: 12px;
    text-align: center;
    width: 52px;
    min-width: 52px;
    line-height: 20px;
    height: 20px;
    margin-right: 6px;
    border-radius: 3px;
    padding: 0 5px;

    i {
      font-style: normal;
    }
  }

  .project-txt {
    width: calc(100% - 52px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .purple-bg {
    background: #e9e1ff;
    color: #754cff;
  }

  .blue-bg {
    background: #e1e8ff;
    color: $base-color-default;
  }

  .red-bg {
    background: #ffdede;
    color: #ff5454;
  }

  .grey-bg {
    background: #e9e1ff;
    color: #754cff;
  }

  .orange-bg {
    background: #fff1e1;
    color: #ff9a4c;
  }
}

.w100 {
  width: 100% !important;
}

.choose-check {
  display: flex;
}
</style>