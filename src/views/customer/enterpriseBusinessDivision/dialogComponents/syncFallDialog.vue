<!--
 * @Author: liuhui
 * @Date: 2023-04-28 10:39:16
 * @LastEditors: liuhui
 * @LastEditTime: 2023-07-28 16:57:40
 * @Description: 同步落地弹窗
-->
<template>
  <el-dialog class="sync-fall" title="同步落地" :visible.sync="syncFalllDialog" :close-on-click-modal="true"
    :before-close="handleClose" width="1000px">
    <div class="info-box">
      <p class="tt">项目信息：</p>
      <el-table ref="multipleTable" :data="landingDataList" :row-key="(row) => {
        return row.id;
      }
        " element-loading-text="请稍等..." element-loading-spinner="el-icon-loading">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="projectName" label="项目名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <em>{{ scope.row.projectName || "--" }}</em>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="企业名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <em>{{ scope.row.companyName || "--" }}</em>
          </template>
        </el-table-column>
        <el-table-column :prop="fromType == 1 ? 'projectFieldName' : 'projectField'" label="行业领域" show-overflow-tooltip>
          <template slot-scope="scope">
            <em v-if="fromType == 1">{{ scope.row.projectFieldName || "--" }}</em>
            <em v-else>{{ scope.row.projectField || "--" }}</em>
          </template>
        </el-table-column>
      </el-table>
      <div class="select-box">
        <div class="select-inner-box">
          <label>大赛：</label>
          <el-select @change="sponsorIdChange(1)" filterable clearable v-model="sponsorId" placeholder="请选择">
            <el-option v-for="item in pullDownList.sponsorList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="select-inner-box">
          <label>政府：</label>
          <el-select @change="sponsorIdChange(2)" filterable clearable v-model="localGovId" placeholder="请选择">
            <el-option v-for="item in pullDownList.localGovList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="sync-content">
        <span>同步内容：</span>
        <el-input rows="6" resize="none" type="textarea" placeholder="请输入" v-model.trim="syncContent" />
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { debounce } from "@/utils/common";
import { checkData, editProjectSyncGround } from '@/api/index'

export default {
  data () {
    return {
      projectList: [
        {
          id: 1,
          projectName: "项目名称",
          companyName: "企业名称",
        },
      ], //项目信息
      pullDownList: { sponsorList: [], localGovList: [] },//下拉数据
      localGovId: '',//政府id
      sponsorId: '',//大赛id
      syncContent: "", //同步内容
      competitionName: '',//大赛名称
      selectPage: 1,
    };
  },
  props: {
    syncFalllDialog: {
      type: Boolean,
      default: false,
    }, // 弹窗显隐
    landingDataList: {
      //同步落地数据
      type: Array,
      default: () => [],
    },
    syncFallList: {
      //同步落地id
      type: Array,
      default: () => [],
    },
    fromType: {
      //父组件类型 1投融部2项目部
      type: Number,
      default: 1,
    },
  },

  methods: {
    //获取下拉数据
    async getPullDownData () {
      const res = await checkData();
      if (res && res.status == 200 && res.data) {
        this.pullDownList = res.data;
      }
    },
    // 关闭弹窗
    handleClose () {
      this.syncContent = "";
      this.sponsorId = '';
      this.localGovId = '';
      this.$emit("update:syncFalllDialog", false);
    },

    // 点击确认按钮
    handleConfirm: debounce(function () {
      this.submit();
    }),

    //确认
    async submit () {
      this.$message.closeAll();
      if (!this.localGovId && !this.sponsorId) {
        this.$message.error('请选择大赛或政府')
        return
      }
      let req = {
        idList: this.syncFallList,
        syncContent: this.syncContent,
        localGovId: this.localGovId,
        sponsorId: this.sponsorId,
      };
      let api = "";
      switch (this.fromType) {
        // case 1:
        //   api = "/api/editDemandSyncGround";
        //   break;
        case 2:
          api = editProjectSyncGround;
          break;
        // case 3:
        //   api = "/api/editIntentionSyncGround";
        //   break;
      }
      let res = await api(req);
      if (res && res.status == 200) {
        this.$message.success(res.msg);
        this.handleClose();
        this.$emit("handelSuccess");
      }
    },

    //大赛政府下拉选择
    sponsorIdChange (type) {
      if (type == 1) {
        this.localGovId = ''
      } else {
        this.sponsorId = ''
      }
    }
  },
  watch: {
    syncFalllDialog (newVal) {
      if (newVal) this.getPullDownData()
    }
  }
};
</script>
<style lang="scss" scoped>
.sync-fall {
  .info-box {
    height: 55vh;
    overflow-y: auto;

    .tt {
      margin-bottom: 20px;
    }
  }

  .sync-content {
    display: flex;
    align-items: flex-start;

    >span {
      margin-top: 5px;
      display: inline-block;
      width: 70px;
    }
  }

  :deep(.el-textarea) {
    width: calc(100% - 100px) !important;

    .el-textarea__inner {
      width: 100%;
    }
  }

  .select-box {
    display: flex;
    margin: 20px 0;

    .select-inner-box {
      margin-right: 20px;
      display: flex;
      align-items: center;

      label {
        display: inline-block;
        width: 70px;
        text-align: right;
      }

      :deep(.el-select) {
        width: 300px;

        .el-input,
        .el-input__inner {
          width: 300px;
          line-height: 30px;
          height: 30px;
        }

        .el-input__suffix {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
