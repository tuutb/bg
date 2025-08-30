<template>
  <div class="settle-info">
    <el-form :validate-on-rule-change="false" label-position="left" :model="settleForm" :rules="rules" ref="settleForm"
      label-width="160px" class="settle-ruleForm">
      <div class="form-title">落户计划</div>
      <div class="plan-form">
        <el-form-item class="flex3-1" label="落户形式">
          <p class="echo-item" v-if="isDetails">
            {{ echoCustomerManaInfo.settleShapeName }}
          </p>
          <template v-else>
            <el-select v-model="settleForm.settleShape" clearable placeholder="请选择">
              <el-option v-for="item in pullDownList.settleShapeList" :key="item.id" :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item class="flex3-2" label="详细落户形式">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.settleShapeDetails || '--' }}</p>
          <el-input resize="none" type="textarea" :autosize="{ minRows: 1, maxRows: 8 }" :rows="1" v-else
            v-model="settleForm.settleShapeDetails"></el-input>
        </el-form-item>
        <el-form-item class="flex3-1" label="落户计划">
          <p class="echo-item" v-if="isDetails">
            {{ echoCustomerManaInfo.settlePlanName }}
          </p>
          <template v-else>
            <el-select v-model="settleForm.settlePlan" clearable placeholder="请选择">
              <el-option v-for="item in pullDownList.settlePlanList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item prop="plannedInvestment" class="flex3-1" label="计划投入资金">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.plannedInvestment ?
            echoCustomerManaInfo.plannedInvestment + '万' : '--' }}</p>
          <el-input placeholder="请输入" v-else v-model.trim="settleForm.plannedInvestment" @input="
            settleForm.plannedInvestment = settleForm.plannedInvestment.replace(
              /[^\d\.]/g,
              ''
            )
            ">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="outputValueForecast" class="flex3-1" label="3-5年产值预测">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.outputValueForecast ?
            echoCustomerManaInfo.outputValueForecast + '万' : '--' }}</p>
          <el-input placeholder="请输入" v-else @input="
            settleForm.outputValueForecast = settleForm.outputValueForecast.replace(
              /[^\d\.]/g,
              ''
            )
            " v-model.trim="settleForm.outputValueForecast">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="taxRevenueForecast" class="flex3-1" label="3-5年税收预测">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.taxRevenueForecast ?
            echoCustomerManaInfo.taxRevenueForecast + '万' : '--' }}</p>
          <el-input placeholder="请输入" v-else @input="
            settleForm.taxRevenueForecast = settleForm.taxRevenueForecast.replace(
              /[^\d\.]/g,
              ''
            )
            " v-model.trim="settleForm.taxRevenueForecast">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="promoteEmployment" class="flex3-1" label="带动就业">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.promoteEmployment ?
            echoCustomerManaInfo.promoteEmployment + '人' : '--' }}</p>
          <el-input placeholder="请输入" v-else @input="
            settleForm.promoteEmployment = settleForm.promoteEmployment.replace(
              /[^\d]/g,
              ''
            )
            " v-model.trim="settleForm.promoteEmployment">
            <template slot="append">人</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="buildCapital" class="flex3-1" label="自有基金">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.buildCapital ?
            echoCustomerManaInfo.buildCapital + '万' :
            '--' }}</p>
          <el-input placeholder="请输入" v-else @input="
            settleForm.buildCapital = settleForm.buildCapital.replace(
              /[^\d\.]/g,
              ''
            )
            " v-model.trim="settleForm.buildCapital">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="fundsRaisedOneself" class="flex3-1" label="自筹基金">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.fundsRaisedOneself ?
            echoCustomerManaInfo.fundsRaisedOneself + '万' : '--' }}</p>
          <el-input placeholder="请输入" @input="
            settleForm.fundsRaisedOneself = settleForm.fundsRaisedOneself.replace(
              /[^\d\.]/g,
              ''
            )
            " v-else v-model.trim="settleForm.fundsRaisedOneself">
          </el-input>
          <template slot="append">万元</template>
        </el-form-item>
        <el-form-item prop="equityRatio" class="flex3-1" label="法人代表股权比例">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.equityRatio || '--' }}</p>
          <el-input placeholder="请输入" v-else v-model.trim="settleForm.equityRatio">
          </el-input>
        </el-form-item>
        <el-form-item prop="settlePlanOther" class="flex3-1" label="其他">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.settlePlanOther || '--' }}</p>
          <el-input placeholder="请输入" v-else v-model.trim="settleForm.settlePlanOther" />
        </el-form-item>
      </div>
      <div class="form-title">落户诉求</div>
      <div class="form-subtitle">政策扶持</div>
      <div class="policy-form">
        <el-form-item prop="governmentFunding" class="flex3-1" label="政府资助资金">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.governmentFunding ?
            echoCustomerManaInfo.governmentFunding + '万' : '--' }}</p>
          <el-input placeholder="请输入" @input="
            settleForm.governmentFunding = settleForm.governmentFunding.replace(
              /[^\d\.]/g,
              ''
            )
            " v-else v-model.trim="settleForm.governmentFunding">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="政府产业引导资金" class="flex3-1">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.governmentIndustrialGuidanceFunds ?
            echoCustomerManaInfo.governmentIndustrialGuidanceFunds + '万' : '--' }}</p>
          <el-input placeholder="请输入" @input="
            settleForm.governmentIndustrialGuidanceFunds = settleForm.governmentIndustrialGuidanceFunds.replace(
              /[^\d\.]/g,
              ''
            )
            " v-else v-model.trim="settleForm.governmentIndustrialGuidanceFunds">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="policiesSupportOther" class="flex3-1" label="其他">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.policiesSupportOther ?
            echoCustomerManaInfo.policiesSupportOther + '万' : '--' }}</p>
          <el-input placeholder="请输入" @input="
            settleForm.policiesSupportOther = settleForm.policiesSupportOther.replace(
              /[^\d\.]/g,
              ''
            )
            " v-else v-model.trim="settleForm.policiesSupportOther">
            <template slot="append">万元</template>

          </el-input>
        </el-form-item>
      </div>
      <div class="form-subtitle">税收优惠</div>
      <div class="taxation-form">
        <el-form-item prop="localRetentionReturn" class="flex3-1" label="本地留存返还">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.localRetentionReturn ?
            echoCustomerManaInfo.localRetentionReturn + '万' : '--' }}</p>
          <el-input placeholder="请输入" @input="
            settleForm.localRetentionReturn = settleForm.localRetentionReturn.replace(
              /[^\d\.]/g,
              ''
            )
            " v-else v-model.trim="settleForm.localRetentionReturn">
            <template slot="append">万元</template>

          </el-input>
        </el-form-item>
        <el-form-item prop="vat" class="flex3-1" label="增值税">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.vat ? echoCustomerManaInfo.vat + '万' : '--' }}
          </p>
          <el-input placeholder="请输入" @input="settleForm.vat = settleForm.vat.replace(/[^\d\.]/g, '')" v-else
            v-model.trim="settleForm.vat">
            <template slot="append">万元</template>

          </el-input>
        </el-form-item>
        <el-form-item prop="researchExpenditure" class="flex3-1" label="研发费用">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.researchExpenditure ?
            echoCustomerManaInfo.researchExpenditure + '万' : '--' }}</p>
          <el-input placeholder="请输入" @input="
            settleForm.researchExpenditure = settleForm.researchExpenditure.replace(
              /[^\d\.]/g,
              ''
            )
            " v-else v-model.trim="settleForm.researchExpenditure">
          </el-input>
          <template slot="append">万元</template>

        </el-form-item>
        <el-form-item prop="corporateIncomeTax" class="flex3-1" label="企业所得税">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.corporateIncomeTax ?
            echoCustomerManaInfo.corporateIncomeTax + '万' : '--' }}</p>
          <el-input placeholder="请输入" @input="
            settleForm.corporateIncomeTax = settleForm.corporateIncomeTax.replace(
              /[^\d\.]/g,
              ''
            )
            " v-else v-model.trim="settleForm.corporateIncomeTax">
            <template slot="append">万元</template>

          </el-input>
        </el-form-item>
        <el-form-item prop="siteDecoration" class="flex3-1" label="场地装修">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.siteDecoration ?
            echoCustomerManaInfo.siteDecoration + '万' : '--' }}</p>
          <el-input placeholder="请输入" @input="
            settleForm.siteDecoration = settleForm.siteDecoration.replace(
              /[^\d\.]/g,
              ''
            )
            " v-else v-model.trim="settleForm.siteDecoration">
            <template slot="append">万元</template>

          </el-input>
        </el-form-item>
        <el-form-item prop="taxPreferenceOther" class="flex3-1" label="其他">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.taxPreferenceOther ?
            echoCustomerManaInfo.taxPreferenceOther + '万' : '--' }}</p>
          <el-input placeholder="请输入" @input="
            settleForm.taxPreferenceOther = settleForm.taxPreferenceOther.replace(
              /[^\d\.]/g,
              ''
            )
            " v-else v-model.trim="settleForm.taxPreferenceOther">
            <template slot="append">万元</template>

          </el-input>
        </el-form-item>
      </div>
      <div class="form-subtitle">场地扶持</div>
      <div class="site-form">
        <el-form-item prop="venueWorking" class="flex3-1" label="办公场地">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.venueWorking ?
            echoCustomerManaInfo.venueWorking + '平米' :
            '--' }}</p>
          <el-input placeholder="请输入" @input="
            settleForm.venueWorking = settleForm.venueWorking.replace(
              /[^\d\.]/g,
              ''
            )
            " v-else v-model.trim="settleForm.venueWorking">
            <template slot="append">平米</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="workshopWay" class="flex3-1" label="生产厂房方式">
          <p class="echo-item" v-if="isDetails">
            {{ echoCustomerManaInfo.workshopWayName }}
          </p>
          <template v-else>
            <el-select v-model="settleForm.workshopWay" clearable placeholder="请选择">
              <el-option v-for="item in pullDownList.workshopWayList" :key="item.id" :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item prop="workshop" class="flex3-1" label="生产厂房面积">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.workshop ? echoCustomerManaInfo.workshop + '平米'
            :
            '--' }}
          </p>
          <el-input placeholder="请输入" @input="
            settleForm.workshop = settleForm.workshop.replace(
              /[^\d\.]/g,
              ''
            )
            " v-else v-model.trim="settleForm.workshop">
            <template slot="append">平米</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="floorRequirement" class="flex3-1" label="楼层要求">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.floorRequirement || '--' }}</p>
          <el-input placeholder="请输入" v-else v-model.trim="settleForm.floorRequirement" />
        </el-form-item>
        <el-form-item prop="heightRequirement" class="flex3-1" label="层高要求">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.heightRequirement || '--' }}</p>
          <el-input placeholder="请输入" v-else v-model.trim="settleForm.heightRequirement" />
        </el-form-item>
        <el-form-item prop="loadBearingRequirement" class="flex3-1" label="承重要求">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.loadBearingRequirement || '--' }}</p>
          <el-input placeholder="请输入" v-else v-model.trim="settleForm.loadBearingRequirement" />
        </el-form-item>
        <el-form-item prop="siteSupportOther" class="flex1" label="场地扶持其他">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.siteSupportOther || '--' }}</p>
          <el-input placeholder="请输入" v-else v-model.trim="settleForm.siteSupportOther" />
        </el-form-item>
      </div>
      <div class="form-subtitle">其他扶持</div>
      <div class="other-form">
        <el-form-item prop="siteSupportOther" class="flex3-1" label="人才公寓">
          <div class="tag-box">
            <el-tag :key="item" v-for="(item, index) in settleForm.talentApartment" :closable="!isDetails"
              :disable-transitions="false" @close="handleTalentsClose(item)">
              <span>
                {{ item }}
              </span>
            </el-tag>
            <el-popover v-if="!isDetails" placement="top" width="283" popper-class="customer-popover-box"
              v-model="talentPopoverVisible">
              <div class="add-siteSupportOther">
                <div class="top">
                  <el-input class="area-input" placeholder="面积" v-model.trim="flatsObj.area">
                  </el-input>
                  <el-input placeholder="多少套" v-model.trim="flatsObj.number" />
                </div>
                <div class="flats-type">
                  <el-radio-group v-model="flatsObj.type">
                    <el-radio v-for="item in pullDownList.talentsApartmentList" :key="item.id" :label="item.id">{{
                      item.name
                    }}</el-radio>
                  </el-radio-group>
                </div>
                <div class="btn-grounp">
                  <el-button class="cancel" @click="cancelFlatsObj">取消</el-button>
                  <el-button @click="addFlatsObj" class="confirm">确认</el-button>
                </div>
              </div>
              <el-button class="button-new-tag" slot="reference">+创建标签</el-button>
            </el-popover>
          </div>
        </el-form-item>
        <el-form-item prop="siteSupportOther" class="flex3-1" label="子女入学">
          <div class="tag-box">
            <el-tag :key="item" v-for="(item, index) in settleForm.plannedSchoolEnrolmentOfChildren"
              :closable="!isDetails" :disable-transitions="false" @close="handleChildrenClose(item)">
              <span>
                {{ item }}
              </span>
            </el-tag>
            <el-popover v-if="!isDetails" v-model="schoolPopoverVisible" placement="top" width="283"
              popper-class="customer-popover-box">
              <div class="add-siteSupportOther">
                <div class="top">
                  <el-input placeholder="多少套" v-model.trim="startSchoolObj.number" />
                </div>
                <div class="flats-type">
                  <el-radio-group v-model="startSchoolObj.type">
                    <el-radio v-for="item in pullDownList.childrenEntranceList" :key="item.id" :label="item.id">{{
                      item.name
                    }}</el-radio>
                  </el-radio-group>
                </div>
                <div class="btn-grounp">
                  <el-button class="cancel" @click="cancelChildrenEntrance">取消</el-button>
                  <el-button @click="childrenEntranceAdd" class="confirm">确认</el-button>
                </div>
              </div>
              <el-button class="button-new-tag" slot="reference">+创建标签</el-button>
            </el-popover>
          </div>
        </el-form-item>
        <el-form-item prop="talentRecruitment" class="flex3-1" label="人才招聘">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.talentRecruitment ?
            echoCustomerManaInfo.talentRecruitment + '万' : '--' }}</p>
          <el-input placeholder="请输入" v-else v-model.trim="settleForm.talentRecruitment" />
          <template slot="append">万元</template>
        </el-form-item>
        <el-form-item prop="housePurchaseSubsidy" class="flex3-1" label="购房补贴">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.housePurchaseSubsidy ?
            echoCustomerManaInfo.housePurchaseSubsidy + '万' : '--' }}</p>
          <el-input placeholder="请输入" @input="
            settleForm.housePurchaseSubsidy = settleForm.housePurchaseSubsidy.replace(
              /[^\d\.]/g,
              ''
            )
            " v-else v-model.trim="settleForm.housePurchaseSubsidy">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="rentingSubsidy" class="flex3-1" label="租房补贴">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.rentingSubsidy ?
            echoCustomerManaInfo.rentingSubsidy + '万' : '--' }}</p>
          <el-input placeholder="请输入" @input="
            settleForm.rentingSubsidy = settleForm.rentingSubsidy.replace(
              /[^\d\.]/g,
              ''
            )
            " v-else v-model.trim="settleForm.rentingSubsidy">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="livingAllowances" class="flex3-1" label="生活补贴">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.livingAllowances ?
            echoCustomerManaInfo.livingAllowances + '万' : '--' }}</p>
          <el-input placeholder="请输入" @input="
            settleForm.livingAllowances = settleForm.livingAllowances.replace(
              /[^\d\.]/g,
              ''
            )
            " v-else v-model.trim="settleForm.livingAllowances">
            <template slot="append">万元</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="parentalPlacement" class="flex3-1" label="父母安置">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.parentalPlacement ?
            echoCustomerManaInfo.parentalPlacement + '人' : '--' }}</p>
          <el-input placeholder="请输入" @input="
            settleForm.parentalPlacement = settleForm.parentalPlacement.replace(
              /[^\d\.]/g,
              ''
            )
            " v-else v-model.trim="settleForm.parentalPlacement">
            <template slot="append">人</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="spousalPlacement" class="flex3-1" label="配偶安置">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.spousalPlacement ?
            echoCustomerManaInfo.spousalPlacement + '人' : '--' }}</p>
          <el-input placeholder="请输入" @input="
            settleForm.spousalPlacement = settleForm.spousalPlacement.replace(
              /[^\d\.]/g,
              ''
            )
            " v-else v-model.trim="settleForm.spousalPlacement">
            <template slot="append">人</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="otherSupport" class="flex3-1" label="其他">
          <p class="echo-item" v-if="isDetails">{{ echoCustomerManaInfo.otherSupport || '--' }}</p>
          <el-input placeholder="请输入" v-else v-model.trim="settleForm.otherSupport" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      schoolPopoverVisible: false,//子女入学提示框
      talentPopoverVisible: false,//人才提示框
      settleForm: {
        settleShape: '', //落户形式
        settleShapeDetails: "", //落户形式详情
        settlePlan: "", //落户计划
        plannedInvestment: "", //计划投入资金
        outputValueForecast: "", //3-5年产值预测
        taxRevenueForecast: "", //3-5年税收预测
        promoteEmployment: "", //带动就业
        buildCapital: "", //自有基金
        fundsRaisedOneself: "", //自筹基金
        equityRatio: "", //法人代表股权比例
        settlePlanOther: "", //其他

        governmentFunding: "", //政府资助资金
        governmentIndustrialGuidanceFunds: "", //政府产业引导资金
        policiesSupportOther: "", //其他

        localRetentionReturn: "", //本地留存返还
        vat: "", //增值税
        researchExpenditure: "", //研发费用
        corporateIncomeTax: "", //企业所得税
        siteDecoration: "", //场地装修
        taxPreferenceOther: "", //其他

        venueWorking: "", //办公场地面积
        workshopWay: "", //生产厂房方式
        workshop: "", //生产厂房面积
        floorRequirement: "", //楼层要求
        heightRequirement: "", //层高要求
        loadBearingRequirement: "", //承重要求
        siteSupportOther: "", //其他

        talentApartment: [], //人才公寓tag
        plannedSchoolEnrolmentOfChildren: [], //子女入学tag

        talentRecruitment: "", //人才招聘
        housePurchaseSubsidy: "", //购房补贴
        rentingSubsidy: "", //租房补贴
        livingAllowances: "", //生活补贴
        parentalPlacement: "", //父母安置
        spousalPlacement: "", //配偶安置
        otherSupport: "", //其他
      },//落户数据
      rules: {},//校验规则
      flatsObj: {
        type: "", //公寓类型
        number: "", //数量
        area: "", //面积
      }, //人才公寓
      startSchoolObj: {
        type: "", //学校类型
        number: "", //数量
      }, //子女入学
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
      this.$refs.settleForm.validate(async (valid) => {
        if (valid) {
          formData = JSON.parse(JSON.stringify(this.settleForm)) || {};
          formData.talentApartment = this.settleForm.talentApartment.join(",");
          formData.plannedSchoolEnrolmentOfChildren = this.settleForm.plannedSchoolEnrolmentOfChildren.join(",");
          this.$emit("integrationData", 3, formData, true);
        } else {
          this.$emit("integrationData", 3, {}, false);
        }
      })
    },
    //创建人才公寓
    createdSiteSupport () {

    },
    //获取回显信息
    getEchoData (data) {
      this.settleForm = Object.assign(this.settleForm, data.settleForm)
    },
    //删除人才公寓标签
    handleTalentsClose (tag) {
      this.settleForm.talentApartment.splice(
        this.settleForm.talentApartment.indexOf(tag),
        1
      );
    },

    //取消人才公寓
    cancelFlatsObj () {
      this.flatsObj = {
        type: "", //公寓类型
        number: "", //数量
        area: "", //面积
      };
      this.talentPopoverVisible = false;
    },
    //添加人才公寓
    addFlatsObj () {
      if (this.flatsObj.type !== "" && this.flatsObj.area && this.flatsObj.number) {
        let tpyeName = ""; //公寓类型
        this.pullDownList.talentsApartmentList.forEach((item) => {
          if (item.id == this.flatsObj.type) {
            tpyeName = item.name;
          }
        });

        this.settleForm.talentApartment.push(
          `${this.flatsObj.area}平米${this.flatsObj.number}套${tpyeName}`
        );
        this.cancelFlatsObj()
      } else {
        this.$message.closeAll();
        this.$message.error("请填写完整的人才公寓信息");
      }
    },
    //删除标签
    handleChildrenClose (tag) {
      this.settleForm.plannedSchoolEnrolmentOfChildren.splice(
        this.settleForm.plannedSchoolEnrolmentOfChildren.indexOf(tag),
        1
      );
    },

    // 取消子女入学
    cancelChildrenEntrance () {
      this.startSchoolObj = {
        type: "", //学校类型
        number: "", //数量
      };
      this.schoolPopoverVisible = false;
    },

    //添加子女入学标签
    childrenEntranceAdd () {
      let tpyeName = ""; //学校类型
      if (this.startSchoolObj.type !== "" && this.startSchoolObj.number) {
        this.pullDownList.childrenEntranceList.forEach((item) => {
          if (item.id == this.startSchoolObj.type) {
            tpyeName = item.name;
          }
          return item;
        });
        this.settleForm.plannedSchoolEnrolmentOfChildren.push(
          `${tpyeName}${this.startSchoolObj.number}人`
        );
        this.cancelChildrenEntrance()
      } else {
        this.$message.closeAll();
        this.$message.error("请填写完整子女入学信息");
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.settle-info {
  :deep(.el-form) {

    .plan-form,
    .policy-form,
    .taxation-form,
    .other-form,
    .site-form {
      margin-top: 20px;
      border-right: 1px solid #f2f6fc;
      border-left: 1px solid #f2f6fc;
      border-bottom: 1px solid #f2f6fc;
      display: flex;
      flex-wrap: wrap;

      .tag-box {
        display: flex;
        flex-wrap: wrap;
        // padding-left: 20px;
        padding-top: 8px;
        line-height: 22px;

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

    .policy-form,
    .taxation-form {
      margin-top: 10px;
    }

    .form-subtitle {
      margin-top: 20px;
      padding-left: 12px;
      position: relative;
      color: #666666;
      font-size: 14px;

      &::before {
        content: '';
        position: absolute;
        height: 12px;
        width: 2px;
        background: #666666;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}
</style>