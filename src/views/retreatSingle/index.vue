<template>
  <div id="orderList">
    <serch ref="serchDiv" />
    <br />
    <a-spin :spinning="spinning">
      <tableList
        :heights="heights"
        ref="tableList"
        :dataList="dataList"
        :total="total"
        @refundList="refundList"
        @changePagination="changePagination"
        :current="pageAge.pageNum"
      >
        <template #opercate>
          <a-row type="flex" justify="space-between">
            <a-col :span="8">
              <a-space>
                <!--<a-checkbox @change="allSelect"> 全选 </a-checkbox>-->
                <a-popconfirm
                  title="确定要导出？"
                  ok-text="确认导出"
                  cancel-text="取消"
                  @confirm="confirmExportListExtend"
                  @cancel="cancel"
                >
                  <a-button type="dashed" icon="export"> 导出 </a-button>
                </a-popconfirm>
                <a-popconfirm
                  title="确定要撤销？"
                  ok-text="确认撤销"
                  cancel-text="取消"
                  @confirm="calRefund"
                  @cancel="cancel"
                >
                  <a-button type="primary"> 撤销 </a-button>
                </a-popconfirm>
              </a-space>
            </a-col>
          </a-row>
        </template>
      </tableList>
    </a-spin>
  </div>
</template>

<script>
import serch from '@/views/retreatSingle/components/serch';
import tableList from '@/views/retreatSingle/components/tableList';
import { getHight } from '@/utils/business';
import { refundList, calRefund, exportListRefund } from '@/api/index';
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
      }
    };
  },
  created() {
    this.refundList();
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
        tableBtnHeight: 32,
        tablePageAgeHeight: 64,
        tableHeaderHeight: 54
      };
      this.heights = '100%'; // getHight(this, 'serchDiv', heightObj);
      console.log(this.heights);
    },
    cancel() {
      this.$message.success('操作成功');
    },
    allSelect(e) {
      console.log(e);
    },
    /***
     * @描述 请求列表 查询接口
     * @params
     * @url refundList
     * */
    async refundList(serchValue = {}) {
      try {
        this.pageAge.pageSize = 10;
        if (serchValue) {
          this.pageAge = Object.assign(this.pageAge, serchValue);
        }
        const obj = this.pageAge;
        this.spinning = true;
        const result = await refundList(obj);
        this.spinning = false;
        console.log(result);
        this.dataList = Array.from(new Set(result?.data?.list)) || [];
        this.total = result?.data?.total;
      } catch (error) {
        console.log('加载列表接口(refundList)的错误信息--->', error);
        this.spinning = false;
      }
    },
    changePagination(pagination) {
      this.pageAge.pageNum = pagination.current;
      this.refundList();
    },
    async calRefund() {
      try {
        const ids = this.$refs.tableList?.selectedRowKeys;
        const orderNos = this.dataList.filter(item => ids.includes(item.id));
        if (orderNos.length <= 0) {
          this.$message.warning('请选择合同');
          return false;
        }
        const id = orderNos.map(item => {
          return item.orderNo;
        });
        const obj = {
          orderNos: id
        };
        console.log(obj);
        const res = await calRefund(obj);
        if (res.code === 200) {
          this.$message.success('撤销成功');
          this.refundList();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async confirmExportListExtend() {
      const ids = this.$refs.tableList?.selectedRowKeys;
      const orderNos = this.dataList.filter(item => ids.includes(item.id));
      this.$refs.serchDiv.form.validateFields(async (error, values) => {
        let obj;
        if (orderNos.length <= 0) {
          obj = {
            type: 2 //   1是选中导出  2为全部导出
          };
        } else {
          const id = orderNos.map(item => {
            return item.orderNo;
          });
          obj = {
            type: 1, //   1是选中导出  2为全部导出
            orderNos: id, //部分导出的时候需要，全部不需要
            query: values
          };
        }

        const res = await exportListRefund(obj);
        if (res.code === 200) {
          this.$message.success('导出成功');
          window.open(res?.data?.fileUrl);
          this.refundList();
        } else {
          this.$message.error(res.message);
        }
      });
    }
  },
  mounted() {
    const that = this;
    that.$nextTick(() => {
      that.getHeights();
    });
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
