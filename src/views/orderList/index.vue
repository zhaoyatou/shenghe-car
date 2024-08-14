<template>
  <div id="orderList">
    <serch ref="serchDiv" /> <br />
    <a-spin :spinning="spinning">
      <tableList
        :heights="heights"
        ref="tableList"
        :dataList="dataList"
        :current="pageAge.pageNum"
        :total="total"
        @listExtendOrder="listExtendOrder"
        @changePagination="changePagination"
      >
        <template #opercate>
          <a-row type="flex" justify="space-between">
            <a-col :span="8">
              <a-space>
                <!-- <a-popconfirm title="确定要删除？" ok-text="确认删除" cancel-text="取消" @confirm="deleteConfirm" @cancel="cancel">
                  <a-button type="danger" icon="delete" :disabled="dataList.length <= 0"> 删除 </a-button>
                </a-popconfirm> -->
                <a-popconfirm
                  title="确定要导出？"
                  ok-text="确认导出"
                  cancel-text="取消"
                  @confirm="confirmExportListExtend"
                  @cancel="cancel"
                >
                  <a-button type="dashed" icon="export" :disabled="dataList.length <= 0"> 导出 </a-button>
                </a-popconfirm>
                <!--<a-checkbox @change="allSelect"> 全选 </a-checkbox>-->
                <!-- <a-button type="primary" icon="download" :disabled="dataList.length<=0"> 下载合同 </a-button> -->
              </a-space>
            </a-col>

            <a-col :span="8">
              <p style="display: flex; align-items: center; justify-content: right">
                合计：
                <span style="display: flex; align-items: center"
                  >订单量
                  <a-statistic :value="orderCount" style="margin-right: 10px" />
                </span>

                <span style="display: flex; align-items: center; justify-content: right"
                  >订单金额
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
import serch from '@/views/orderList/components/serch';
import tableList from '@/views/orderList/components/tableList';
import { getHight } from '@/utils/business';
import moment from 'moment';
import { listExtendOrder, approved, del, exportListExtend } from '@/api/index';
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
        pageSize: 30
      },
      orderCount: 0,
      orderAmount: 0,
      spinning: false
    };
  },
  created() {
    this.listExtendOrder();
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
        tableBtnHeight: 48,
        tablePageAgeHeight: 64,
        tableHeaderHeight: 54
      };
      this.heights = '100%'; // getHight(this, 'serchDiv', heightObj);
      // console.log(this.heights);
    },
    confirm() {
      this.$message.success('操作成功');
    },
    cancel() {
      this.$message.success('操作成功');
    },
    /***
     * @描述 请求列表 查询接口
     * @params
     * @url listExtendOrder
     * */
    async listExtendOrder(serchValue = {}) {
      try {
        // console.log(serchValue)
        // const obj = {
        //     "pageNum": "1",
        //     "pageSize": "10",
        //     "province":"",
        //     "city": "",
        //     "operStatus": "",
        //     "contractNo": "",
        //     "startTime": "",
        //     "storeId": "",
        //     "userId": "",
        //     "customerName": "",
        //     "useName": "",
        //     "carLicenseNum": "",
        //     "carLicense": "",
        //     "carCode": "",
        //     "saleStoreType":"",
        //     "saleStoreName":"",
        //     "projectId":""
        // }

        // this.pageAge.pageSize = 10
        if (serchValue) {
          this.pageAge = Object.assign(this.pageAge, serchValue);
        }
        const obj = this.pageAge;
        this.spinning = true;
        const result = await listExtendOrder(obj);
        this.spinning = false;
        console.log(result);
        this.dataList = result?.data?.list?.list || [];
        this.total = result?.data?.list?.total;
        this.orderCount = result?.data?.orderCount || 0;
        this.orderAmount = result?.data?.orderAmount || 0;
      } catch (error) {
        console.log('加载列表接口(listExtendOrder)的错误信息--->', error);
        this.spinning = false;
      }
    },
    changePagination(pagination) {
      this.pageAge.pageNum = pagination.current;
      this.pageAge.pageSize = pagination.pageSize;
      this.listExtendOrder();
    },
    // 审核通过
    async approved() {
      const obj = {};
      const res = await approved(obj);
      if (res.code === 200) {
        this.$message.success('审核通过');
      } else {
        this.$message.error(res.message);
      }
    },
    // 多选删除
    async deleteConfirm(e) {
      console.log(this.$refs.tableList?.selectedRowKeys);
      try {
        const orderNos = this.$refs.tableList?.selectedRowKeys;
        if (orderNos.length <= 0) {
          this.$message.warning('请选择合同');
          return false;
        }
        const obj = {
          orderNos: orderNos
        };
        const res = await del(obj);
        if (res.code === 200) {
          this.$message.success('删除成功');
          this.listExtendOrder();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    confirmExportListExtend() {
      const orderNos = this.$refs.tableList?.selectedRowKeys;
      this.$refs.serchDiv.form.validateFields(async (error, values) => {
        values.startTime = '';
        values.endTime = '';
        if (values?.purchasetime?.length > 0) {
          values.startTime = moment(values?.purchasetime[0]).format('YYYY-MM-DD HH:mm:ss');
          values.endTime = moment(values?.purchasetime[1]).format('YYYY-MM-DD HH:mm:ss');
        }
        let obj;
        if (orderNos.length <= 0) {
          obj = {
            type: 2, //   1是选中导出  2为全部导出
            query: values
          };
        } else {
          obj = {
            type: 1, //   1是选中导出  2为全部导出
            orderNos: orderNos, //部分导出的时候需要，全部不需要
            query: values
          };
        }
        const res = await exportListExtend(obj);
        if (res.code === 200) {
          this.$message.success('导出成功');
          window.open(res?.data?.fileUrl);
          this.listExtendOrder();
        } else {
          this.$message.error(res.message);
        }
      });
    }
  },
  mounted() {
    const that = this;
    that.getHeights();
    window.onresize = () => {
      that.getHeights();
    };
  }
};
</script>

<style scoped lang="scss">
.ant-statistic {
  display: inline-block;
}
</style>
