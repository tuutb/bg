<template>
  <div class="main-page">
    <div class="page-left-box">
      <div class="title-box">
        <div class="title">{{ projectName }}</div>
        <div class="nav-box">
          <el-button type="primary" v-if="operateType != 1" @click="handleSynchronous"
            class="synchronous-btn">同步</el-button>
          <el-button :type="navCur == item.id ? 'primary' : ''" @click="changeNavCur(item)" v-for="item in navList"
            :key="item.id">{{ item.name }}</el-button>
          <el-button v-if="isEdit" @click="changeOperateType" type="primary">{{ operateType == 1 ? '编辑' : operateType ==
            2 ?
            '保存' : '新增'
            }}</el-button>
        </div>
      </div>
      <div class="company-baseinfo">
        <div class="company-name company-item" v-if="$refs.baseInfoRef">
          <p><span class="verification-icon">*</span>公司/团队名称<el-button v-if="operateType == 3" type="primary"
              class="verification-btn"
              @click="blurCompanyName($refs.baseInfoRef.basicForm.companyName, true)">检测</el-button></p>
          <el-input :readonly="isDetails" @blur="blurCompanyName($refs.baseInfoRef.basicForm.companyName)"
            v-model.trim="$refs.baseInfoRef.basicForm.companyName"></el-input>
        </div>
        <div class="company-item">
          <p>座机号<el-button v-if="operateType == 3" type="primary" class="verification-btn"
              @click="blurPhone(baseInfoFrom.landline, 2, true)">检测</el-button></p>
          <el-input v-model="baseInfoFrom.landline" :readonly="isDetails"
            @blur="blurPhone(baseInfoFrom.landline, 2)"></el-input>
        </div>
        <div class="company-item">
          <p>微信</p>
          <el-input v-model="baseInfoFrom.wechatNumber" :readonly="isDetails"></el-input>
        </div>
        <div class="company-item">
          <p>手机号<el-button v-if="operateType == 3" type="primary" @click="blurPhone(baseInfoFrom.phone, 1, true)"
              class="verification-btn">检测</el-button></p>
          <el-input @input="baseInfoFrom.phone = baseInfoFrom.phone.replace(/[^\d]/g, '')" :readonly="isDetails"
            @blur="blurPhone(baseInfoFrom.phone, 1)" v-model.trim="baseInfoFrom.phone"></el-input>
        </div>
        <div class="company-item">
          <p>QQ</p>
          <el-input v-model="baseInfoFrom.qqNumber" :readonly="isDetails"></el-input>
        </div>
      </div>
      <div class="tab-box">
        <div :class="['tab-item', { 'tab-active': item.id == tabCur }]" v-for="item in tabList"
          @click="tabCur = item.id" :key="item.id">{{ item.name }}</div>
      </div>
      <div class="tab-content">
        <!-- 基本信息 -->
        <BaseInfoVue ref="baseInfoRef" :pullDownList="pullDownList" :operateType="operateType"
          :isCoordinate="isCoordinate" :isDetails="isDetails" :pageType="pageType" :isReview="isReview"
          :isSyncList="isSyncList" :echoCustomerManaInfo="echoCustomerManaInfo" @integrationData="integrationData"
          @changeProjectName="changeProjectName" @checkCompanyName="checkCompanyName"
          :companyName="baseInfoFrom.companyName" v-show="tabCur == 1"></BaseInfoVue>
        <!-- 企业信息 -->
        <InformationVue ref="informationRef" @changeAppeal="changeAppeal" :echoCustomerManaInfo="echoCustomerManaInfo"
          @integrationData="integrationData" :isDetails="isDetails" :pullDownList="pullDownList" :fromType="fromType"
          :isReview="isReview" :isSyncList="isSyncList" :pageType="pageType" :isCoordinate="isCoordinate"
          :operateType="operateType" v-show="tabCur == 2"></InformationVue>
        <!-- 落户信息 -->
        <SettleInfoVue ref="settleInfoRef" :echoCustomerManaInfo="echoCustomerManaInfo" :pullDownList="pullDownList"
          @integrationData="integrationData" :isCoordinate="isCoordinate" :isDetails="isDetails"
          :operateType="operateType" v-show="tabCur == 3"></SettleInfoVue>
        <!-- 融资信息 -->
        <FinancingInfoVue ref="financingInfoRef" :echoCustomerManaInfo="echoCustomerManaInfo"
          :pullDownList="pullDownList" @integrationData="integrationData" :isCoordinate="isCoordinate"
          :isDetails="isDetails" :operateType="operateType" v-show="tabCur == 4"></FinancingInfoVue>
      </div>
    </div>
    <div class="page-right-box">
      <FollowUpListVue ref="followUpList" :operateType="operateType" :pageType="1" @integrationData="integrationData" />
    </div>
  </div>
</template>
<script>
import { checkData, isRepetition, addCustomer, editCustomer, getCustomerProjectById, getCrmSyncCchData } from '@/api/index'
import BaseInfoVue from './editOrDetailsComponents/baseInfo/index.vue';//基本信息
import FollowUpListVue from './editOrDetailsComponents/followUplist/index.vue';//跟进记录
import InformationVue from './editOrDetailsComponents/information/index.vue';//企业详情
import SettleInfoVue from './editOrDetailsComponents/settleInfo/index.vue';//落户信息
import FinancingInfoVue from './editOrDetailsComponents/financingInfo/index.vue';//融资信息

export default {
  components: { BaseInfoVue, InformationVue, SettleInfoVue, FinancingInfoVue, FollowUpListVue },
  beforeRouteEnter (to, from, next) {
    // 动态修改 meta.title
    let val = Number(to.query.operateType)
    to.meta.title = val == 3 ? '企业事业部新增' : val == 2 ? '企业事业部编辑' : '企业事业部详情';  // 你可以根据实际业务来修改
    next();
  },

  data () {
    return {
      operateType: Number(this.$route.query.operateType) || 3,//1 详情 2编辑，3新增
      isEdit: Number(this.$route.query.isEdit) || 0,//是否可以编辑
      initTabList: [{
        name: '基础信息',
        id: 1,
        ifShow: true
      }, {
        name: '企业详情',
        id: 2,
        ifShow: true
      }, {
        name: '落户信息',
        id: 3,
        ifShow: false
      }, {
        name: '融资信息',
        id: 4,
        ifShow: false
      }, {
        name: '其他信息',
        id: 5,
        ifShow: false
      }],//信息类型
      navList: [{
        name: '人才需求',
        id: 1,
      }, {
        name: '落地需求',
        id: 2,
      }, {
        name: '投融需求',
        id: 3,
      }, {
        name: '企服需求',
        id: 4,
      }, {
        name: '投融资',
        id: 5,
      }, {
        name: '落地',
        id: 6,
      }],//页面类型
      navCur: 1,//当前页面类型id
      projectName: '',//项目名称
      baseInfoFrom: {
        landline: '',
        wechatNumber: '',
        phone: '',
        qqNumber: '',
        companyName: ''
      },//基础信息
      isDetails: false,//是否详情
      tabCur: 1,//当前信息类型
      pullDownList: {},//下拉数据
      isCoordinate: false, //是否配合
      pageType: 1,//1人才 2 电销 3投融
      isReview: false,//是否报名审核列表
      isSyncList: false,//是否是同步列表
      echoCustomerManaInfo: {},//回显信息
      rowId: this.$route.query.id || 0,//页面id
      fromType: 0,//页面来源 4：报名列表 7:项目落户-项目列表
      reviewId: 0,//审核id
      informationFormData: {},
      tabList: [],
      type: 2, //1：首页进入 2：客户列表非报名进入 3客户报名列表进入 4:报名审核 5：state(1)企业库 ，6：公共池企业 7：回收站 8：审核列表
    }
  },
  created () {
    this.setTabList()
    this.getPullDownData();
  },

  methods: {
    //设置展示的信息类型
    setTabList () {
      this.tabList = this.initTabList.filter(item => {
        return item.ifShow
      })
    },

    //修改诉求数据
    changeAppeal (item) {
      this.initTabList[2].ifShow = item.isSettle;
      this.initTabList[3].ifShow = item.isFinancing;
      this.setTabList()
    },

    // 获取下拉数据
    async getPullDownData () {
      // let api = this.pageType == 1 ? "/api/checkData" : this.pageType == 2 ? "/api/pullDownData" : "/api/getDemandData";
      let res = await checkData()
      if (res && res.status == 200 && res.data) {
        this.pullDownList = res.data;
        if (this.pullDownList.sponsorList) {
          this.pullDownList.sponsorList = this.pullDownList.sponsorList.filter(item => {
            return item
          })
        }
        // if (this.pageType == 2) {
        //   this.pullDownList.statusList =
        //     this.rowId && this.fromType == 2 ? res.data.statusList : res.data.statusTwoList;
        // } else if (this.pageType == 3) {
        //   this.pullDownList.projectStageList = this.pullDownList.stageList;
        //   this.pullDownList.talentCertificationList = this.pullDownList.certificationList
        // }
        this.pullDownList.talentCertificationList = this.getTreeData(
          this.pullDownList.talentCertificationList
        ); // 处理专业列表最后一级为空的情况
        if (this.rowId) {
          this.operateType = this.$route.query.operateType || 1;
          this.editEcho()
        }
      }
    },

    /**
    * 解决el-cascader控件最后一级暂无数据仍显示的问题
    * @param {Array} data 传入的数组
    */
    getTreeData (data) {
      if (data && data.length > 0) {
        data.forEach((item) => {
          if (item.children && item.children.length > 0) {
            this.getTreeData(item.children);
          } else {
            delete item.children;
          }
        });
      }
      return data;
    },

    //修改项目名称
    changeProjectName (name) {
      this.projectName = name;
    },

    /**
      * 获取子组件数据
      * @param index 判断是哪个子组件
      * @param data 表单数据
      * @param result 是否校验通过
      */
    integrationData (index, data, result) {
      if (!result) {
        this.validateResult = result;
        this.tabCur = index < 5 ? index : this.tabCur;
      }
      switch (index) {
        case 1:
          this.baseInfoFormData = data || {};
          break;
        case 2:
          this.informationFormData = data || {};
          //附件处理
          if (this.informationFormData.filePathList) {
            this.informationFormData.filePathList = this.informationFormData.filePathList.map(item => {
              return {
                enclosureSrc: this.$route.query.isEnterprise ? item.enclosureSrc : item.filePath || item.enclosureSrc,
                fileName: item.fileName,
                id: item.id,
              }
            })
          }
          this.listDelete = this.informationFormData.listDelete || []; //删除附件入参
          delete this.informationFormData.listDelete;
          break;
        case 3:
          this.settleInfoFormData = data
          break;
        case 4:
          this.financingInfoFormData = data || {};
          break;
        case 5:
          this.followUpList = data || [];
          break;
        default:
          break;
      }
    },
    //修改类型
    changeNavCur (item) {
      this.navCur = item.id
    },

    //校验重复后的处理
    checkCompanyName (data) {
      // 暂时没有处理
      // if (data.type == 1) {
      //   this.recoveryId = data.id;
      //   this.dataRecoveryDialog = true;
      // } else {
      //   this.claimId = data.id;
      //   this.automaticClaimVisible = true;
      // }
    },

    /**
      * 验证重复公司名称
      * @param {string} data 公司名称
      * @param {Boolean} isClick 是否是检测检验
    */
    async blurCompanyName (data, isClick = false) {
      this.$message.closeAll()
      let type = this.$route.query.type;
      if (data && this.operateType != 1) {
        let res = await isRepetition({
          params: {
            id: type == 4 ? this.reviewId : (this.rowId || ""),
            companyName: data, // 公司名称
            type: this.$route.query.id ? 2 : 1,
          },
        })
        if (res && res.status == 200) {
          if (res.data) {
            // 暂时没有处理
            // if (res.data.type == 1) {
            //   this.recoveryId = res.data.id;
            //   this.dataRecoveryDialog = true;
            // } else {
            //   this.claimId = res.data.id;
            //   this.automaticClaimVisible = true;
            // }
          } else if (isClick) {
            this.$message.success('暂无重复数据')
          }
        }
      }
    },

    /**
       * 验证重复手机号
       * @param {string} data 手机号
       * @param {number} type 类型1手机2座机
       * @param {Boolean} isClick 是否是检测检验
       */
    async blurPhone (data, type, isClick = false) {
      if (!data || this.operateType == 1) return
      let fromType = this.$route.query.type;
      const res = await isRepetition({
        params: {
          id: fromType == 4 ? this.reviewId : (this.rowId || ""),
          phone: type == 2 ? null : data, // 手机号码
          landline: type == 1 ? null : data,
          type: this.$route.query.id ? 2 : 1,
        },
      });
      if (res && res.code == 200) {
        if (res.data) {
          // 暂时没有处理
          // this.$message.closeAll()
          // if (res.data.type == 1) {
          //     this.recoveryId = res.data.id;
          //     this.dataRecoveryDialog = true;
          // } else {
          //     this.claimId = res.data.id;
          //     this.automaticClaimVisible = true;
          // }
        } else if (isClick) {
          this.$message.success('暂无重复数据')
        }
      }
    },

    /**
        * 人才编辑回显
        * @param editId 新增/恢复完成后调用回显接口所传id
        */
    async editEcho (editId) {
      let { type = 2, id, deptId, coordinateId, isEnterprise, rowId, isCoordinate = 1, operationId, relationId, isEdit = 0, settleId, isSettle, isFollowup = 0, gameType } = this.$route.query;
      this.isFollowup = isFollowup;
      this.gameType = Number(gameType);
      //只有新增/恢复完成后调用回显接口才会传editId
      id = editId ? editId : id;
      // 以下注释的暂时未处理
      // this.isCoordinate = isCoordinate == 2;
      if (this.isCoordinate) {
        //如果是配合信息可编辑
        // this.operateType = 2;
        // this.isDetails = false;
      } else {
        this.isDetails = this.operateType == 1;
      }
      let api = "";
      let params = {};

      // this.type = Number(type) || 2;
      // this.initTabList[4].ifShow = [1, 3, 4, 7, 8].includes(this.type);
      // if (this.type == 7 && this.$route.query.fromPage == 7) {
      //   this.initTabList[4].ifShow = false;
      // }
      if (this.pageType == 2) {
        // params = {
        //   id,
        //   type,
        //   operationId,
        //   relationId,
        // }
        // if (this.isCoordinate || coordinateId) {
        //   info.params.coordinateId = coordinateId;
        // }
        // api = this.isCoordinate
        //   ? "/api/getIntentionCoordinateDetails"
        //   : "/api/getTelemarketingIntentionDetails";
        // if (this.fromPage == 7) api = '/api/getIntentionGroundDetails'
      } else if (this.pageType == 1) {
        switch (Number(type)) {
          // case 1:
          //   api = "/api/getSendDuplicateDetails";
          //   params = {
          //     ccId: id,
          //     deptId,
          //     type,
          //   };
          //   break;
          case 2:
            // 回显接口
            api = getCustomerProjectById;
            params = {
              id,
            };
          //   if (this.isCoordinate) {
          //     api = "/api/getProjectCoordinateDetails";
          //   }
          //   if (isSettle == 1) {
          //     params.settleId = settleId;
          //     api = "/api/getProjectGroundDetailCoordinate"
          //   }
          //   if (coordinateId) {
          //     params.coordinateId = coordinateId;
          //   }
          //   break;
          // case 3:
          //   api = "/api/getOneSignUp";
          //   params = {
          //     id,
          //   };
          //   break;
          // case 4:
          //   api = "/api/examineDetail";
          //   params = {
          //     id,
          //   };
          //   break;
          // case 5:
          //   api = this.$route.query.isClaiming ? '/api/getProjectHistoryDetails' : "/api/getCustomerDataDetails";
          //   params = {
          //     id,
          //     state: 1,
          //   };
          //   break;
          // case 6:
          //   api = "/api/getCustomerDataDetails";
          //   params = {
          //     id,
          //     state: 2,
          //   };
          //   break;
          // case 7:
          //   this.fromType = 7;
          //   api = this.isEdit ? "/api/getProjectGroundDetail" : '/api/getValidDetails';
          //   params = {
          //     id,
          //   };
          //   break;
          // case 8:
          //   api = "/api/getValidExamineDetails";
          //   params = {
          //     id,
          //     examineId: rowId,
          //   };
          //   break;
          default:
            break;
        }
      } else if (this.pageType == 3) {
        // api =
        //   this.fromPage == 2 ? "/api/getDemandCoordinateDetails" : this.fromPage == 7 ? '/api/getDemandGroundDetails' : "/api/getDemandDetails";
        // params.id = id;
        // if (this.isCoordinate || coordinateId) {
        //   params.coordinateId = coordinateId;
        // }
      }

      // if (isEnterprise == 1) {
      //   api = "/api/getEnterpriseDemand"
      // } else if (isEnterprise == 2) {
      //   api = '/api/getSupplyChain';
      // }
      let res = await api({ params });
      if (res && res.status == 200) {
        // if ((this.type > 4 && this.type != 7) || (this.type == 7 && this.$route.query.fromPage != 7)) {
        //   res.data.projectDetailsOneVo = res.data.dataDetailsOneVo || {};
        //   res.data.projectDetailsTwoVo = res.data.dataDetailsTwoVo || {}
        // }
        // if (isEnterprise) {
        //   res.data.projectDetailsOneVo = res.data.oneVo || {};
        //   res.data.projectDetailsTwoVo = res.data.twoVo || {}
        // }
        // if (this.isFollowup) {
        //   this.projectExamineVo = res.data.projectExamineVo;
        // }
        this.echoDataTackle(res.data)
      }
    },
    //回显数据处理
    echoDataTackle (echoData) {
      //跟进记录处理
      let followUpListArr = echoData.followUpList || [];
      let projectDetailsOneVo = echoData.projectDetailsOneVo;
      let projectDetailsTwoVo = echoData.projectDetailsTwoVo;
      this.navCur = projectDetailsOneVo.needType;
      // 暂未处理
      // if (this.pageType == 2 || this.pageType == 3) {
      //   if (this.pageType == 2) {
      //     projectDetailsOneVo = echoData.intentionDetailsOneVo;
      //     projectDetailsTwoVo = echoData.intentionDetailsTwoVo;
      //     followUpListArr = echoData.intentionDetailsOneVo.followUpList || [];
      //   } else {
      //     projectDetailsOneVo = echoData.demandDetailsOneVo || {};
      //     projectDetailsTwoVo = echoData.demandDetailsTwoVo || {};
      //     followUpListArr = echoData.demandDetailsOneVo.followUpList || [];
      //   }
      //   echoData.filePathList = projectDetailsOneVo.fileJson
      //     ? JSON.parse(projectDetailsOneVo.fileJson)
      //     : [];
      //   projectDetailsOneVo.qqNumber = projectDetailsOneVo.qq
      //   projectDetailsOneVo.wechatNumber = projectDetailsOneVo.wechat
      //   projectDetailsOneVo.head = projectDetailsOneVo.principalName
      //   projectDetailsOneVo.stageCheckList = projectDetailsOneVo.stageList || [];
      //   projectDetailsOneVo.eduBack = projectDetailsOneVo.eduBackground
      //   projectDetailsOneVo.state = projectDetailsOneVo.status
      // }
      // if (this.$route.query.isEnterprise) {
      //   projectDetailsOneVo.qqNumber = projectDetailsOneVo.qq
      //   projectDetailsOneVo.wechatNumber = projectDetailsOneVo.wechat
      //   projectDetailsOneVo.head = projectDetailsOneVo.principalName
      //   projectDetailsOneVo.stageCheckList = projectDetailsOneVo.stageList || [];
      //   projectDetailsOneVo.eduBack = projectDetailsOneVo.eduBackground
      //   projectDetailsOneVo.state = projectDetailsOneVo.status
      //   echoData.filePathList = projectDetailsOneVo.fileVoList || [];
      //   followUpListArr = echoData.projectDetailsOneVo.followUpList
      // }
      this.$refs.followUpList.getEchoData({
        followUpListArr,
      })
      //基础信息
      //城市信息回显
      let city = projectDetailsOneVo.region ? [projectDetailsOneVo.provinces, projectDetailsOneVo.city, projectDetailsOneVo.region] : projectDetailsOneVo.city ? [projectDetailsOneVo.provinces, projectDetailsOneVo.city] : projectDetailsOneVo.provinces ? [projectDetailsOneVo.provinces] : [];
      this.baseInfoFrom = {
        landline: projectDetailsOneVo.landline,
        wechatNumber: projectDetailsOneVo.wechatNumber,
        phone: projectDetailsOneVo.phone,
        qqNumber: projectDetailsOneVo.qqNumber,
      }
      let basicForm = {
        id: projectDetailsOneVo.id,
        companyName: projectDetailsOneVo.companyName,
        city,
        responsibleNumber: projectDetailsOneVo.responsibleNumber,
        address: projectDetailsOneVo.address,
        enterpriseList: projectDetailsOneVo.enterpriseList,
        state: projectDetailsOneVo.state,
        companyIntroduction: projectDetailsOneVo.companyIntroduction,
        stageCheckList: projectDetailsOneVo.stageList || [],
        projectName: projectDetailsOneVo.projectName,
        phase: projectDetailsOneVo.phase,
        projectBrief: projectDetailsOneVo.projectBrief,
        head: projectDetailsOneVo.head,
        job: projectDetailsOneVo.job,
        eduBackground: projectDetailsOneVo.eduBack,
        oneDescription: projectDetailsOneVo.oneDescription,
      }
      this.projectName = projectDetailsOneVo.projectName;
      //项目领域回显数据处理
      let projectFieldList = projectDetailsOneVo.projectFieldList;
      basicForm.projectField = [];
      if (projectFieldList && projectFieldList.length) {
        projectFieldList.forEach((item) => {
          if (this.$route.query.isEnterprise) {
            basicForm.projectField.push([
              item.projectFieldId,
              item.projectSecondFieldId,
            ]);
          } else {
            basicForm.projectField.push([
              item.projectFieldId,
              item.projectFieldSecondId,
            ]);
          }

        });
      }
      //人才资质处理
      let isTalentVal = false;
      let talentList = projectDetailsOneVo.talentList;
      basicForm.talentList = [];
      if (talentList && talentList.length) {
        basicForm.talentList = talentList.map((item) => {
          if (item.talentCustom) {
            basicForm.talentVal = item.talentCustom;
            isTalentVal = true;
            return [item.talentId];
          } else {
            return [item.talentId, item.talentSecondId];
          }
        });
      }
      this.$refs.baseInfoRef.getEchoData({
        basicForm,
        isTalentVal
      })
      //企业详情
      let enterpriseForm = {
        appealList: projectDetailsOneVo.appealList || [],
        source: projectDetailsOneVo.source,
        state: projectDetailsOneVo.state,
        blacklistReason: projectDetailsOneVo.blacklistReason,
        isValid: projectDetailsOneVo.isValid || 0,
        validReason: projectDetailsOneVo.validReason,
        settleOrder: projectDetailsOneVo.settleOrder,
        intentionLevel: projectDetailsOneVo.intentionLevel,
        isCoordinate: projectDetailsOneVo.isCoordinate,
        sponsorId: projectDetailsOneVo.sponsorId,
        localGovId: projectDetailsOneVo.localGovId,
        procurementProducts: projectDetailsTwoVo.procurementProducts,
        amountPurchased: projectDetailsTwoVo.amountPurchased,
        purchaseBudget: projectDetailsTwoVo.purchaseBudget,
        purchaseTime: projectDetailsTwoVo.purchaseTime,
        purchaseObject: projectDetailsTwoVo.purchaseObject,
        supplyProduct: projectDetailsTwoVo.supplyProduct,
        supplyObject: projectDetailsTwoVo.supplyObject,
        upstreamSupplier: projectDetailsOneVo.upstreamSupplier,
        downstreamDemandSide: projectDetailsOneVo.downstreamDemandSide,
        productSuperiority: projectDetailsOneVo.productSuperiority,
        competitor: projectDetailsOneVo.competitor,
        revenueStatus: projectDetailsOneVo.revenueStatus,
        capacitySituation: projectDetailsOneVo.capacitySituation,
        priceAdvantage: projectDetailsOneVo.priceAdvantage,
        costAdvantage: projectDetailsOneVo.costAdvantage,
      }
      this.$refs.informationRef.getEchoData({
        enterpriseForm,
        filePathList: echoData.filePathList || [],
      })
      //落户信息
      let settleForm = {
        settleShape: projectDetailsTwoVo.settleShape, //落户形式
        settleShapeDetails: projectDetailsTwoVo.settleShapeDetails, //落户形式详情
        settlePlan: projectDetailsTwoVo.settlePlan, //落户计划
        plannedInvestment: projectDetailsTwoVo.plannedInvestment, //计划投入资金
        outputValueForecast: projectDetailsTwoVo.outputValueForecast, //3-5年产值预测
        taxRevenueForecast: projectDetailsTwoVo.taxRevenueForecast, //3-5年税收预
        promoteEmployment: projectDetailsTwoVo.promoteEmployment, //带动就业
        buildCapital: projectDetailsTwoVo.buildCapital, //自有基金
        fundsRaisedOneself: projectDetailsTwoVo.fundsRaisedOneself, //自筹基金
        equityRatio: projectDetailsTwoVo.equityRatio, //法人代表股权比例
        settlePlanOther: projectDetailsTwoVo.settlePlanOther, //其他

        governmentFunding: projectDetailsTwoVo.governmentFunding, //政府资助资金
        governmentIndustrialGuidanceFunds:
          projectDetailsTwoVo.governmentIndustrialGuidanceFunds, //政府产业引导资金
        policiesSupportOther: projectDetailsTwoVo.policiesSupportOther, //其他

        localRetentionReturn: projectDetailsTwoVo.localRetentionReturn, //本地留存返还
        vat: projectDetailsTwoVo.vat, //增值税
        researchExpenditure: projectDetailsTwoVo.researchExpenditure, //研发费用
        corporateIncomeTax: projectDetailsTwoVo.corporateIncomeTax, //企业所得税
        siteDecoration: projectDetailsTwoVo.siteDecoration, //场地装修
        taxPreferenceOther: projectDetailsTwoVo.taxPreferenceOther, //其他

        venueWorking: projectDetailsTwoVo.venueWorking, //办公场地面积
        workshopWayList: projectDetailsTwoVo.workshopWayList, //生产厂房方式
        workshopWay: projectDetailsTwoVo.workshopWay, //生产厂房方式
        workshop: projectDetailsTwoVo.workshop, //生产厂房面积
        floorRequirement: projectDetailsTwoVo.floorRequirement, //楼层要求
        heightRequirement: projectDetailsTwoVo.heightRequirement, //层高要求
        loadBearingRequirement: projectDetailsTwoVo.loadBearingRequirement, //承重要求
        siteSupportOther: projectDetailsTwoVo.siteSupportOther, //其他

        talentApartment: projectDetailsTwoVo.talentApartment
          ? projectDetailsTwoVo.talentApartment.split(",")
          : [], //人才公寓tag
        plannedSchoolEnrolmentOfChildren: projectDetailsTwoVo.plannedSchoolEnrolmentOfChildren
          ? projectDetailsTwoVo.plannedSchoolEnrolmentOfChildren.split(",")
          : [], //子女入学tag

        talentRecruitment: projectDetailsTwoVo.talentRecruitment, //人才招聘
        housePurchaseSubsidy: projectDetailsTwoVo.housePurchaseSubsidy, //购房补贴
        rentingSubsidy: projectDetailsTwoVo.rentingSubsidy, //租房补贴
        livingAllowances: projectDetailsTwoVo.livingAllowances, //生活补贴
        parentalPlacement: projectDetailsTwoVo.parentalPlacement, //父母安置
        spousalPlacement: projectDetailsTwoVo.spousalPlacement, //配偶安置
        otherSupport: projectDetailsTwoVo.otherSupport, //其他
      };
      this.$refs.settleInfoRef.getEchoData({
        settleForm,
      })
      //融资需求
      let financingForm = {
        financingRound: projectDetailsTwoVo.financingRound,//已融轮次
        investmentOrganization: projectDetailsTwoVo.investmentOrganization,//投资机构名称
        financialDemand: projectDetailsTwoVo.financialDemand,//融资需求
        financingPlanDescription: projectDetailsTwoVo.financingPlanDescription, // 融资计划
        intendedFunds: projectDetailsTwoVo.intendedFunds, // 意向资金
        wayFinancing: projectDetailsTwoVo.wayFinancing, // 融资方式
        capitalSideShareRatioMin: projectDetailsTwoVo.capitalSideShareRatioMin, // 资金方占股最小比例
        capitalSideShareRatioMax: projectDetailsTwoVo.capitalSideShareRatioMax, // 资金方占股最大比例
        investorExitMethod: projectDetailsTwoVo.investorExitMethodList || [], // 投资方退出方式
        minimumExitYears: projectDetailsTwoVo.minimumExitYears, // 最短退出年限
        canBearHighestInterest: projectDetailsTwoVo.canBearHighestInterest, // 可承担最高利息
        durationCapitalOccupation: projectDetailsTwoVo.durationCapitalOccupation, // 资金占用时长
        riskControlAvailable: projectDetailsTwoVo.riskControlAvailable, // 可提供风控
        sourceRepayment: projectDetailsTwoVo.sourceRepayment, // 还款来源
        durationCapitalTime: projectDetailsTwoVo.durationCapitalTime || 1, //资金占用时长时间类型
      };
      this.$refs.financingInfoRef.getEchoData({
        financingForm,
      });
      if (this.type <= 4) {
        this.reviewId = projectDetailsOneVo.id;
        this.echoCustomerManaInfo = Object.assign(projectDetailsOneVo, projectDetailsTwoVo, echoData.customerCopyDetailsVo || {}, echoData.signUpDetailsVo || {})
      } else {
        // 暂未处理
        // this.echoCustomerManaInfo = Object.assign(projectDetailsOneVo, projectDetailsTwoVo)
      }
    },

    // 修改页面状态
    async changeOperateType () {
      if (this.operateType != 1) {
        if (!this.baseInfoFrom.wechatNumber && !this.baseInfoFrom.phone) {
          this.$message.closeAll();
          this.$message.error('请先填写微信或者手机号')
          return
        }
        this.$refs.baseInfoRef.submitFormData();
        this.$refs.informationRef.submitFormData();
        this.$refs.followUpList.submit();
        //选择的诉求id
        let appealIdList = this.$refs.informationRef.appealIdList || [];
        if (appealIdList.includes(1)) {
          this.$refs.settleInfoRef.submitFormData();
        } else {
          this.settleInfoFormData = {}
        }
        if (appealIdList.includes(2)) {
          this.$refs.financingInfoRef.submitFormData();
        } else {
          this.financingInfoFormData = {};
        }
        if (this.validateResult) {
          let req = {
            projectOneDto: {},
          };
          if (appealIdList.includes(1) && !this.informationFormData.sponsorId && !this.informationFormData.localGovId && this.fromType != 7) {
            this.$message.closeAll();
            this.$message.error('请选择大赛或政府');
            return
          }
          //合并父组件的表单数据和项目信息的子组件数据
          req.projectOneDto = Object.assign(
            this.baseInfoFrom,//顶部信息
            this.baseInfoFormData,//基本信息
            this.informationFormData,//企业信息
          );

          //对特殊处理的数据进行重新赋值
          req.projectOneDto.followUpList = this.followUpList;
          req.projectOneDto.needType = this.navCur;
          req.projectOneDto.isSettle = appealIdList.includes(1) ? 1 : 0;
          req.projectOneDto.isFinancing = appealIdList.includes(2) ? 1 : 0;
          req.projectOneDto.isBazaar = appealIdList.includes(3) ? 1 : 0;
          //提交内容projectTwoDto需要的父组件内的表单数据额外处理
          let purchaseObj = {
            procurementProducts: this.informationFormData.procurementProducts,
            amountPurchased: this.informationFormData.amountPurchased,
            purchaseBudget: this.informationFormData.purchaseBudget,
            purchaseTime: this.informationFormData.purchaseTime,
            purchaseObject: this.informationFormData.purchaseObject,
            supplyProduct: this.informationFormData.supplyProduct,
            supplyObject: this.informationFormData.supplyObject,
          };
          req.projectTwoDto = Object.assign(
            this.settleInfoFormData,//落户信息
            this.financingInfoFormData,//融资信息
            purchaseObj//企业部分信息
          );
          //后端需要的特定数据
          req.projectOneDto.deptType = 2;
          let res = {};
          if (this.pageType == 2) {
            // 以下暂时未处理
            // req.projectOneDto.type = this.type;
            // if (this.rowId) {
            //   req.ids = this.listDelete.join(","); //删除附件入参
            //   req.flag = 0;
            //   req.id = this.rowId;
            //   //编辑处理跟进记录newFollowUpindex：新增的跟进记录条数
            //   if (this.newFollowUpindex != 0) {
            //     req.projectOneDto.followUpList = this.followUpListArr
            //       .slice(-this.newFollowUpindex)
            //       .reverse();
            //   }
            //   let newReq = {
            //     intentionOneDto: req.projectOneDto,
            //     intentionTwoDto: req.projectTwoDto,
            //   };
            //   let api = '/api/editTelemarketingIntention';
            //   if (this.fromPage == 7) {
            //     api = '/api/editIntentionGround';
            //     newReq.intentionOneDto.settleProjectSponsorId = Number(this.$route.query.settleProjectSponsorId) || null;
            //     newReq.intentionOneDto.settleProjectId = Number(this.$route.query.rowId) || null;
            //     newReq.intentionOneDto.settleOrder = this.ruleForm.settleOrder;
            //     newReq.intentionOneDto.intentionLevel = this.ruleForm.intentionLevel;
            //     newReq.intentionOneDto.isCoordinate = this.ruleForm.isCoordinate
            //   }
            //   res = await this.$axios.post(api, newReq);
            // }
          } else {
            if (this.rowId) {
              // 编辑
              req.ids = this.listDelete.join(","); //删除附件入参
              req.flag = 0;
              req.id = this.rowId;
              let api = editCustomer;
              // 以下暂时未处理
              // if (this.isReview) {
              //   req.projectOneDto.id = this.baseInfoFrom.id;
              // }
              // if (this.$route.query.fromType == 2) api = "/api/editCustomerTwo";
              // if (this.fromType == 7) {
              //   api = "/api/editProjectGround";
              //   req.projectOneDto.settleProjectSponsorId = Number(this.$route.query.settleProjectSponsorId) || null;
              //   req.projectOneDto.settleProjectId = Number(this.$route.query.rowId) || null;
              // }
              // if (this.isCoordinate) {
              //   let { coordinateId, id, isSettle, settleId, settleProjectSponsorId } = this.$route.query
              //   req.coordinateId = coordinateId;
              //   api = '/api/editCustomerCoordinate'
              //   if (isSettle == 1) {
              //     req.projectOneDto.id = id;
              //     req.projectOneDto.settleProjectId = settleId;
              //     req.projectOneDto.settleProjectSponsorId = settleProjectSponsorId;

              //     api = '/api/editProjectGroundCoordinate'
              //   }
              // }
              // if (this.$route.query.isEnterprise == 1) {
              //   api = '/api/editEnterpriseDemand'
              // } else if (this.$route.query.isEnterprise == 2) {
              //   api = '/api/editSupplyChain'
              // }
              res = await api(req);
            } else {
              // 新增
              res = await addCustomer(req);
            }
          }
          if (res && res.status == 200) {
            this.$message.closeAll();
            if (res.msg) this.$message.success(res.msg);
            if (!this.rowId) {
              if (res.data) {
                this.rowId = res.data;
                this.operateType = 1;
                this.editEcho(res.data)
              } else {
                // setTimeout(() => { window.close() }, 1000)
                this.$router.push('/customer/enterpriseBusinessDivision')
              }
              return
            } else {
              // setTimeout(() => { window.close() }, 1000)
              this.$router.push('/customer/enterpriseBusinessDivision')
            }
          }
          return
        }
        //状态重置
        this.validateResult = true;
      } else {
        this.operateType = 2;
        let { isCoordinate } = this.$route.query;
        this.isDetails = isCoordinate == 1 ? true : this.isCoordinate;
      }
    },


    //同步创成汇项目数据
    async handleSynchronous () {
      this.$message.closeAll();
      if (!this.baseInfoFrom.phone && !this.$refs.baseInfoRef.basicForm.companyName) {
        this.$message.warning('请填写手机号或公司/团队名称');
        return
      }
      let res = await getCrmSyncCchData({
        params: {
          companyName: this.$refs.baseInfoRef.basicForm.companyName,
          phone: this.baseInfoFrom.phone
        }
      });
      if (res && res.status == 200) {
        if (res.data) {
          this.$message.success(res.msg);
          this.handleSyncData(res.data);
        } else {
          this.$message.warning('暂无重复数据')
        }
      }
    },

    //处理创成汇 的同步数据
    handleSyncData (data) {
      this.baseInfoFrom.wechatNumber = this.baseInfoFrom.wechatNumber || data.wechatNumber;

      //地区处理
      let city = data.region ? [data.provinces, data.city, data.region] : data.city ? [data.provinces, data.city] : data.provinces ? [data.provinces] : [];
      let basicForm = {
        projectName: data.projectName,
        head: data.head,
        eduBackground: data.eduBack,
        city,
        enterpriseList: data.enterpriseList,
        projectBrief: data.projectBrief,
        companyIntroduction: data.companyIntroduction,
        oneDescription: data.oneDescription,
      }
      if (data.industry) {
        //根据创成汇的所属行业获取对应的项目领域
        let checkIndustryType = this.pullDownList.list.filter(item => {
          return item.name == data.industryType;
        })
        if (checkIndustryType.length > 0) {

          let checkIndustry = checkIndustryType[0].children.filter(itm => {
            return itm.name == data.industry
          })
          if (checkIndustry.length) {
            basicForm.projectField = [];
            basicForm.projectField.push([
              checkIndustryType[0].id,
              checkIndustry[0].id
            ])
          }
        }
      }
      //人才资质处理
      let isTalentVal = false;
      if (data.talentList && data.talentList.length) {
        let talentOption = this.handleTalentList(), talentCustom = '';
        basicForm.talentList = [];
        data.talentList.forEach((item) => {
          let checkTalent = talentOption.filter(itm => {
            return item == itm.name;
          });
          if (checkTalent.length) {
            basicForm.talentList.push([checkTalent[0].parentId, checkTalent[0].id])
          } else {
            talentCustom += talentCustom ? `、${item}` : item;
          }
        });
        if (talentCustom) {
          basicForm.talentList.push([4])
          basicForm.talentVal = talentCustom;
          isTalentVal = true;
        }
      }
      this.$refs.baseInfoRef.synchronizeData(basicForm, isTalentVal);
      //企业信息
      let enterpriseForm = {
        competitor: data.competitor,
        revenueStatus: data.revenueStatus,
        filePathList: data.filePathList
      }
      this.$refs.informationRef.synchronizeData(enterpriseForm);
      //融资信息
      if (this.initTabList[3].ifShow) {
        let financingForm = {
          financingRound: data.financingRound,
          financialDemand: data.financialDemand,
          financingPlanDescription: data.financingPlanDescription,
          intendedFunds: data.intendedFunds,
          wayFinancing: data.wayFinancing,

        }
        this.$refs.financingInfoRef.synchronizeData(financingForm);
      }
    },
  },
  watch: {
    "$route.query.id": function (newVal) {
      if (newVal) {
        // 回显处理
        this.editEcho();
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.main-page {
  padding: $base-padding;
  display: flex;


  .page-left-box {
    background: $base-color-white;
    border-radius: 3px;
    border: 1px solid #eee;
    padding: 20px;
    flex: 1;
    overflow-y: hidden;
    margin-right: 10px;

    .verification-btn {
      font-size: 12px;
      line-height: 24px;
      padding: 0 10px !important;
      margin-left: 10px;
    }

    .title-box {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 18px;
        line-height: 24px;
        color: #333;
        font-weight: 700;
      }

      .nav-box {
        display: flex;
        align-items: center;
      }
    }

    .company-baseinfo {
      margin-top: 20px;
      background: #f5f6fa;
      border-radius: 3px;
      padding: 20px 20px 14px;
      display: flex;

      .company-item {
        // width: 218px;
        flex: 1;

        .verification-icon {
          color: red;
          font-size: 12px;
          margin-right: 4px;
        }

        p {
          min-height: 26px;
          font-size: 14px;
          color: #999999;
          line-height: 26px;
        }

        :deep(.el-input) {
          margin-top: 5px;
          width: calc(100% - 68px);

          .el-input__inner {
            border: none;
            background: #edeef2;
            padding: 0;
            padding-left: 10px;
            width: 100%;
            height: 30px;
            line-height: 30px;
          }
        }
      }

      .company-name {
        width: 290px;

        :deep(.el-input) {
          width: calc(100% - 40px);
        }
      }
    }

    .tab-box {
      margin-top: 20px;
      display: flex;
      padding-bottom: 16px;
      border-bottom: 2px solid #f5f6fa;

      .tab-item {
        font-size: 14px;
        color: #333333;
        margin-right: 20px;
        cursor: pointer;
      }

      .tab-active {
        color: $base-color-default;
        font-weight: 700;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          bottom: -16px;
          width: 100%;
          height: 3px;
          left: 0;
          background: $base-color-default;
        }
      }
    }

    .tab-content {
      height: calc(100vh - 396px);
      overflow-y: auto;
      overflow-x: hidden;

      :deep(.el-form) {
        .boreder-bottom {
          border-bottom: 1px solid #f2f6fc;
        }

        .el-form-item {
          margin-bottom: 0;
          display: flex;
        }

        .el-form-item__label {
          margin-top: 0;
          line-height: 40px;
          min-height: 40px;
          padding-left: 20px;
          color: #666666;
          font-size: 14px;
          background: #f7fbfe;
          border-top: 1px solid #f2f6fc;
          flex-shrink: 0;
        }

        .el-form-item__content {
          margin-top: 0;
          border-top: 1px solid #f2f6fc;
          padding-left: 20px;
          width: calc(100% - 140px);
          margin-left: 0 !important;

          .el-input__inner {
            border: none;
            padding-left: 0;
          }

          .el-textarea {
            width: 100% !important;
            height: auto;
            min-height: 40px !important;

            .el-textarea__inner {
              width: 100%;
              height: auto;
              border: none;
              line-height: 30px;
              padding: 5px 15px;
              padding-left: 0;
              min-height: 40px !important;
              height: 40px !important;

              &::-webkit-scrollbar {
                display: none;
              }
            }
          }

          .echo-item {
            padding: 9px 0;
            line-height: 22px;
          }
        }

        .el-cascader__tags {
          align-items: center;

          .el-cascader__search-input {
            margin-left: 1px !important;
          }

          .el-tag {
            &:nth-of-type(1) {
              margin-left: 0;
            }
          }
        }

        .el-input,
        .el-textarea,
        .el-select {
          width: 100%;
          min-height: 40px;
          line-height: 40px;

          .el-input {
            min-height: 40px;
            line-height: 40px;

            .el-input__inner {
              min-height: 40px;
              line-height: 40px;
            }
          }

          .el-input__inner {
            height: 40px;
          }
        }

        .is-error {
          .el-form-item__content {
            padding-left: 20px;
          }

          .el-input__inner {
            // padding-left: 20px;
            border: 1px solid #f56c6c !important;

            &:focus {
              border: none !important;
            }
          }
        }

        .el-item-error .el-form-item__content {
          border-radius: 4px;
          border: 1px solid #f56c6c !important;
        }

        .el-input-group__append {
          border: none;
          border-radius: 0;
          width: 70px;
          padding: 0;
          text-align: center;
        }

        .flex2-1 {
          width: 50%;
        }

        .flex1 {
          width: 100%;
        }

        .flex3-1 {
          width: 33.3%;
        }

        .flex3-2 {
          width: 66.6%;
        }

        .form-title {
          font-size: 14px;
          color: #333;
          margin-top: 17px;
        }
      }
    }
  }

  .page-right-box {
    height: calc(100vh - 194px);
    overflow-y: auto;
    width: 400px;
    background: $base-color-white;
    border-radius: 3px;
    border: 1px solid #eee;
    padding: 20px;
  }
}
</style>
<style lang="scss">
//客户详情页人才公寓弹出框样式
.customer-popover-box {
  padding: 0;

  .add-siteSupportOther {
    width: 283px;
    height: 130px;
    background: $base-color-white;
    padding: 0 20px 10px;

    .el-input__inner {
      min-height: 40px;
      line-height: 40px;
    }

    .top {
      display: flex;
      border-bottom: 1px solid #F2F6FC;

      .el-input {
        flex: 1;

        .el-input__inner {
          border: none;
        }
      }

      .area-input {
        position: relative;

        &::after {
          content: "";
          width: 1px;
          height: 14px;
          background: #F2F6FC;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }

    .flats-type {
      .el-radio-group {
        margin-top: 9px;
        display: flex;
        justify-content: space-between;
      }
    }

    .btn-grounp {
      margin-top: 20px;
      display: flex;
      justify-content: center;

      .el-button {
        width: 100px;
        height: 30px;
        border-radius: 2px;
        padding: 0;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        margin-right: 20px;
      }

      .cancel {
        background-color: #DDDDDD;
        color: #999999;
      }

      .confirm {
        background-color: $base-color-default;
        color: $base-color-white;
        margin: 0;
      }
    }
  }
}
</style>