<template>
  <a-card :title="title" :style="{height: heights}" >
  <span class="result">
      <a-result
        :status="queryUrlInfo.operStatus == 4 ? 'warning' : 'success'"
        :title="successTitle"
      >
      <div class="desc">
        <p v-if="queryUrlInfo.operStatus == 4">
          <a-icon type="exclamation-circle" theme="twoTone" two-tone-color="#faad14" /> 延保订单审核失败，原因： &nbsp;
          <span>{{detailsData.reason || '无'}}</span>
        </p>
        <p>
          <a-icon theme="twoTone"  type="file-text" /> 合同编号 &nbsp;
          <span>{{queryUrlInfo.contractNo || '无'}}</span>
        </p>
        <p v-if="queryUrlInfo.operStatus == 2">
          <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" /> 提交时间 &nbsp;
          <span>{{queryUrlInfo.updateTime || '无'}}</span>
        </p>
        <p v-if="queryUrlInfo.operStatus == 4">
          <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" /> 处理时间 &nbsp;
          <span>{{queryUrlInfo.updateTime || '无'}}</span>
        </p>
      </div>
        <template #extra v-if="queryUrlInfo.operStatus == 4">
          <a-button type="primary" size="large" key="buy" @click="backEdit">
            返回修改
          </a-button>
        </template>
      </a-result>
    </span>
  </a-card>
</template>
<script>
import { getHight } from '@/utils/business';
import { detailExtendOrder } from '@/api/index'
import moment from 'moment';
export default {
  data() {
    return {
      title: '延保订单提交审核',
      successTitle: '延保订单提交成功，请等待审核人员对信息进行审核',
      heights: '0px',
      queryUrlInfo: '',
      detailsData: ''
    };
  },
  methods: {
    getHeights() {
      // 100 是顶部固定的高度, 48是card 的padding 上下, 64是搜索框的高度（变量需获取）24 是<br/> 标签，
      // 24是table  card small padding 上下，32 是表格内的按钮操作的高度
      // 64 是分页的高度+上下margin的距离
      // 54 是table 表头的高度
      // const headerFixedHeight = 100  // 100 是顶部固定的高度
      // const bodyCardHeight = 48  // 48是card 的padding 上下
      // const brHeight = 24 // 是<br/> 标签
      // const tableCardSmall = 24 // 24是table  card small padding 上下
      // const tableBtnHeight = 32 // 32 是表格内的按钮操作的高度
      // const tablePageAgeHeight = 64  // 64 是分页的高度+上下margin的距离
      // const tableHeaderHeight = 54  // 54 是table 表头的高度
      // const { headerFixedHeight, bodyCardHeight, brHeight, tableCardSmall, tableBtnHeight, tablePageAgeHeight, tableHeaderHeight } = heightObj
      const heightObj = {
        headerFixedHeight: 100,
        bodyCardHeight: 48,
        brHeight: 0,
        tableCardSmall: 0,
        tableBtnHeight: 0,
        tablePageAgeHeight:0,
        tableHeaderHeight: 0
      };
      this.$nextTick(()=>{
        this.heights = getHight(this, 'serchDiv', heightObj) + 'px';
        console.log(this.heights);
      })
    },
    getRouterPath() {
      this.queryUrlInfo = this.$route.query
      
      if (this.queryUrlInfo.operStatus == 2) {
        this.queryUrlInfo.updateTime = moment(Number(this.queryUrlInfo?.updateTime)).format('lll')
        this.title = '延保订单提交审核'
        this.successTitle = '延保订单提交成功，请等待审核人员对信息进行审核'
      } else if(this.queryUrlInfo.operStatus == 4) {
        this.queryUrlInfo.updateTime = moment(Date.parse(this.queryUrlInfo.updateTime)).format('lll')
        this.title = '延保订单合同'
        this.successTitle = '延保订单合同'
      }
    },
    // 从列表狗来需要请求详情接口 并且回显
    async loadDetailsOrder() {
      const queryObj = this.$route.query
      if (!queryObj.orderNo) return false
      const obj = {
        orderNo: queryObj.orderNo
      }
      const res = await detailExtendOrder(obj)
      console.log(res, 'loadDetailsOrder')
      if(res.data) {
        this.detailsData = res.data
      }
    },
    backEdit() {
      this.$router.push({
        path: '/ewbusiness/newfrom',
        query: {
          ...this.$route.query
        }
      })
    }
  },
  created() {
    this.getRouterPath()
    this.loadDetailsOrder()
  },
  mounted() {
    const that = this;
    that.getHeights();
    window.onresize = () => {
      that.getHeights();
    };
  }
}
</script>
<style scoped lang="scss">
.result {
  .desc {
    width: 60%;
    margin: 0 auto;
    p {
      font-size: 20px;
    }
  }
}
</style>