<template>
  <div id="orderList">
    <serch ref="serchDiv" />
    <br />
    <a-spin :spinning="spinning">
      <tableList :heights="heights" ref="tableList" :dataList="dataList" :total="total" @finance="finance"
        @changePagination="changePagination" :current="pageAge.pageNum">
        <template #opercate>
          <a-row type="flex" justify="space-between">
            <a-col :span="8"> </a-col>
            <a-col :span="8">
              <p style="display: flex; align-items: center; justify-content: right">
                合计：
                <span style="display: flex; align-items: center">订单量
                  <a-statistic :value="orderCount" style="margin-right: 10px" />
                </span>

                <span style="display: flex; align-items: center; justify-content: right">订单金额
                  <a-statistic :precision="2" :value="orderAmount" />
                </span>
              </p>
            </a-col>
          </a-row>
        </template>
      </tableList>
    </a-spin>
  </div>
</template>

<script>
import serch from '@/views/statistics/financial/components/serch';
import tableList from '@/views/statistics/financial/components/tableList';
import { getHight } from '@/utils/business';
import { finance } from '@/api/index'
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
        pageNum: 1,
        pageSize: 10
      },
      orderCount: 0,
      orderAmount: 0,
      spinning: false,
    };
  },
  created() {
    this.finance()
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
      // console.log(this.heights);
    },
    /***
     * @描述 请求列表 查询接口 
     * @params 
     * @url refundList
     * */
    async finance(serchValue = {}) {
      try {
        // this.pageAge.pageSize = 10
        if (serchValue) {
          this.pageAge = Object.assign(this.pageAge, serchValue)
        }
        const obj = this.pageAge
        this.spinning = true
        const result = await finance(obj)
        this.spinning = false
        console.log(result)
        this.dataList = Array.from(new Set(result?.data?.list.list)) || []
        this.total = result?.data?.list?.total || 0
        this.orderCount = result?.data?.orderCount || 0
        this.orderAmount = result?.data?.orderAmount || 0
      } catch (error) {
        this.dataList = []
        console.log('加载列表接口(finance)的错误信息--->', error)
        this.spinning = false
      }
    },
    changePagination(pagination) {
      this.pageAge.pageNum = pagination.current
      this.pageAge.pageSize = pagination.pageSize
      this.finance()
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
