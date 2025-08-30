<template>
  <el-dialog title="高级查询" :visible.sync="searchDialog" :close-on-click-modal="true" :before-close="handleClose"
    width="690px">
    <el-form ref="form" :inline="true" :model="queryForm" @submit.native.prevent label-width="130px">
      <el-form-item label="公司/团队名称：">
        <el-input class="w170" maxlength="30" @keyup.enter.native="searchEnter" v-model="queryForm.companyName"
          placeholder="公司/团队名称" />
      </el-form-item>
      <el-form-item label="录入人：">
        <el-input class="w170" maxlength="30" @keyup.enter.native="searchEnter" v-model="queryForm.adminName"
          placeholder="录入人" />
      </el-form-item>
      <el-form-item label="有无跟进记录：">
        <el-select class="w170" v-model="queryForm.hasFollow" clearable placeholder="有无跟进记录">
          <el-option label="全部" value></el-option>
          <el-option label="有跟进记录" :value="1"></el-option>
          <el-option label="无跟进记录" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="跟进记录：">
        <el-input class="w170" @keyup.enter.native="searchEnter" v-model="queryForm.record" placeholder="跟进记录"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="项目领域：">
        <el-cascader class="w170" v-model="queryForm.projectField" :options="projectFieldList" :props="{
          value: 'id',
          label: 'name',
          checkStrictly: true,
        }" placeholder="项目领域" clearable></el-cascader>
      </el-form-item>
      <el-form-item label="联系方式：">
        <el-input class="w170" @keyup.enter.native="searchEnter" v-model="queryForm.phone" maxlength="20"
          placeholder="联系方式" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="负责人姓名：">
        <el-input @keyup.enter.native="searchEnter" maxlength="30" class="w170" v-model="queryForm.head"
          placeholder="负责人姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="微信：">
        <el-input @keyup.enter.native="searchEnter" v-model="queryForm.wechatNumber" class="w170" maxlength="20"
          placeholder="微信" clearable></el-input>
      </el-form-item>
      <el-form-item label="qq：">
        <el-input @keyup.enter.native="searchEnter" v-model="queryForm.qqNumber" class="w170" maxlength="11"
          placeholder="qq" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="企业上游供应方：">
        <el-input @keyup.enter.native="searchEnter" class="w170" v-model="queryForm.upstreamSupplier"
          placeholder="企业上游供应方" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="企业下游需求方：">
        <el-input @keyup.enter.native="searchEnter" class="w170" v-model="queryForm.downstreamDemandSide"
          placeholder="企业下游需求方" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="省/直辖市：">
        <el-select class="w170" v-model="queryForm.provinces" placeholder="省/直辖市" clearable @change="provinceChange">
          <el-option v-for="item in optionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          <el-option v-for="item in provinceList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市：">
        <el-select class="w170" v-model="queryForm.city" clearable no-data-text="无数据" placeholder="市"
          @change="cityChange">
          <el-option v-for="item in optionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          <el-option v-for="item in cityList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区/县：">
        <el-select class="w170" v-model="queryForm.region" no-data-text="无数据" clearable placeholder="区/县">
          <el-option v-for="item in optionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          <el-option v-for="item in areaList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </template>
  </el-dialog>
</template>
<script>
import areaData from "@/utils/countryData.js";
export default {
  data () {
    return {
      optionList: [
        {
          value: "",
          label: "全部",
        },
      ],
      provinceList: areaData,//省份地区数据集合
      cityList: [],//市数据集合
      areaList: [],//区数据集合
      queryForm: {
        companyName: "",//公司名称
        adminName: "",//录入人
        hasFollow: "",//有无跟进记录
        record: "",//跟进记录
        projectField: [],//项目领域
        phone: "",//联系方式
        head: "",//负责人姓名
        wechatNumber: "",//微信
        qq: "",//qq
        upstreamSupplier: "",//企业上游供应方
        downstreamDemandSide: "",//企业下游需求方
        provinces: "",//省份
        city: "",//市
        region: "",//区
      },
    };
  },
  props: {
    searchDialog: {
      type: Boolean,
      default: false,
    }, // 弹窗显隐
    projectFieldList: {
      type: Array,
      default: []
    },//项目领域
  },

  methods: {
    // 取消
    handleCancel () {
      this.queryForm = {
        companyName: "",//公司名称
        adminName: "",//录入人
        hasFollow: "",//有无跟进记录
        record: "",//跟进记录
        projectField: [],//项目领域
        phone: "",//联系方式
        head: "",//负责人姓名
        wechatNumber: "",//微信
        qq: "",//qq
        upstreamSupplier: "",//企业上游供应方
        downstreamDemandSide: "",//企业下游需求方
        provinces: "",//省份
        city: "",//市
        region: "",//区
      }
      this.$emit("update:searchDialog", false);
    },
    // 确定搜索
    handleOk () {
      this.$emit("update:searchDialog", false);
      this.$emit("handleFormClick", this.queryForm)
    },

    // 省下拉事件
    provinceChange (val) {
      this.provinceList.forEach((item) => {
        if (item.value == val) {
          this.cityList = item.children;
        }
      });
    },
    // 市下拉事件
    cityChange (val) {
      this.queryForm.region = "";
      this.cityList.forEach((item) => {
        if (item.value == val) {
          this.areaList = item.children;
        }
      });
    },

    //回车键按下搜索
    searchEnter (e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode == 13) {
        this.$emit("handleFormClick", this.queryForm)
      }
    },

    //关闭弹窗
    handleClose () {
      this.$emit("update:searchDialog", false);
    },

  },
};
</script>
<style lang="scss">
.w170 {
  width: 170px;
}
</style>