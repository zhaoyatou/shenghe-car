<template>
  <a-card :loading="loadingCard" size="small" :hoverable="true" :bordered="false">
    <a-table
      :rowKey="(record, index) => index"
      :columns="columns"
      :pagination="{ total: total, current: current }"
      :data-source="dataList"
      :scroll="{ x: 1000 }"
      :customRow="customRow"
      @change="change"
    >
      <!-- saleMoney 签单金额 -->
      <template slot="saleMoney" slot-scope="text, record">
        <span>{{ text ? formatAmount(text) + '元' : '-' }}</span>
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
  { title: '业务人员', dataIndex: 'createUserName', key: 'createUserName', align: 'center', width: 200 },
  { title: '所属门店', dataIndex: 'storeName', key: 'storeName', align: 'center', width: 200 },
  { title: '签单数量', dataIndex: 'saleCount', key: 'saleCount', align: 'center', width: 200 },
  {
    title: '签单金额',
    dataIndex: 'saleMoney',
    key: 'saleMoney',
    align: 'center',
    width: 200,
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
    },
    total: {
      type: Number,
      default: 0
    },
    current: {
      type: Number,
      default: 0
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
    change(pagination, { currentDataSource }) {
      console.log(pagination, { currentDataSource });
      if (pagination) {
        this.$emit('changePagination', pagination);
      }
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
