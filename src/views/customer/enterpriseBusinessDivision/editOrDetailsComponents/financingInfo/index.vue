<template>
  <div class="financing-info">
    <el-form :validate-on-rule-change="false" label-position="left" :model="financingForm" :rules="rules"
      ref="financingForm" label-width="140px" class="financing-ruleForm">
      <div class="form-title">融资信息</div>
      <div class="financing-form">
        <el-form-item class="flex3-1" label="已融轮次">
          <p class="echo-item" v-if="isDetails">
            {{ echoCustomerManaInfo.financingRoundName || '--' }}
          </p>
          <template v-else>
            <el-select v-model="financingForm.financingRound" clearable placeholder="请选择">
              <el-option v-for="item in pullDownList.alreadyFinanceList" :key="item.id" :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item v-if="financingForm.financingRound && financingForm.financingRound != 1"
          prop="investmentOrganization" class="flex3-1" label="投资机构名称">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.investmentOrganization || '--' }}</p>
          <el-input class="address-detail" placeholder="请输入" v-else
            v-model.trim="financingForm.investmentOrganization" />
        </el-form-item>
        <el-form-item prop="financialDemand"
          :class="[financingForm.financingRound && financingForm.financingRound != 1 ? 'flex3-1' : 'flex3-2']"
          label="融资需求">
          <p class="echo-item" v-if="isDetails">
            {{ echoCustomerManaInfo.financialDemandName }}
          </p>
          <template v-else>
            <el-select v-model="financingForm.financialDemand" clearable placeholder="请选择">
              <el-option v-for="item in pullDownList.financeNeedList" :key="item.id" :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item prop="intendedFunds" class="flex3-1" label="意向资金">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.intendedFundsName || '--' }}
          </p>
          <template v-else>
            <el-select v-model="financingForm.intendedFunds" clearable placeholder="请选择">
              <el-option v-for="item in pullDownList.intendedFundsList" :key="item.id" :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item prop="wayFinancing"
          :class="[!financingForm.wayFinancing || financingForm.wayFinancing == 3 ? 'flex3-2' : 'flex3-1']"
          label="融资方式">
          <p class="echo-item" v-if="isDetails">
            {{ echoCustomerManaInfo.wayFinancingName || '--' }}
          </p>
          <template v-else>
            <el-select v-model="financingForm.wayFinancing" clearable placeholder="请选择">
              <el-option v-for="item in pullDownList.financingWayList" :key="item.id" :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <template v-if="financingForm.wayFinancing == 1">
          <el-form-item class="flex3-1" label="占股最小比列">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.capitalSideShareRatioMin || '--' }}</p>
            <el-input placeholder="请输入" v-model.trim="financingForm.capitalSideShareRatioMin" v-else @input="
              financingForm.capitalSideShareRatioMin = financingForm.capitalSideShareRatioMin.replace(
                /[^\d\.]/g,
                ''
              )
              ">
            </el-input>
          </el-form-item>
          <el-form-item class="flex3-1" label="占股最大比列">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.capitalSideShareRatioMax || '--' }}</p>
            <el-input placeholder="请输入" v-model.trim="financingForm.capitalSideShareRatioMax" v-else @input="
              financingForm.capitalSideShareRatioMax = financingForm.capitalSideShareRatioMax.replace(
                /[^\d\.]/g,
                ''
              )
              ">
            </el-input>
          </el-form-item>
          <el-form-item prop="investorExitMethod" class="flex3-1" label="投资退出方式">
            <div class="tag-box">
              <el-tag :key="item.id" v-for="(item, index) in investorExitMethod" :closable="!isDetails"
                :disable-transitions="false" @close="handleClose(1, index)">
                <span>
                  {{ item.name }}
                </span>
              </el-tag>
              <template v-if="!isDetails">
                <el-select v-model="financingForm.investorExitMethod" v-if="withdrawalWayIsShow"
                  @visible-change="(e) => createdTag(1, e)" clearable>
                  <el-option v-for="(item, index) in pullDownList.withdrawalWayList" :key="index"
                    :disabled="item.disabled" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(1)">+创建标签</el-button>
              </template>
            </div>
          </el-form-item>
          <el-form-item prop="minimumExitYears" label="最短退出年限">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.minimumExitYears || '--' }}</p>
            <el-input placeholder="请输入" v-else @input="
              financingForm.minimumExitYears = financingForm.minimumExitYears.replace(
                /[^\d\.]/g,
                ''
              )
              " v-model.trim="financingForm.minimumExitYears">
            </el-input>
          </el-form-item>
        </template>
        <template v-if="financingForm.wayFinancing == 2">
          <el-form-item prop="canBearHighestInterest" class="flex3-1" label="可承担最高利息">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.canBearHighestInterest ?
              echoCustomerManaInfo.canBearHighestInterest + '%年' : '--' }}</p>
            <el-input placeholder="请输入" v-else @input="
              financingForm.canBearHighestInterest = financingForm.canBearHighestInterest.replace(
                /[^\d\.]/g,
                ''
              )
              " v-model.trim="financingForm.canBearHighestInterest">
              <template slot="append">%年</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="durationCapitalOccupation" class="flex3-1 duration-box" label="资金占用时长">
            <p class="echo-item" v-if="isDetails">
              {{ echoCustomerManaInfo.canBearHighestInterest ?
                echoCustomerManaInfo.canBearHighestInterest + echoCustomerManaInfo.durationCapitalTime == 1 ? '年' :
                  echoCustomerManaInfo.durationCapitalTime == 1 ? '月' : '日' : '--' }}
            </p>
            <el-input placeholder="请输入" v-else v-model.trim="financingForm.durationCapitalOccupation">
              <template slot="append">
                <template v-if="isDetails">
                  {{ echoCustomerManaInfo.durationCapitalTime == 1 ? '年' : echoCustomerManaInfo.durationCapitalTime == 1
                    ? '月' : '日' }}
                </template>
                <template v-else>
                  <el-select v-model="financingForm.durationCapitalTime">
                    <el-option v-for="item in dateTypeList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </template>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="riskControlAvailable" class="flex3-1" label="可提供风控">
            <p class="echo-item" v-if="isDetails">
              {{ echoCustomerManaInfo.riskControlAvailableName || '--' }}
            </p>
            <template v-else>
              <el-select v-model="financingForm.riskControlAvailable" placeholder="请选择">
                <el-option v-for="item in pullDownList.pneumaticControlList" :key="item.id" :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item prop="sourceRepayment" class="flex3-1" label="还款来源">
            <p class="echo-item" v-if="isDetails">
              {{ echoCustomerManaInfo.sourceRepaymentName || '--' }}
            </p>
            <template v-else>
              <el-select v-model="financingForm.sourceRepayment" placeholder="请选择">
                <el-option v-for="item in pullDownList.sourceRepaymentList" :key="item.id" :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
        </template>
        <el-form-item class="flex1" label="融资计划描述">
          <p class="echo-item" v-if="isDetails">
            {{ echoCustomerManaInfo.financingPlanDescription || '--' }}
          </p>
          <el-input type="textarea" placeholder="请输入" :autosize="{ minRows: 1, maxRows: 8 }" :rows="1" v-else
            v-model="financingForm.financingPlanDescription"></el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      financingForm: {
        financingRound: '',//已融轮次
        financingPlanDescription: "", // 融资计划
        intendedFunds: [], // 意向资金
        wayFinancing: [], // 融资方式
        capitalSideShareRatioMin: "", // 资金方占股最小比例
        capitalSideShareRatioMax: "", // 资金方占股最大比例
        investorExitMethod: [], // 投资方退出方式
        minimumExitYears: "", // 最短退出年限
        canBearHighestInterest: "", // 可承担最高利息
        durationCapitalOccupation: "", // 资金占用时长
        riskControlAvailable: "", // 可提供风控
        sourceRepayment: "", // 还款来源
        durationCapitalTime: 1, //资金占用时长类型
        financialDemand: '',//融资需求
        investmentOrganization: "",//投资机构名称
      },//表单数据
      investorExitMethod: [], // 投资方退出方式
      withdrawalWayIsShow: false,//投资方退出方式下拉是否显示
      rules: {},//校验规则
      dateTypeList: [
        {
          name: "年",
          id: 1,
        },
        {
          name: "月",
          id: 2,
        },
        {
          name: "日",
          id: 3,
        },
      ], //时间类型下拉
    }
  },
  props: {
    pullDownList: {//下拉数据
      type: Object,
      default: () => { }
    },
    operateType: {
      type: [Number, String],
      default: 3,//1 详情 2编辑，3新增
    },
    echoCustomerManaInfo: {
      type: Object,
      default: () => { },//回显信息
    },
    isDetails: {
      type: Boolean,
      default: false,//是否详情
    }
  },
  methods: {
    submitFormData () {
      let formData = {};
      this.$refs.financingForm.validate(async (valid) => {
        if (valid) {
          formData = JSON.parse(JSON.stringify(this.financingForm)) || {};
          formData.investorExitMethod = this.investorExitMethod.map(item => {
            return item.id;
          });
          formData.investorExitMethod =
            formData.investorExitMethod.length > 0 ? formData.investorExitMethod.join(",") : "";
          this.$emit("integrationData", 4, formData, true);
        } else {
          this.$emit("integrationData", 4, {}, false);
        }
      })
    },
    //获取回显信息
    getEchoData (data) {
      this.financingForm = Object.assign(this.financingForm, data.financingForm);
      let investorExitMethod = [];
      this.pullDownList.withdrawalWayList.forEach((itm, index) => {
        if (this.financingForm.investorExitMethod.includes(itm.id)) {
          itm.disabled = true;
          investorExitMethod.push(itm);
        }
      })
      this.investorExitMethod = investorExitMethod;
    },
    /**
     * 删除根据选项生成的标签
     * @param type 用于判断是哪个信息的标签
     * @param index 标签的下标
     */
    handleClose (type, index) {
      switch (type) {
        case 1:
          let delEnterpriseObj = this.investorExitMethod.splice(index, 1)[0];
          this.pullDownList.withdrawalWayList = this.pullDownList.withdrawalWayList.map(item => {
            if (item.id == delEnterpriseObj.id) {
              item.disabled = false;
            }
            return item
          })
          break;
      }
    },
    //显示用于生成标签的下拉框
    showInput (type) {
      switch (type) {
        case 1:
          this.withdrawalWayIsShow = true;
          break;
      }
    },
    //生成标签
    createdTag (type, e) {
      if (!e) {
        switch (type) {
          case 1:
            this.pullDownList.withdrawalWayList.forEach((item, index) => {
              if (item.id == this.financingForm.investorExitMethod) {
                item.disabled = true;
                this.investorExitMethod.push(item);
              }
            })
            this.financingForm.investorExitMethod = '';
            this.withdrawalWayIsShow = false;
            break;
        }
      }
    },
    //同步创成汇项目数据
    synchronizeData (data) {
      for (const key in data) {
        if (typeof this.financingForm[key] == 'object') {
          if (!this.financingForm[key] || !this.financingForm[key].length) {
            this.financingForm[key] = data[key] || []
          }
        } else {
          this.financingForm[key] = this.financingForm[key] || data[key];
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.financing-info {
  :deep(.el-form) {
    .financing-form {
      margin-top: 20px;
      border-right: 1px solid #f2f6fc;
      border-left: 1px solid #f2f6fc;
      border-bottom: 1px solid #f2f6fc;
      display: flex;
      flex-wrap: wrap;

      .tag-box {
        display: flex;
        flex-wrap: wrap;
        padding-top: 8px;

        .el-tag {
          height: 22px;
          border-radius: 2px;
          background: #e2f1fc;
          text-align: center;
          color: $base-color-default;
          font-size: 12px;
          line-height: 22px;
          padding: 0 5px;
          border: none;
          margin-right: 10px;
          margin-bottom: 9px;
        }

        .el-select,
        .el-cascader {
          width: 200px;
          height: 22px;

          .el-input {
            line-height: 22px;
            height: 22px;
          }

          .el-input__inner {
            line-height: 22px;
            height: 22px;
            font-size: 12px;
          }

          .el-input__suffix {
            display: flex;
            align-items: center;
          }

          .el-cascader__search-input {
            line-height: 22px;
            margin: 0 !important;
          }

          .el-input--suffix .el-input__inner {
            line-height: 22px;
            height: 22px;
          }
        }

        .button-new-tag {
          height: 22px;
          border-radius: 2px;
          background: #e2f1fc;
          width: 80px;
          text-align: center;
          color: $base-color-default;
          font-size: 12px;
          line-height: 22px;
          padding: 0;
          border: none;
          margin-bottom: 9px;

          &:hover {
            color: $base-color-default !important;
            background: #e2f1fc;
          }
        }
      }
    }

    .duration-box {
      .el-input-group--append .el-input-group__append .el-select {
        width: 70px;

        .el-input__inner {
          padding-left: 20px;
        }
      }
    }
  }
}
</style>