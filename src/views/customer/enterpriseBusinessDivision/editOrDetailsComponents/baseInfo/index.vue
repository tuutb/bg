<template>
  <div class="base-info">
    <el-form :validate-on-rule-change="false" label-position="left" :model="basicForm" :rules="rules"
      :hide-required-asterisk="true" :show-message="false" ref="basicForm" label-width="140px" class="basic-ruleForm">
      <div class="form-title">基础信息</div>
      <div class="basic-form">
        <el-form-item class="flex2-1 company-name" prop="companyName" label="企业名称">
          <p class="echo-item" v-if="isDetails">{{ basicForm.companyName || '--' }}</p>
          <el-input v-else v-model.trim="basicForm.companyName"
            @blur="blurCompanyName(basicForm.companyName)"></el-input>
        </el-form-item>
        <el-form-item class="flex2-1" label="企业地址">
          <div class="address-cascader">
            <p class="echo-item" v-if="isDetails"> {{ echoCustomerManaInfo.jointAddress || '--' }}</p>
            <template v-else>
              <el-cascader filterable clearable v-model="basicForm.city" :options="addressList" :props="{
                checkStrictly: true,
                expandTrigger: 'hover',
              }">
              </el-cascader>
              <el-input class="address-detail" placeholder="详细地址" v-model.trim="basicForm.address" />
            </template>
          </div>
        </el-form-item>
        <el-form-item class="flex2-1" label="企业资质">
          <div class="tag-box">
            <el-tag class="tag-box-item" :key="item.id" v-for="(item, index) in enterpriseList" :closable="!isDetails"
              :disable-transitions="false" @close="handleClose(1, index)">
              <span>
                {{ item.name }}
              </span>
            </el-tag>
            <template v-if="!isDetails">
              <el-select v-model="basicForm.enterpriseList" v-if="enterpriseIsShow"
                @visible-change="(e) => createdTag(1, e)" clearable>
                <el-option v-for="(item, index) in pullDownList[labelList]" :key="index" :disabled="item.disabled"
                  :label="item.name" :value="item.id"></el-option>
              </el-select>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(1)">+创建标签</el-button>
            </template>
          </div>
        </el-form-item>
        <el-form-item class="flex2-1" prop="responsibleNumber" label="承载账号">
          <p class="echo-item" v-if="isDetails">{{ basicForm.responsibleNumber || '--' }}</p>
          <el-input v-else v-model="basicForm.responsibleNumber"></el-input>
        </el-form-item>
        <el-form-item class="flex1" prop="companyIntroduction">
          <template #label><span v-if="pageType == 1" class="verification-icon">*</span>公司介绍</template>
          <p class="echo-item" v-if="isDetails"> {{ echoCustomerManaInfo.companyIntroduction || '--' }}</p>
          <el-input v-else type="textarea" resize="none" :rows="1" :autosize="{ minRows: 1, maxRows: 8 }"
            v-model="basicForm.companyIntroduction"></el-input>
        </el-form-item>
      </div>
      <div class="form-title">项目信息</div>
      <div class="project-form">
        <el-form-item class="flex1 project-name" label="项目名称">
          <div class="tag-box">
            <el-tag class="tag-box-item" :key="item.id" v-for="(item, index) in stageCheckList" :closable="!isDetails"
              :disable-transitions="false" @close="handleClose(2, index)">
              <span>
                {{ item.name }}
              </span>
            </el-tag>
            <template v-if="!isDetails">
              <el-select v-model="basicForm.stageCheckList" v-if="stageCheckIsShow"
                @visible-change="(e) => createdTag(2, e)" clearable>
                <el-option v-for="(item, index) in pullDownList.projectStageList" :key="index" :disabled="item.disabled"
                  :label="item.name" :value="item.id"></el-option>
              </el-select>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(2)">+创建标签</el-button>
            </template>
          </div>
          <p class="echo-item" v-if="isDetails"> {{ echoCustomerManaInfo.projectName || '--' }}</p>
          <el-input class="name" v-else @input="$emit('changeProjectName', basicForm.projectName)"
            v-model="basicForm.projectName" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item class="phase-box" label="项目阶段">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.phaseName || '--' }}</p>
          <template v-else>
            <el-select v-model="basicForm.phase" clearable>
              <el-option v-for="(item, index) in pullDownList.phaseList" :key="index" :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item class="project-field" prop="projectField" ref="projectField">
          <template #label><span v-if="pageType == 1" class="verification-icon">*</span>项目领域</template>
          <template v-if="isDetails">
            <div class="tag-box">
              <el-tag class="tag-box-item" :key="item.id"
                v-for="(item, index) in echoCustomerManaInfo.projectFieldNameList" :disable-transitions="false">
                <span>
                  {{ item }}
                </span>
              </el-tag>
            </div>
          </template>
          <template v-else>
            <el-cascader v-model="basicForm.projectField"
              :options="pageType == 3 ? pullDownList.fieldList : pullDownList.list" clearable filterable :props="{
                expandTrigger: 'hover',
                multiple: true,
                value: 'id',
                label: 'name',
              }"></el-cascader>
          </template>
        </el-form-item>
        <el-form-item class="flex1" label="项目简介">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.projectBrief || '--' }}</p>
          <el-input type="textarea" resize="none" v-else :autosize="{ minRows: 1, maxRows: 8 }" :rows="1"
            v-model="basicForm.projectBrief"></el-input>
        </el-form-item>
      </div>
      <div class="form-title">团队信息</div>
      <div class="team-form">
        <el-form-item class="flex3-1" prop="head" ref="head">
          <template #label><span v-if="pageType == 1" class="verification-icon">*</span>负责人姓名</template>
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.head || '--' }}</p>
          <el-input v-model="basicForm.head" v-else></el-input>
        </el-form-item>
        <el-form-item class="flex3-1" prop="job" ref="job">
          <template #label><span v-if="pageType == 1" class="verification-icon">*</span>负责人职位</template>

          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.jobName || '--' }}</p>
          <template v-else>
            <el-select v-model="basicForm.job" clearable>
              <el-option v-for="(item, index) in pullDownList.jobList" :key="index" :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item class="flex3-1" label="学历">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.eduBackground || '--' }}</p>
          <template v-else>
            <el-select v-model="basicForm.eduBackground" clearable>
              <el-option v-for="(item, index) in pullDownList.eduBackgroundList" :key="index" :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item class="talentlist-box flex1" prop="talentList" ref="talentList" label="人才资质">
          <template v-if="isDetails">
            <div class="tag-box">
              <el-tag class="tag-box-item" :key="item.id" v-for="(item, index) in echoCustomerManaInfo.talentNameList"
                :disable-transitions="false">
                <span>
                  {{ item }}
                </span>
              </el-tag>
            </div>
          </template>
          <template v-else>
            <el-cascader v-model="basicForm.talentList" @change="changeTalent"
              :options="pullDownList.talentCertificationList" clearable :props="{
                expandTrigger: 'hover',
                multiple: true,
                value: 'id',
                label: 'name',
              }"></el-cascader>
          </template>
        </el-form-item>
        <el-form-item v-if="isTalentVal" label="其他人才资质" prop="talentVal" class="flex1">
          <!-- 选中人才资质第四级时需要输入 -->
          <p class="echo-item" v-if="isDetails">{{ basicForm.talentVal || '--' }}</p>
          <el-input v-model.trim="basicForm.talentVal" class="talent-input" v-else placeholder="请输入市区级人才计划入选者及其他人才资质" />
        </el-form-item>
        <el-form-item class="flex1" label="一句话描述">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.oneDescription || '--' }}</p>
          <el-input v-else v-model="basicForm.oneDescription"></el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import areaData from "@/utils/countryData.js";
import { isRepetition, } from '@/api/index'

export default {
  data () {
    return {
      basicForm: {
        companyName: '',//企业名称
        city: [],//企业地址
        address: '',//详细地址
        enterpriseList: [],//企业资质
        responsibleNumber: this.$store.state.userInfo ? this.$store.state.userInfo.responsibleNumber : '',//承载账号
        state: '',//状态
        companyIntroduction: '',//公司介绍
        stageCheckList: [],//融资情况
        projectName: '',//项目名称
        phase: "",//项目阶段
        projectField: [],//项目领域数据
        projectBrief: '',//项目简介
        head: '',//负责人姓名
        job: '',//职位
        eduBackground: '',//学历
        talentList: [],//人才资质
        talentVal: '',//其他资质
        oneDescription: '',//一句话描述
      },//表单信息
      rules: {
        companyName: {
          required: true,
          message: "请输入公司/团队名称",
          trigger: ["blur", "change"],
        },
        head: {
          required: true,
          message: "请输入负责人姓名",
          trigger: ["blur", "change"],
        },
        job: {
          required: true,
          message: "请选择负责人职位",
          trigger: ["blur", "change"],
        },
        projectField: {
          required: true,
          message: "请选择项目领域",
          trigger: ["blur", "change"],
        }
      },//校验规则
      enterpriseIsShow: false,//企业资质下拉是否显示
      enterpriseList: [],//选中的企业资质
      addressList: areaData,//地址
      stageCheckIsShow: false,//项目融资情况下拉是否显示
      stageCheckList: [],//项目融资情况数据
      projectField: [],//项目领域数据
      projectFieldIsShow: false,//项目领域情况下拉是否显示
      isTalentVal: false,
      labelList: this.pageType == 3 ? 'enterpriseList' : 'labelList'
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
    pageType: {
      type: Number,
      default: 1,//1人才2电销3投融
    },
    isDetails: {
      type: Boolean,
      default: false,//是否详情
    },
    isReview: {
      type: Boolean,
      default: false,//是否报名审核列表
    },
    isSyncList: {
      type: Boolean,
      default: false,//是否是同步列表
    },
  },
  created () {
    if (this.pageType == 1) {
      this.rules.companyIntroduction = {
        required: true,
        message: "请输入公司介绍",
        trigger: ["blur", "change"],
      }
    }
  },
  methods: {
    /**
     * 验证重复公司名称
     * @param {string} data 公司名称
     */
    async blurCompanyName (data) {
      let rowId = this.$route.query.id || null;
      // 电销 暂时未处理
      if (this.pageType == 2) {
        // const res = await this.$axios.get("/api/judgeRepetition", {
        //   params: {
        //     id: rowId || "",
        //     companyName: data, // 公司名称
        //     type: this.$route.query.id ? 2 : 1,
        //   },
        // });
        // if (res && res.code == 200 && res.data) {
        //   this.$emit('checkCompanyName', res.data)
        // }
      } else {
        if (data && !this.isDetails) {
          let type = this.$route.query.type;
          const res = await isRepetition({
            params: {
              id: type == 4 ? this.basicForm.id : (rowId || null),
              companyName: data, // 公司名称
              type: this.$route.query.id ? 2 : 1,
            },
          });
          if (res && res.status == 200 && res.data) {
            this.$emit('checkCompanyName', res.data)
          }
        }
      }
    },

    /**
     * 删除根据选项生成的标签
     * @param type 用于判断是哪个信息的标签
     * @param index 标签的下标
     */
    handleClose (type, index) {
      switch (type) {
        case 1:
          let delEnterpriseObj = this.enterpriseList.splice(index, 1)[0];
          if (this.pullDownList[this.labelList]) {
            this.pullDownList[this.labelList] = this.pullDownList[this.labelList].map(item => {
              if (item.id == delEnterpriseObj.id) {
                item.disabled = false;
              }
              return item
            })
          }

          break;
        case 2:
          let delStageObj = this.stageCheckList.splice(index, 1)[0];
          this.pullDownList.projectStageList = this.pullDownList.projectStageList.map(item => {
            if (item.id == delStageObj.id) {
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
          this.enterpriseIsShow = true;
          break;
        case 2:
          this.stageCheckIsShow = true;
          break;
        case 3:
          this.projectFieldIsShow = true;
          break;
      }
    },
    //生成标签
    createdTag (type, e) {
      if (!e) {
        switch (type) {
          case 1:
            if (this.pullDownList[this.labelList]) {
              this.pullDownList[this.labelList].forEach((item, index) => {
                if (item.id == this.basicForm.enterpriseList) {
                  item.disabled = true;
                  this.enterpriseList.push(item);
                }
              })
            }

            this.basicForm.enterpriseList = '';
            this.enterpriseIsShow = false;
            break;
          case 2:
            if (this.pullDownList.projectStageList) {
              this.pullDownList.projectStageList.forEach((item, index) => {
                if (item.id == this.basicForm.stageCheckList) {
                  item.disabled = true;
                  this.stageCheckList.push(item);
                }
              })
            }

            this.basicForm.stageCheckList = '';
            this.stageCheckIsShow = false;
            break;
          case 3:
            this.basicForm.projectField = [];
            this.projectFieldIsShow = false;
            break;
        }
      }
    },
    // 选择人才资质
    changeTalent (val) {
      if (!val.length) {
        this.isTalentVal = false;
      }
      if (val && val.length) {
        for (let i = 0; i < val.length; i++) {
          val[i][0] == 4 ? (this.isTalentVal = true) : (this.isTalentVal = false);
        }
      }
      if (!this.isTalentVal) {
        this.basicForm.talentVal = "";
      }
    },
    //获取回显信息
    getEchoData (data) {
      this.basicForm = Object.assign(this.basicForm, data.basicForm)
      this.isTalentVal = data.isTalentVal
      let enterpriseList = [], stageCheckList = [];
      this.pullDownList[this.labelList].forEach((itm, index) => {
        if (this.basicForm.enterpriseList && this.basicForm.enterpriseList.length && this.basicForm.enterpriseList.includes(itm.id)) {
          itm.disabled = true;
          enterpriseList.push(itm);
        }
      })
      this.enterpriseList = enterpriseList;
      this.pullDownList.projectStageList.forEach((itm, index) => {
        if (this.basicForm.stageCheckList.length && this.basicForm.stageCheckList.includes(itm.id)) {
          itm.disabled = true;
          stageCheckList.push(itm);
        }
      })
      this.stageCheckList = stageCheckList;
    },
    submitFormData () {
      let formData = {};
      this.$refs.basicForm.validate(async (valid) => {
        if (valid) {
          formData = JSON.parse(JSON.stringify(this.basicForm));
          formData.enterpriseList = this.enterpriseList.map(item => {
            return item.id;
          });
          formData.stageCheckList = this.stageCheckList.map(item => {
            return item.id;
          })
          //项目领域数据处理
          if (formData.projectField.length) {
            formData.projectFieldLevelList = formData.projectField.map(item => {
              return {
                projectFieldId: item[0],
                [this.pageType == 1 ? 'projectFieldSecondId' : 'projectSecondFieldId']: item[1],
              }
            })
          }
          let area = this.basicForm.city;
          formData.provinces = area.length ? this.basicForm.city[0] : '';
          formData.city = area.length ? this.basicForm.city[1] || '' : '';
          formData.region = area.length ? this.basicForm.city[2] || '' : '';
          //人才资质数据处理
          if (formData.talentList && formData.talentList.length) {
            formData.talentList = formData.talentList.map((item) => {
              //人才资质父级id为4情况下添加自输入内容
              let talentCustom = "";
              if (item[0] == 4) {
                talentCustom = formData.talentVal;
              } else {
                talentCustom = "";
              }
              return {
                talentId: item[0],
                talentSecondId: item[1] || "",
                talentCustom: talentCustom,
              };
            });
          }
          switch (this.pageType) {
            case 2:
            case 3:
              formData.projectFieldList = formData.projectFieldLevelList;
              formData.stageList = formData.stageCheckList;
              formData.principalName = formData.head;
              formData.status = formData.state;
              delete formData.projectFieldLevelList;
              delete formData.stageCheckList;
              delete formData.head;
              delete formData.state;
              break;
          }
          this.$emit("integrationData", 1, formData, true);
        } else {
          this.$emit("integrationData", 1, {}, false);
        }
      })
    },
    // 设置数组类型的同步数据
    setSyncArrayData (arr, type) {
      let resArr = [];
      switch (type) {
        case 'enterpriseList':
          let enterpriseArr = this.enterpriseList.map(item => {
            return item.id
          })
          resArr = [...new Set([...arr, ...enterpriseArr])];
          break;
        case 'projectField':
          //从创成汇合并过来的所属领域为单选数组内最多存在一个元素
          if (arr && arr.length) {
            //判断是否重复如果重复则保留原来手动填写的数据不重复将合并
            let repeatArr = this.basicForm.projectField.filter(item => {
              return item[0] == arr[0][0] && item[1] == arr[0][1]
            })
            if (repeatArr.length) {
              resArr = this.basicForm.projectField
            } else {
              resArr = [...this.basicForm.projectField, arr[0]];
            }
          } else {
            resArr = this.basicForm.projectField
          }
          break;
        case 'talentList':
          if (arr && arr.length) {
            const repeatArr = arr.filter(item2 =>
              !this.basicForm.talentList.some(item1 => item1[0] === item2[0] && item1[1] === item2[1])
            );
            if (repeatArr.length) {
              resArr = [...this.basicForm.talentList, ...repeatArr];
            } else {
              resArr = this.basicForm.talentList
            }
          }
          break;
      }
      return resArr
    },
    //同步创成汇项目数据
    synchronizeData (data, isTalentVal) {
      if (!this.isTalentVal) {
        this.isTalentVal = isTalentVal;
      }
      for (const key in data) {
        //非基础数据进行特殊处理
        if (typeof this.basicForm[key] == 'object' || key == 'enterpriseList') {
          //为多选进行合并判断操作
          if (key == 'enterpriseList' || key == 'talentList' || key == 'projectField') {
            this.basicForm[key] = this.setSyncArrayData(data[key], key)
          } else {
            //单选保留手动填写数据
            this.basicForm[key] = this.basicForm[key] && this.basicForm[key].length ? this.basicForm[key] : data[key]
          }
        } else {
          this.basicForm[key] = this.basicForm[key] || data[key];
        }
      }
      let enterpriseList = [], stageCheckList = [];
      this.pullDownList[this.labelList].forEach((itm, index) => {
        if (this.basicForm.enterpriseList && this.basicForm.enterpriseList.length && this.basicForm.enterpriseList.includes(itm.id)) {
          itm.disabled = true;
          enterpriseList.push(itm);
        }
      })
      this.enterpriseList = enterpriseList;
      this.pullDownList.projectStageList.forEach((itm, index) => {
        if (this.basicForm.stageCheckList.length && this.basicForm.stageCheckList.includes(itm.id)) {
          itm.disabled = true;
          stageCheckList.push(itm);
        }
      })
      this.stageCheckList = stageCheckList;
    }
  },
}
</script>
<style lang="scss" scoped>
.base-info {
  :deep(.el-form) {

    .basic-form,
    .project-form,
    .team-form {
      margin-top: 20px;
      border-right: 1px solid #f2f6fc;
      border-left: 1px solid #f2f6fc;
      border-bottom: 1px solid #f2f6fc;
      display: flex;
      flex-wrap: wrap;

      .is-error .el-form-item__content .el-textarea .el-textarea__inner {
        border: 1px solid #f56c6c !important;
      }

      .tag-box {
        display: flex;
        flex-wrap: wrap;
        // padding-left: 20px;
        // padding-top: 8px;

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
          margin-top: 8px;
          margin-left: 0;
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
            margin: 1px !important;
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
          margin-top: 8px;

          &:hover {
            color: $base-color-default !important;
            background: #e2f1fc;
          }
        }
      }

      .address-cascader {
        display: flex;
        overflow: hidden;

        .el-cascader {
          width: calc(100% - 220px);
        }

        .address-detail {
          flex: 1;
        }
      }

      .company-name {
        .el-form-item__content {

          .el-input__inner,
          .echo-item {
            color: #333;
            font-weight: 700;
          }
        }
      }

      .project-name {
        display: flex;
        // flex-wrap: wrap;

        .el-form-item__content {
          display: flex;
          flex-wrap: wrap;

          .tag-box {
            .button-new-tag {
              margin-right: 10px;
            }
          }

          .name {
            width: 400px;

            .el-input__inner {
              color: #333;
              font-weight: 700;
            }
          }

          .echo-item {
            color: #333;
            font-weight: 700;
          }
        }
      }

      .project-field {
        width: 74.65%;
      }

      .talentlist-box,
      .project-field {
        .el-cascader {
          width: 100%;

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

            .el-tag__close {
              border-radius: 50%;
              text-align: center;
              position: relative;
              cursor: pointer;
              font-size: 12px;
              height: 16px;
              width: 16px;
              line-height: 16px;
              vertical-align: middle;
              top: 0;
              right: 0;
              background: unset;
              color: $base-color-default;

              &:hover {
                color: $base-color-white;
                background: $base-color-default;
              }
            }
          }
        }
      }

      .phase-box {
        width: 25.35%;
      }
    }
  }
}

.verification-icon {
  color: red;
  font-size: 12px;
  margin-right: 4px;
}
</style>