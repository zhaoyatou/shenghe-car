<template>
  <a-card :loading="loadingCard" size="small" :hoverable="true" :bordered="false">
    <a-table :rowKey="(record, index) => index" :columns="columns" :data-source="dataList" :customRow="customRow" :pagination="false">
      <!-- refundTime 退单时间 -->
      <template slot="saleMoney" slot-scope="text, record">
        <span>{{ formatAmount(text) }}</span>
      </template>
    </a-table>
    <slot name="opercate"></slot>
  </a-card>
</template>
<script>
import { formatAmount } from '@/utils/index';
const columns = [
  {
    title: '编号',
    customRender: (text, record, index) => `${index + 1}`, // 显示每一行的序号,
    width: 80,
    dataIndex: 'index',
    key: 'index',
    align: 'center'
  },
  { title: '统计时间', width: 200, dataIndex: 'dayTime', key: 'dayTime', align: 'center' },
  { title: '销售总量（单数）', width: 240, dataIndex: 'saleCount', key: 'saleCount', align: 'center' },
  {
    title: '销售金额（总计）',
    width: 240,
    dataIndex: 'saleMoney',
    key: 'saleMoney',
    align: 'center',
    scopedSlots: { customRender: 'saleMoney' }
  }
];

export default {
  name: 'tableList',
  props: {
    heights: {
      type: String,
      default: ''
    },
    dataList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      loadingCard: true,
      columns,
      selectedRowKeys: [],
       // 自定义行
      customRow(record) {
        return {
          on: {
            click: e => {
              const children = e.target.parentNode.children;
              let hasClass = false;
              for (let i = 0; i < children.length; i++) {
                if (children[i].classList.contains('checked-td-of-add-table')) {
                  hasClass = true;
                }
              }
              const oldList = document.querySelectorAll('.checked-td-of-add-table');
              if (oldList) {
                for (let j = 0; j < oldList.length; j++) {
                  oldList[j].classList.remove('checked-td-of-add-table');
                }
              }
              if (!hasClass) {
                for (let i = 0; i < children.length; i++) {
                  children[i].classList.add('checked-td-of-add-table');
                }
              }
            }
          }
        };
      }
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    }
  },
  mounted() {
    this.loadingCard = false;
  },
  methods: {
    formatAmount,
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    confirm(e) {
      console.log(e);
      this.$message.success('Click on Yes');
    },
    cancel(e) {
      console.log(e);
      this.$message.error('Click on No');
    },
    toDetail(e) {
      this.$router.push({
        path: '/collect/detail',
        query: {}
      });
    }
  }
};
</script>

<style scoped labg="scss">
/deep/ .ant-dropdown-link {
}
/deep/ .checked-td-of-add-table {
  background-color: #e6f7ff;
}
</style>
