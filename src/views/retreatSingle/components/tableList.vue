<template>
  <a-card :loading="loadingCard" size="small" :hoverable="true" :bordered="false">
    <a-table
      :columns="columns"
      :data-source="dataList"
      :rowKey="(record, index) => record.id"
      :scroll="{ x: 1500, y: heights }"
      @change="change"
      :customRow="customRow"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :locale="{ emptyText: '暂无数据' }"
      :pagination="{ total: total, current: current }"
    >
      <!-- 录单日期 -->
      <template slot="createTime" slot-scope="text, record">
        <span>{{ text ? moment(text).format('lll') : '-' }}</span>
      </template>
      <!-- 购车日期 -->
      <template slot="carBuyTime" slot-scope="text, record">
        <span>{{ text ? moment(text).format('lll') : '-' }}</span>
      </template>

      <!-- refundTime 退单时间 -->
      <template slot="refundTime" slot-scope="text, record">
        <span>{{ text ? moment(text).format('lll') : '-' }}</span>
      </template>

      <!-- updateTime 审核时间 -->
      <template slot="updateTime" slot-scope="text, record">
        <span>{{ text ? moment(text).format('lll') : '-' }}</span>
      </template>
      <!-- 操作 -->
      <span slot="action" slot-scope="text, record">
        <template>
          <a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()"> 操作 <a-icon type="down" /> </a>
            <a-menu slot="overlay">
              <a-menu-item key="3">
                <a-popconfirm
                  title="确定要撤销？"
                  ok-text="确认撤销"
                  cancel-text="取消"
                  @confirm="calRefund(record)"
                  @cancel="cancel"
                >
                  <a-button type="primary" size="small">撤销</a-button>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </span>
    </a-table>
    <slot name="opercate"></slot>
  </a-card>
</template>
<script>
import { operStatusColor, cardTypeText } from '@/utils/index';
import moment from 'moment';
import { del, calRefund } from '@/api/index';
const columns = [
  {
    title: '编号',
    customRender: (text, record, index) => `${index + 1}`, // 显示每一行的序号,
    width: 80,
    dataIndex: 'index',
    key: 'index',
    align: 'center'
  },
  {
    title: '所属门店',
    dataIndex: 'storeName',
    align: 'center',
    key: 'storeName',
    width: 200,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '经办人员',
    dataIndex: 'examineUserName',
    align: 'center',
    key: 'examineUserName',
    width: 150,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '合同生效时间',
    dataIndex: 'updateTime',
    align: 'center',
    key: 'updateTime',
    width: 260,
    scopedSlots: { customRender: 'updateTime' }
  },
  {
    title: '录单日期',
    dataIndex: 'createTime',
    align: 'center',
    key: 'createTime',
    width: 150,
    scopedSlots: { customRender: 'createTime' },
    width: 230
  },
  {
    title: '退单时间',
    dataIndex: 'refundTime',
    align: 'center',
    key: 'refundTime',
    width: 150,
    scopedSlots: { customRender: 'refundTime' },
    width: 230
  },
  {
    title: '合同编号',
    width: 240,
    align: 'center',
    dataIndex: 'contractNo',
    key: 'contractNo',
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '退单原因',
    width: 240,
    align: 'center',
    dataIndex: 'reason',
    key: 'reason',
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '客户姓名',
    dataIndex: 'customerName',
    align: 'center',
    key: 'customerName',
    width: 150,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 100,
    scopedSlots: { customRender: 'action' }
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
      // dataList: [],
      columns,
      selectedRowKeys: [],
      ChargebackVisible: false,
      reason: '',
      chargebackSelectValue: '',
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
    operStatusColor,
    moment,
    cardTypeText,
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
    },
    change(pagination, { currentDataSource }) {
      console.log(pagination, { currentDataSource });
      if (pagination) {
        this.$emit('changePagination', pagination);
      }
    },
    // 删除
    async calRefund(e) {
      const obj = {
        type: 1, //   1是选中导出  2为全部导出
        orderNos: [e.orderNo] //部分导出的时候需要，全部不需要
      };
      const res = await calRefund(obj);
      if (res.code === 200) {
        this.$message.success('撤销成功');
        this.$emit('refundList');
      } else {
        this.$message.error(res.message);
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
