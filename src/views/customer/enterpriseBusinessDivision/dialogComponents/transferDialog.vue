<template>
  <!-- 转移 -->
  <el-dialog title="客户分配" :before-close="handleClose" :visible.sync="transferPopShow" width="510px">
    <el-form :rules="rules" ref="ruleForm">
      <el-form-item label="部门/人员：">
        <div class="info-box">
          <EmployeeList :apiUrl="getDeptTreeFn" @getemployeeListNew="getemployeeListNew" :model-value="deptNewId" />
          <el-select class="person-sel" v-model="transferId" placeholder="请选择人员" :disabled="!deptNewId">
            <el-option v-for="item in transferList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitSaveTra()">确认</el-button>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeList from '@/components/common/EmployeeList.vue' //部门人员下拉
import { getStaffByDept, transferCustomer, getDeptTree } from '@/api/index'

export default {
  components: {
    EmployeeList,
  },
  props: {
    transferPopShow: {
      type: Boolean,
      default: false
    }, // 弹窗显隐
  },
  data () {
    return {
      getDeptTreeFn: getDeptTree,//部门接口
      deptNewId: null,//部门id
      transferId: "", //转移id
      transferList: [], //转移列表
      rules: {},
    };
  },

  methods: {
    //所属部门组件方法
    getemployeeListNew (deptId) {
      // deptId就是子组件传过来的值
      this.deptNewId = deptId;
      if (deptId) this.getTransferList(deptId);
    },

    // 根据部门id请求员工列表
    async getTransferList (departmentId) {
      const res = await getStaffByDept({
        params: { departmentId },
      });
      if (res.status == 200) {
        this.transferList = res.data;
      }
    },

    //关闭导入弹窗
    handleClose () {
      this.$emit("update:transferPopShow", false);
    },

    // 转移客户
    async submitSaveTra () {
      this.$message.closeAll();
      if (!this.transferId) {
        this.$message({
          message: "请选择要分配客户的员工",
          type: "error",
        });
        return false;
      }
      const res = await transferCustomer({
        ids: list,
        transferId: this.transferId,
      });
      if (res.status == 200) {
        this.$message({
          message: res.msg,
          type: "success",
        });
        this.handleClose()
        this.$emit("handleSucessTransfer")
      }
    },
  },
  watch: {
    deptNewId (newVal) {
      if (!newVal) this.transferId = ''
    }
  }
};
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  &::before {
    position: absolute;
    content: "*";
    color: #ff5454;
    font-size: 12px;
    margin-left: -7px;
    margin-top: -2px;
  }
}

.info-box {
  display: flex;
  gap: 10px;

  .person-sel {
    width: 150px;

    :deep(.el-input) {
      height: 100%;

      .el-input__inner {
        height: 100%;

      }
    }

  }
}
</style>