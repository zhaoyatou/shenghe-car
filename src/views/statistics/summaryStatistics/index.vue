<template>
  <div id="orderList">
    <serch ref="serchDiv" />
    <br />
    <a-spin :spinning="spinning">
      <tableList :heights="heights" ref="tableList" :dataList="dataList" :total="total" @collect="collect" @changePagination="changePagination" :current="pageAge.pageNum">
        <template #opercate>
          <a-row type="flex" justify="space-between">
            <a-col :span="8"> </a-col>
          </a-row>
        </template>
      </tableList>
    </a-spin>
  </div>
</template>

<script>
import serch from '@/views/statistics/summaryStatistics/components/serch';
import tableList from '@/views/statistics/summaryStatistics/components/tableList';
import { getHight } from '@/utils/business';
import { collect } from '@/api/index'
export default {
  name: 'orderList',
  components: {
    serch,
    tableList
  },
  data() {
    return {
      heights: '0',
      dataList: [],
      total: 0,
      pageAge: {
        pageNum: 1
      },
    };
  },
  created() {
    this.collect()
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
        brHeight: 24,
        tableCardSmall: 24,
        // tableBtnHeight: 32,
        tablePageAgeHeight: 64,
        tableHeaderHeight: 54
      };
      this.heights = '100%' // getHight(this, 'serchDiv', heightObj);
    },
         /***
     * @描述 请求列表 查询接口 
     * @params 
     * @url refundList
     * */ 
    async collect(serchValue = {}) {
      try {
        this.pageAge.pageSize = 10
        if (serchValue) {
          this.pageAge = Object.assign(this.pageAge, serchValue)
        }
        const obj = this.pageAge
        this.spinning = true
        const result = await collect(obj)
        this.spinning = false
        console.log(result)
        this.dataList = Array.from(new Set(result?.data?.list))  || []
        this.total = result?.data?.total
      } catch (error) {
        console.log('加载列表接口(collect)的错误信息--->', error)
        this.spinning = false
      }
    },
    changePagination(pagination) {
      this.pageAge.pageNum = pagination.current
      this.collect()
    },
  },
  mounted() {
    const that = this;
    that.$nextTick(() => {
      that.getHeights();
    });
    // window.onresize = () => {
    //   that.getHeights();
    // };
  }
};
</script>

<style scoped lang="scss">
.ant-statistic {
  display: inline-block;
}
</style>
