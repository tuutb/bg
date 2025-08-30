<template>
  <div class="coordination-model">
    <el-dialog title="项目配合" :visible.sync="coordinationDialog" :close-on-click-modal="true" :before-close="handleClose"
      width="540px">
      <el-form ref="form" :model="ruleForm" label-width="120px" :rules="rules">
        <div class="echo-item">
          <span class="label">申请人：</span>
          <span>{{ userInfo.username }}</span>
        </div>
        <div class="echo-item">
          <span class="label"> 配合公司/团队：</span>
          <div class="name-box">
            <span class="company-name" v-if="cooperateCompanyNameArr">{{ cooperateCompanyNameArr.join('，') }}</span>
          </div>
        </div>
        <el-form-item label="分配人员：" required>
          <el-cascader v-model="ruleForm.allocator" :options="collaboratoreUser" clearable filterable collapse-tags
            :props="{
              expandTrigger: 'hover',
              value: 'id',
              label: 'name',
              multiple: true,
            }"></el-cascader>
        </el-form-item>
        <el-form-item class="reason-box" label="配合内容：">
          <el-input type="textarea" rows="6" placeholder="请输入" v-model.trim="ruleForm.reason" resize="none" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { debounce } from "@/utils/common";
import { editProjectCoordinate, getDemandCoordinateUser } from '@/api/index'

export default {
  data () {
    return {
      ruleForm: {
        allocator: [], //分配人员
        reason: "", //配合内容
      }, //表单数据
      rules: {}, //校验规则
      collaboratoreUser: [],//项目分配人员
    };
  },
  props: {
    coordinationDialog: {
      type: Boolean,
      default: false,
    }, // 弹窗显隐
    coordinateProjectIdArr: {
      type: Array,
      default: () => [],
    }, // 需要配合项目id集合
    cooperateCompanyNameArr: {
      type: Array,
      default: () => [],
    }, // 需要配合项目公司名称集合
    fromType: {
      //父组件类型 1投融部2项目部3电销4业务5大赛分配列表
      type: Number,
      default: 1,
    },
  },
  computed: {
    // 获取用户信息
    userInfo () {
      let user = localStorage.getItem("userInfo")
      return user ? JSON.parse(user) : {}
    }
  },

  methods: {
    async getData () {
      let res = await getDemandCoordinateUser()
      if (res.status == 200) {
        this.collaboratoreUser = res.data
      }
    },

    //关闭弹窗
    handleClose () {
      this.ruleForm = {
        allocator: [], //分配人员
        reason: "", //配合内容
      };
      this.$emit("update:coordinationDialog", false);
    },

    // 点击确认按钮
    handleConfirm: debounce(function () {
      this.coordinationSubmit(); // 提交跟进记录
    }),
    //提交
    async coordinationSubmit () {
      let adminList = this.ruleForm.allocator.map((item) => {
        return item[1];
      });
      let req = {
        adminList: adminList,
        demandList: this.coordinateProjectIdArr,
        content: this.ruleForm.reason,
      };
      let api = "";
      switch (this.fromType) {
        // case 1:
        //   api = "/api/editDemandCoordinate";
        //   break;
        case 2:
          api = editProjectCoordinate;
          break;
        case 3:
        //   api = "/api/editIntentionCoordinate";
        //   break;
        // case 4:
        //   api = "/api/editBusinessCoordinate";
        //   break;
        // case 5:
        //   api = "/api/settleProjectCoordinate";
        //   break;
      }
      let res = await api(req);
      if (res && res.status == 200) {
        this.$message.closeAll();
        if (res.msg) this.$message.success(res.msg);
        this.handleClose();
        this.$emit("handelSuccess");
      }
    },
  },
  watch: {
    coordinationDialog (newVal) {
      if (newVal) {
        this.getData()
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.coordination-model {
  :deep(.el-form) {
    .echo-item {
      color: #999;
      margin-bottom: 17px;
      display: flex;
      justify-content: flex-start;

      .label {
        display: inline-block;
        text-align: right;
        width: 110px;
        color: #666;
        padding-right: 12px;
        font-size: 14px;
        flex-shrink: 0;
      }

      .name-box {
        max-width: calc(100% - 100px);
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        /* autoprefixer: ignore next */
        -webkit-box-orient: vertical;
        display: -moz-box;
        -moz-line-clamp: 4;
        -moz-box-orient: vertical;
        overflow-wrap: break-word;
        word-break: break-all;
        white-space: normal;
        overflow: hidden;
      }

      .company-name {
        margin-right: 10px;

        &:nth-last-of-type(1) {
          margin-right: 0;
        }
      }
    }

    .el-form-item {

      .el-cascader {
        width: 350px;
      }

      :deep(.el-form-item__label) {
        width: 72px;
        white-space: nowrap;
      }
    }
  }
}
</style>
