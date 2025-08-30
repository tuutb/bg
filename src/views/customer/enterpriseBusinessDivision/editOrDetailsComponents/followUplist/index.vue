<template>
  <div class="follow-up">
    <div class="follow-title">
      <div class="title">跟进记录</div>
      <div class="back" @click="$router.go(-1)">返回上一页</div>
    </div>
    <div class="follow-content">
      <div class="follow-add-list" v-if="operateType != 1">
        <div class="follow-add">
          <div class="follow-top">
            <p class="point"></p>
            <div class="time">{{ nowTime }}</div>
            <div class="name">{{ userInfo.username }}</div>
          </div>
          <div class="secrecy" v-if="pageType == 3">
            <span>是否保密</span>
            <el-radio-group v-model="followAddObj.isSecrecy">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </div>
          <div class="followUpRecord">
            <el-input type="textarea" resize="none" :rows="4" placeholder="请输入跟进内容"
              v-model="followAddObj.followUpRecord"></el-input>
          </div>
          <div class="follow-bottom">
            <el-button type="primary" @click="addFollow">增加</el-button>
          </div>
        </div>
      </div>
      <ul :class="['table-box', operateType == 1 ? 'hg700' : 'hg500']"
        v-if="followHistoryList.length || newFollowList.length" :infinite-scroll-disabled="isPayDisabled"
        v-infinite-scroll="getPlanDisburseList" :infinite-scroll-delay="300" :infinite-scroll-immediate="false"
        :infinite-scroll-distance="10" style="overflow:auto">
        <li class="follow-history" v-for="item in followHistoryList" :key="item.id">
          <div class="follow-top">
            <p class="point"></p>
            <div class="time">{{ item.followTime }}</div>
            <div class="name">{{ item.followName }}</div>
          </div>
          <div class="secrecy"
            v-if="pageType == 3 && (!isEnterprise && !$route.query.coordinateId || ($route.query.coordinateId && $route.query.isCoordinate == 2))">
            <span>是否保密</span>
            <el-radio-group @input="
              (val) => {
                changeRadio(val, item);
              }
            " v-model="item.isSecrecy">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </div>
          <p class="followUpRecord">
            {{ item.followUpRecord }}
          </p>
        </li>
        <li class="follow-history" v-for="(item, index) in newFollowList" :key="item.id">
          <div class="follow-top">
            <p class="point"></p>
            <div class="time">{{ item.followTime }}</div>
            <div class="name">{{ item.followName }}</div>
            <p @click="delFollow(item, index)" class="del-follow">删除</p>
          </div>
          <div class="secrecy" v-if="pageType == 3 && !isEnterprise">
            <span>是否保密</span>
            <el-radio-group v-model="item.isSecrecy">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </div>
          <p class="followUpRecord">
            {{ item.followUpRecord }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { format } from "@/utils/common.js";
export default {
  data () {
    return {
      nowTime: '',//当前时间
      followAddObj: {
        followName: '',
        followUpRecord: '',
        isSecrecy: 0,
      },
      followHistoryList: [],
      newFollowList: [],//新增跟进记录
      isPayDisabled: false,

    }
  },
  created () {
    this.followAddObj = {
      followName: this.userInfo.username || '',
      followUpRecord: '',
      isSecrecy: 0,
    },
      setInterval(() => {
        this.nowTime = format(new Date(), '-', 'M');
      }, 1000)
  },
  props: {
    operateType: {
      type: [Number, String],
      default: 3,//1 详情 2编辑，3新增
    },
    pageType: {
      type: Number,
      default: 1,
    },
    isEnterprise: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    // 获取用户信息
    userInfo () {
      let user = localStorage.getItem("userInfo")
      return user ? JSON.parse(user) : {}
    }
  },
  methods: {
    //获取历史跟进记录
    getPlanDisburseList () { },
    //新增跟进记录
    addFollow () {
      if (this.followAddObj.followUpRecord) {
        this.newFollowList.push(this.pageType == 1 ? {
          followName: this.userInfo.username,
          followTime: this.nowTime,
          followUpRecord: this.followAddObj.followUpRecord,
        } : {
          adminId: this.$store.state.userInfo.id,
          followName: this.userInfo.username,
          followTime: this.nowTime,
          followUpRecord: this.followAddObj.followUpRecord,
          isSecrecy: this.followAddObj.isSecrecy,
        });
        this.followAddObj.followUpRecord = '';
        this.followAddObj.isSecrecy = 0;
      } else {
        this.$message.closeAll();
        this.$message.error('请填写跟进记录内容');
      }
    },
    //获取回显信息
    getEchoData (data) {
      this.newFollowList = [];
      if (this.pageType == 1 && !this.$route.query.isEnterprise) {
        this.followHistoryList = data.followUpListArr;
      } else {
        this.followHistoryList = data.followUpListArr.map(item => {
          item.followUpRecord = item.content
          return item;
        });
      }
    },
    //提交数据
    submit () {
      this.$message.closeAll();
      if (this.newFollowList.length || this.$route.query.id) {
        let followUpList = JSON.parse(JSON.stringify(this.newFollowList))
        followUpList = followUpList.map(item => {
          if (this.pageType == 2) delete item.isSecrecy;
          item.content = item.followUpRecord;
          return item;
        })
        this.$emit("integrationData", 5, followUpList, true);
      } else {
        this.$emit("integrationData", 5, [], false);
        this.$message.error("请至少填写一条跟进记录");
      }
    },
    //删除未提交跟进记录
    delFollow (item, index) {
      this.newFollowList.splice(index, 1);
    },
    //单选框修改事件
    async changeRadio (val, item) {
      if (item.id) {
        let res = await this.$axios.post("/api/editDemandSecrecy", {
          id: item.id,
          isSecrecy: val,
        });
        if (res && res.code == 200) {
          this.$message.closeAll();
          this.$message.success(res.msg);
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.follow-up {
  .follow-title {
    display: flex;
    justify-content: space-between;

    .title {
      color: #000;
      font-size: 16px;
      font-weight: bold;
    }

    .back {
      cursor: pointer;
      color: #999999;
      font-size: 14px;
    }
  }

  .follow-content {

    /* 滚动条 */
    ::-webkit-scrollbar {
      width: 6px;
      /* height: 8px; */
      height: 4px;
    }

    ::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0.1);
      -webkit-border-radius: 2em;
      -moz-border-radius: 2em;
      border-radius: 2em;
    }

    ::-webkit-scrollbar-thumb {
      /* background-color:  rgba(255, 106, 0, 0.6); */
      background-color: rgba(51, 51, 51, 0.671);
      -webkit-border-radius: 2em;
      -moz-border-radius: 2em;
      border-radius: 2em;
    }

    .follow-add-list {
      .follow-add {
        margin-top: 20px;

        .follow-top {
          display: flex;
          align-items: center;

          .point {
            position: relative;
            width: 10px;
            height: 10px;
            border: 1px solid $base-color-default;
            border-radius: 50%;
            padding: 1px;
            margin-right: 10px;

            &::after {
              content: '';
              background: $base-color-default;
              border-radius: 50%;
              width: 6px;
              height: 6px;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }

          .time {
            color: $base-color-default;
            font-size: 14px;
            font-weight: bold;
            margin-right: 20px;
          }

          .name {
            color: #999999;
            font-size: 14px;
          }
        }

        .followUpRecord {
          margin-top: 10px;

          :deep(.el-textarea) {
            width: 100% !important;

            .el-textarea__inner {
              width: 100% !important;
              border: 1px solid #eee;
              height: 140px;
              border-radius: 0;
            }
          }
        }

        .follow-bottom {
          margin-top: 20px;
        }
      }
    }

    .hg500 {
      max-height: 500px;
    }

    .hg700 {
      max-height: 700px;
    }

    .follow-history {
      margin-top: 20px;


      .follow-top {
        display: flex;
        align-items: center;

        .point {
          position: relative;
          width: 10px;
          height: 10px;
          border: 1px solid $base-color-default;
          border-radius: 50%;
          padding: 1px;
          margin-right: 10px;

          &::after {
            content: '';
            background: $base-color-default;
            border-radius: 50%;
            width: 6px;
            height: 6px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }

        .time {
          color: $base-color-default;
          font-size: 14px;
          font-weight: bold;
          margin-right: 20px;
        }

        .name {
          color: #999999;
          font-size: 14px;
        }

        .del-follow {
          color: $base-color-default;
          flex: 1;
          text-align: right;
          cursor: pointer;
        }
      }

      .followUpRecord {
        margin-top: 10px;
        color: #666666;
        font-size: 14px;
        line-height: 22px;
      }
    }
  }
}
</style>