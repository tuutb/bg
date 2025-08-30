<template>
  <div class="enterprise-info">
    <el-form :validate-on-rule-change="false" label-position="left" :model="enterpriseForm"
      :hide-required-asterisk="true" :show-message="false" :rules="rules" ref="enterpriseForm" label-width="140px"
      class="enterprise-ruleForm">
      <div class="form-title">企业信息</div>
      <div class="enterprise-form">
        <el-form-item :class="['flex3-2', { 'el-item-error': appealIsError }]" label="诉求">
          <div class="tag-box">
            <el-tag class="tag-box-item" :key="item.id" v-for="(item, index) in appealList" :closable="!isDetails"
              :disable-transitions="false" @close="handleClose(1, index)">
              <span>
                {{ item.name }}
              </span>
            </el-tag>
            <template v-if="!isDetails">
              <el-select v-model="enterpriseForm.appealList" v-if="appealListIsShow" @change="appealSelect"
                @visible-change="(e) => createdTag(1, e)" clearable>
                <el-option v-for="(item, index) in pullDownList.appealList" :key="index" :disabled="item.disabled"
                  :label="item.name" :value="item.id"></el-option>
              </el-select>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(1)">+创建标签</el-button>
            </template>
          </div>
        </el-form-item>
        <el-form-item prop="source" class="flex3-1" label="来源">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.source || '--' }}</p>
          <el-input placeholder="请输入" v-else v-model.trim="enterpriseForm.source" />
        </el-form-item>
        <template v-if="!$route.query.isEnterprise && appealIdList.includes(6)">
          <el-form-item prop="state" ref="state"
            :class="[isEdit ? enterpriseForm.isValid ? 'flex3-1' : enterpriseForm.state == 4 ? 'flex3-1' : 'flex3-2' : enterpriseForm.state == 4 ? 'flex3-2' : 'flex1']"
            label="报名状态">
            <template v-if="isDetails">
              {{ echoCustomerManaInfo.stateName }}
            </template>
            <template v-else>
              <el-select @change="stateChange" clearable v-model="enterpriseForm.state" placeholder="请选择">
                <template v-if="(!isSyncList && !isReview) || pageType == 2">
                  <el-option v-for="item in pullDownList.statusList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </template>
                <template v-else>
                  <el-option v-for="item in (isReview ? pullDownList.statusThreeList : pullDownList.statusTwoList)"
                    :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </template>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item v-if="enterpriseForm.state == (pageType == 2 ? 5 : 4)" ref="blacklistReason" class="flex3-1"
            prop="blacklistReason" label="原因">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.blacklistReason || '--' }}</p>
            <el-input placeholder="请输入" v-else v-model.trim="enterpriseForm.blacklistReason" />
          </el-form-item>
          <template v-if="isEdit">
            <el-form-item prop="isValid" ref="isValid" class="flex3-1" label="是否无效数据">
              <p class="echo-item" v-if="isDetails">
                {{ echoCustomerManaInfo.isValid == 1 ? '是' : '否' }}
              </p>
              <template v-else>
                <el-select @change="isValidChange" v-model="enterpriseForm.isValid" clearable placeholder="请选择">
                  <el-option v-for="item in boolenSelect" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </template>
            </el-form-item>
            <el-form-item v-if="enterpriseForm.isValid" ref="validReason" class="flex3-1" prop="validReason"
              label="无效原因">
              <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.validReason || '--' }}</p>
              <el-input placeholder="请输入" v-else v-model.trim="enterpriseForm.validReason" />
            </el-form-item>
          </template>
        </template>
        <template class="flex-three" v-if="fromType == 7">
          <el-form-item prop="settleOrder" class="flex3-1" label="落地订单">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.settleOrder || '--' }}</p>
            <el-input placeholder="请输入" v-else v-model.trim="enterpriseForm.settleOrder" />
          </el-form-item>
          <el-form-item prop="intentionLevel" class="flex3-1" label="意向落地程度">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.intentionLevel || '--' }}</p>
            <el-input placeholder="请输入" v-else v-model.trim="enterpriseForm.intentionLevel" />
          </el-form-item>
          <el-form-item prop="isCoordinate" class="flex3-1" label="需要配合">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.isCoordinate || '--' }}</p>
            <el-input placeholder="请输入" v-else v-model.trim="enterpriseForm.isCoordinate" />
          </el-form-item>
        </template>
        <!-- 诉求是落地选项 -->
        <template v-if="fromType != 7 && appealIdList.includes(1)">
          <el-form-item prop="sponsorId" ref="sponsorId" class="flex3-2" label="大赛">
            <el-select @change="sponsorIdChange(1)" filterable clearable :disabled="isDetails"
              v-model="enterpriseForm.sponsorId" placeholder="请选择">
              <el-option v-for="item in pullDownList.sponsorList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="localGovId" ref="localGovId" class="flex3-1" label="政府">
            <el-select @change="sponsorIdChange(2)" filterable :disabled="isDetails" clearable
              v-model="enterpriseForm.localGovId" placeholder="请选择">
              <el-option v-for="item in pullDownList.localGovList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <!-- 诉求是采购选项 -->
        <template v-if="appealIdList.includes(3)">
          <el-form-item prop="procurementProducts" class="flex3-2" label="采购产品">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.procurementProducts || '--' }}</p>
            <el-input placeholder="请输入采购产品" v-else v-model.trim="enterpriseForm.procurementProducts" />
          </el-form-item>
          <el-form-item prop="amountPurchased" class="flex3-1" label="采购量">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.amountPurchased || '--' }}</p>
            <el-input placeholder="请输入采购量" v-else v-model.trim="enterpriseForm.amountPurchased" />
          </el-form-item>
          <el-form-item prop="purchaseBudget" class="flex3-1" label="采购预算">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.purchaseBudget || '--' }}</p>
            <el-input placeholder="请输入采购预算" v-else v-model.trim="enterpriseForm.purchaseBudget" />
          </el-form-item>
          <el-form-item prop="purchaseTime" class="flex3-1" label="采购时间">
            <p class="echo-item" v-if="isDetails">{{ enterpriseForm.purchaseTime || '--' }}</p>
            <template v-else>
              <el-date-picker v-model="enterpriseForm.purchaseTime" type="date" value-format="yyyy-MM-dd"
                placeholder="选择日期时间">
              </el-date-picker>
            </template>
          </el-form-item>
          <el-form-item prop="purchaseObject" class="flex3-1" label="采购对象">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.purchaseObject || '--' }}</p>
            <el-input placeholder="请输入采购对象" v-else v-model.trim="enterpriseForm.purchaseObject" />
          </el-form-item>
        </template>
        <!-- 诉求是供应选项 -->
        <template v-if="appealIdList.includes(4)">
          <el-form-item prop="supplyProduct" class="flex3-1" label="供应产品">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.supplyProduct || '--' }}</p>
            <el-input placeholder="请输入供应产品" v-else v-model.trim="enterpriseForm.supplyProduct" />
          </el-form-item>
          <el-form-item prop="supplyObject" class="flex3-2" label="供应对象">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.supplyObject || '--' }}</p>
            <el-input placeholder="请输入供应对象" v-else v-model.trim="enterpriseForm.supplyObject" />
          </el-form-item>
        </template>
        <!-- 诉求是报名选项 -->
        <template
          v-if="(fromType == 7) || (appealIdList.includes(6) && enterpriseForm.state && (enterpriseForm.state < (pageType == 2 ? 4 : 3) || enterpriseForm.state == 7))">
          <el-form-item prop="upstreamSupplier" :class="['flex1']" label="企业上游供应方">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.upstreamSupplier || '--' }}</p>
            <el-input placeholder="请输入" v-else v-model.trim="enterpriseForm.upstreamSupplier" />
          </el-form-item>
          <el-form-item prop="downstreamDemandSide" class="flex1" label="企业下游需求方">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.downstreamDemandSide || '--' }}</p>
            <el-input placeholder="请输入" v-else v-model.trim="enterpriseForm.downstreamDemandSide" />
          </el-form-item>
          <el-form-item prop="productSuperiority" class="flex1" label="产品优势">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.productSuperiority || '--' }}</p>
            <el-input placeholder="请输入" v-else v-model.trim="enterpriseForm.productSuperiority" />
          </el-form-item>
          <el-form-item prop="competitor" class="flex1" label="竞争对手及优势">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.competitor || '--' }}</p>
            <el-input placeholder="请输入" v-else v-model.trim="enterpriseForm.competitor" />
          </el-form-item>
          <el-form-item prop="revenueStatus" class="flex1" label="营收现状">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.revenueStatus || '--' }}</p>
            <el-input placeholder="请输入" v-else v-model.trim="enterpriseForm.revenueStatus" />
          </el-form-item>
          <el-form-item prop="capacitySituation" class="flex1" label="产能情况">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.capacitySituation || '--' }}</p>
            <el-input placeholder="请输入" v-else v-model.trim="enterpriseForm.capacitySituation" />
          </el-form-item>
          <el-form-item prop="priceAdvantage" class="flex1" label="价格优势">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.priceAdvantage || '--' }}</p>
            <el-input placeholder="请输入" v-else v-model.trim="enterpriseForm.priceAdvantage" />
          </el-form-item>
          <el-form-item prop="costAdvantage" class="flex1" label="成本优势">
            <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.costAdvantage || '--' }}</p>
            <el-input placeholder="请输入" v-else v-model.trim="enterpriseForm.costAdvantage" />
          </el-form-item>
        </template>
        <el-form-item class="flex1 upload-box" label="附件">
          <div :class="['file-box', { 'down-file': isDetails }]" @click="downFile(item)"
            v-for="(item, index) in filePathList" :key="item.enclosureSrc">
            <span>{{ item.fileName }}</span>
            <span v-if="!isDetails" class="del" @click.stop="delFile(item, index)">x</span>
          </div>
          <el-upload v-if="!isDetails" ref="uploadButton" class="upload-img" name="multipartFile"
            :action="uploadFileUrl" multiple :limit="4" :show-file-list="false" :before-upload="beforeUpload"
            :on-success="uploadSuccess" :on-progress="uploadProgress">
            <el-button size="small" type="primary" class="addBtn-avatar">
              上传附件
            </el-button>
          </el-upload>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>

import { downloadEnclosure, } from '@/api/index'
export default {
  data () {
    return {
      enterpriseForm: {
        appealList: [],//诉求
        source: '',//来源
        state: '',//状态
        blacklistReason: "",//原因
        isValid: 0.,//是否无效数据
        validReason: '',//无效原因
        settleOrder: '',//落地订单
        intentionLevel: '',//意向落地程度
        isCoordinate: '',//需要配合
        sponsorId: '',//大赛
        localGovId: '',//政府
        procurementProducts: '',//采购产品
        amountPurchased: '',//采购量
        purchaseBudget: '',//采购预算
        purchaseTime: '',//采购时间
        purchaseObject: '',//采购对象
        supplyProduct: '',//供应产品
        supplyObject: '',//供应对象
        upstreamSupplier: "", //企业上游供应方
        downstreamDemandSide: "", //企业下游需求方
        productSuperiority: "", //产品优势
        competitor: "", //竞争对手及优势对比
        revenueStatus: "", //营收现状
        capacitySituation: "", //产能情况
        priceAdvantage: "", //价格优势
        costAdvantage: "", //成本优势
      },//企业信息

      uploadFileUrl: "/api/customerManage/uploadFile", //上传附件

      rules: {
        state: {
          required: true,
          message: "请选择报名状态",
          trigger: ["blur", "change"],
        },
        isValid: {
          required: true,
          message: "请选择是否无效数据",
          trigger: ["blur", "change"],
        },
        validReason: {
          required: true,
          message: "",
          trigger: ["blur", "change"],
        },
        blacklistReason: {
          required: true,
          message: "",
          trigger: ["blur", "change"],
        }
      },//校验规则
      appealList: [],//选中的诉求数据
      appealListIsShow: false,//诉求情况下拉是否显示
      appealIdList: [],//选中的诉求id
      boolenSelect: [
        //异地发展计划
        {
          id: 0,
          name: "否",
        },
        {
          id: 1,
          name: "是",
        },
      ],
      appealIsError: false,//诉求是否校验失败
      listDelete: [], //删除附件id集合
      filePathList: [],//附件
      isEdit: !!Number(this.$route.query.isEdit),//是否可以编辑
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
    fromType: {
      type: Number,
      default: 0,//页面来源 4：报名列表 7:项目落户-项目列表
    },
    echoCustomerManaInfo: {
      type: Object,
      default: () => { },//回显信息
    },
    pageType: {
      type: Number,
      default: 1,//1人才2电销
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
  watch: {
    'appealList.length': function (newVal, oldVal) {
      let isFinancing = false, isSettle = false;
      this.appealIdList = this.appealList.map(item => {
        if (item.id == 1) isSettle = true;
        if (item.id == 2) isFinancing = true;
        return item.id;
      }) || [];
      this.appealIsError = !this.appealIdList.length
      this.pullDownList.appealList = this.pullDownList.appealList.map(item => {
        item.disabled = this.appealIdList.includes(item.id);
        return item
      })
      this.$emit('changeAppeal', {
        isFinancing,
        isSettle
      })
    }
  },
  methods: {
    /**
    * 删除根据选项生成的标签
    * @param type 用于判断是哪个信息的标签
    * @param index 标签的下标
    */
    handleClose (type, index) {
      switch (type) {
        case 1:
          this.appealList.splice(index, 1)
          break;
      }
    },
    //显示用于生成标签的下拉框
    showInput (type) {
      switch (type) {
        case 1:
          this.appealListIsShow = true;
          break;
        case 2:
          break;
        case 3:
          break;
      }
    },
    //生成标签
    createdTag (type, e) {
      if (!e) {
        switch (type) {
          case 1:
            this.pullDownList.appealList.forEach((item, index) => {
              if (item.id == this.enterpriseForm.appealList) {
                item.disabled = true;
                this.appealList.push(item);
              }
            })
            this.enterpriseForm.appealList = '';
            this.appealListIsShow = false;
            break
        }
      }
    },
    //状态选择
    stateChange (e) {
      if (this.enterpriseForm.isValid == 1 && e != 3) {
        this.enterpriseForm.isValid = 0;
        this.enterpriseForm.validReason = "";
      } else if (e == 4) {
        this.enterpriseForm.blacklistReason = "";
      }
    },
    //无效数据选择
    isValidChange (e) {
      if (e) {
        this.enterpriseForm.state = 3;
        this.enterpriseForm.blacklistReason = "";
      }
    },
    //诉求下拉选择
    appealSelect (e) {
      //诉求与其他表单项的联动
      this.$nextTick(() => {
        if (this.appealIdList.includes(5)) {
          if (this.appealIdList[e.length - 1] == 5) {
            this.appealList = this.appealList.splice(this.appealList.length - 2, 1);
          } else {
            this.appealList = this.appealList.splice(-1);
          }
        }
      })
    },
    submitFormData () {
      let formData = {};
      this.$refs.enterpriseForm.validate(async (valid, fileds) => {
        if (valid) {
          formData = JSON.parse(JSON.stringify(this.enterpriseForm));
          formData.appealList = this.appealList.map(item => {
            return item.id;
          });
          // if (!formData.appealList.length) {
          //   // this.$message.error('请选择诉求!')
          //   this.$emit("integrationData", 2, formData, false);
          //   return false
          // }
          if (!formData.appealList.includes(6)) {
            formData.state = '';
            formData.blacklistReason = '';
            formData.isValid = 0;
            formData.validReason = '';
            if (this.fromType != 7) {
              formData.upstreamSupplier = ""; //企业上游供应方
              formData.downstreamDemandSide = ""; //企业下游需求方
              formData.productSuperiority = ""; //产品优势
              formData.competitor = ""; //竞争对手及优势对比
              formData.revenueStatus = ""; //营收现状
              formData.capacitySituation = ""; //产能情况
              formData.priceAdvantage = ""; //价格优势
              formData.costAdvantage = ""; //成本优势
            }
          }
          formData.filePathList = this.filePathList;
          formData.listDelete = this.listDelete;
          this.$emit("integrationData", 2, formData, true);
        } else {
          this.$emit("integrationData", 2, {}, false);
        }
      })
    },
    //大赛政府下拉选择
    sponsorIdChange (type) {
      if (type == 1) {
        this.enterpriseForm.localGovId = ''
      } else {
        this.enterpriseForm.sponsorId = ''
      }
    },
    //获取回显信息
    getEchoData (data) {
      this.enterpriseForm = Object.assign(this.enterpriseForm, data.enterpriseForm)
      this.filePathList = JSON.parse(JSON.stringify(data.filePathList || []));
      let appealList = [];
      this.pullDownList.appealList.forEach((itm, index) => {
        if (this.enterpriseForm.appealList.includes(itm.id)) {
          itm.disabled = true;
          appealList.push(itm);
        }
      })
      this.appealList = appealList;
    },
    uploadSuccess (res) {
      if (res.status == 200 && res.data) {
        this.filePathList = this.filePathList.concat(res.data);
      } else {
        this.$message.error(res.msg);
      }
      let _this = this;
      setTimeout(() => {
        _this.$refs.uploadButton.clearFiles();
      }, 5000);
    },
    //编辑上传的删除
    deleteEditIco (id, index) {
      this.listDelete.push(id);
      this.filePathList.splice(index, 1); //删除index为index,位置的数组元素
    },
    // 上传之前判断
    beforeUpload (file) {
      if (file.name && file.name.indexOf(".") > 0) {
        var infors =
          "JPG、JPEG、BMP、PNG、PDF、DOC/DOCX、PPT、PPTX,ZIP,RAR,XLSX/XLS,xlsx/xls";
        var typeName = file.name.split(".");
        typeName = typeName[typeName.length - 1];
        typeName = typeName.toUpperCase();
        if (infors.indexOf(typeName) < 0) {
          this.$message({
            message: "格式不正确",
            type: "warning",
          });
          return false;
        }
      }
      //上传文件不能超过4个
      if (this.filePathList.length > 3) {
        this.$message({
          message: "最多只能上传四个！",
          type: "warning",
        });
        return false;
      }
      const isLt4M = file.size / 1024 / 1024 < 50;
      if (!isLt4M) {
        this.$message.error("上传文件大小不能超过 50MB!");
      }
    },

    // 文件上传时的钩子
    uploadProgress (event, file) {
      if (event && event.percent) {
        this.$emit("getPercent", event.percent);
      }
    },
    //删除附件
    delFile (item, index) {
      if (item.id) {
        this.listDelete.push(item.id);
      }
      this.filePathList.splice(index, 1);

    },
    //下载附件
    async downFile (item) {
      if (this.operateType != 1) return
      if (item.id && !item.enclosureSrc.includes('http')) {
        let info = {
          params: { enclosureId: item.id },
        };
        const res = await downloadEnclosure(
          info
        );
        if (res.code == 200) {
          this.dataDownList = res.data;
          window.location.href = this.dataDownList;
        }
      } else {
        window.open(item.enclosureSrc);
      }
    },
    //同步创成汇项目数据
    synchronizeData (data) {
      const repeatArr = data.filePathList.filter(item2 =>
        !this.filePathList.some(item1 => item1.enclosureSrc === item2.enclosureSrc && item1.fileName === item2.fileName)
      );
      if (repeatArr.length) {
        this.filePathList.push(...repeatArr)
      }
      if ((this.fromType == 7) || (this.appealIdList.includes(6) && this.enterpriseForm.state && (this.enterpriseForm.state < (this.pageType == 2 ? 4 : 3) || this.enterpriseForm.state == 7))) {
        for (const key in data) {
          if (key == 'filePathList') break;
          if (typeof this.enterpriseForm[key] == 'object') {
            if (!this.enterpriseForm[key] || !this.enterpriseForm[key].length) {
              this.enterpriseForm[key] = data[key] || []
            }
          } else {
            this.enterpriseForm[key] = this.enterpriseForm[key] || data[key];
          }
        }
      }

    }
  },
}
</script>
<style lang="scss" scoped>
.enterprise-info {
  :deep(.el-form) {
    .enterprise-form {
      margin-top: 20px;
      border-right: 1px solid #f2f6fc;
      border-left: 1px solid #f2f6fc;
      border-bottom: 1px solid #f2f6fc;
      display: flex;
      flex-wrap: wrap;

      .el-input.is-disabled .el-input__inner,
      .el-textarea.is-disabled .el-textarea__inner {
        background-color: #fff;
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
          margin-top: 8px;

          &:hover {
            color: $base-color-default !important;
            background: #e2f1fc;
          }
        }
      }

      .upload-box {
        .el-form-item__content {
          padding-top: 8px;
          padding-left: 20px;
          display: flex;
          flex-wrap: wrap;

          .file-box {
            display: flex;
            align-items: center;
            line-height: 22px;
            height: 22px;
            margin-right: 30px;

            .del {
              display: inline-block;
              text-align: center;
              line-height: 16px;
              width: 16px;
              height: 16px;
              margin-left: 9px;
              color: $base-color-default;
              cursor: pointer;
            }
          }

          .down-file {
            color: $base-color-default;
            text-decoration: underline;
            cursor: pointer;
          }

          .upload-img {
            width: 80px;

            .el-upload {
              background: #e2f1fc;
              display: flex;
              align-items: center;

              .addBtn-avatar {
                padding: 0;
                color: $base-color-default;
                height: 22px;
                width: 80px;
                line-height: 22px;
                background-color: transparent;
                border: none;
                font-size: 12px;

                &:hover,
                &:focus {
                  background: #e2f1fc !important;
                  color: $base-color-default !important;
                  opacity: 1;
                }
              }
            }
          }
        }
      }

      .el-icon-date {
        display: none;
      }
    }
  }
}
</style>