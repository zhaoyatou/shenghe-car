<template>
  <a-card :loading="loadingCard" size="small" :hoverable="true" :bordered="false">
    <a-table
      @change="change"
      :customRow="customRow"
      :rowKey="(record, index) => index"
      :columns="columns"
      :pagination="{ total: total, current: current, showSizeChanger: true }"
      :data-source="dataList"
      :scroll="{ x: 500, y: heights }"
    >
      <!-- 证件类型 -->
      <template slot="cardType" slot-scope="text, record">
        <a-tag color="#87d068" v-if="text">
          {{ cardTypeText().get(text) || '-' }}
        </a-tag>
        <span v-else>{{ cardTypeText().get(text) || '-' }}</span>
      </template>
      <!-- carLicense 车牌编号=车辆VIN码 -->
      <template slot="carLicense" slot-scope="text, record">
        <span>{{ record.carLicenseNum && text ? record.carLicenseNum + text : '-' }}</span>
      </template>
      <!-- carPurchase 新车购置价 -->
      <template slot="carPurchase" slot-scope="text, record">
        <span>{{ text ? formatAmount(text) + '元' : '-' }}</span>
      </template>
      <!-- extendPrice 延保费用 -->
      <template slot="extendPrice" slot-scope="text, record">
        <span>{{ text ? formatAmount(text) + '元' : '-' }}</span>
      </template>
      <!-- extendPrice 保额 -->
      <template slot="extendQuota" slot-scope="text, record">
        <span>{{ text ? formatAmount(text) + '元' : '-' }}</span>
      </template>
      <!-- 购车日期 -->
      <template slot="carBuyTime" slot-scope="text, record">
        <span>{{ text ? moment(text).format('lll') : '-' }}</span>
      </template>
      <!-- 订单日期 -->
      <template slot="createTime" slot-scope="text, record">
        <span>{{ text ? moment(text).format('lll') : '-' }}</span>
      </template>

      <!-- extendPrice 公里 -->
      <template slot="extendSpace" slot-scope="text, record">
        <span>{{ text ? text + '公里' : '-' }}</span>
      </template>
      <!-- extendPrice 延保年限 -->
      <template slot="extendTime" slot-scope="text, record">
        <span>{{ text ? text + '年' : '-' }}</span>
      </template>
      <!-- 延保琪琪 -->
      <template slot="extendStartTime" slot-scope="text, record">
        <span>{{ text ? moment(text).format('LL') : '-' }}</span>
      </template>
      <!-- 延保zhi琪 -->
      <template slot="extendEndTime" slot-scope="text, record">
        <span>{{ text ? moment(text).format('LL') : '-' }}</span>
      </template>
      <!-- 延长公里数 -->
      <template slot="extendSpace" slot-scope="text, record">
        <span>{{ text ? text + '公里' : '-' }}</span>
      </template>
      <!-- 延保销售时间行驶里程数 -->
      <template slot="carMileage" slot-scope="text, record">
        <span>{{ text ? text + '公里' : '-' }}</span>
      </template>

      <span slot="action" slot-scope="text, record">
        <template>
          <a-dropdown :trigger="['click']">
            <a-button type="primary" size="small">查看详情</a-button>
          </a-dropdown>
        </template>
      </span>
    </a-table>
    <slot name="opercate"></slot>
  </a-card>
</template>
<script>
import moment from 'moment';
import { cardTypeText, formatAmount } from '@/utils/index';
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
    title: '客户名称',
    dataIndex: 'customerName',
    key: 'customerName',
    align: 'center',
    width: 200,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '证件类型',
    dataIndex: 'cardType',
    key: 'cardType',
    align: 'center',
    width: 100,
    scopedSlots: { customRender: 'cardType' }
  },
  {
    title: '证件编号',
    dataIndex: 'cardId',
    key: 'cardId',
    align: 'center',
    width: 240,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '联系电话',
    dataIndex: 'tel',
    key: 'tel',
    align: 'center',
    width: 200,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '家庭住址',
    dataIndex: 'address',
    key: 'address',
    align: 'center',
    width: 300,
    customRender: (text, record) => {
      return record.city + ' ' + text || '-';
    }
  },
  {
    title: '所属门店',
    dataIndex: 'storeName',
    key: 'storeName',
    align: 'center',
    width: 200,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '车辆品牌',
    dataIndex: 'carBrand',
    key: 'carBrand',
    align: 'center',
    width: 100,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '订单创建人员',
    dataIndex: 'createUserName',
    key: 'createUserName',
    align: 'center',
    width: 120,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '车架编码(车辆VIN码)',
    dataIndex: 'carCode',
    align: 'center',
    key: 'carCode',
    width: 240,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '发动机编码',
    dataIndex: 'carEngine',
    align: 'center',
    key: 'carEngine',
    width: 150,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '车牌编号',
    dataIndex: 'carLicense',
    align: 'center',
    key: 'carLicense',
    width: 150,
    scopedSlots: { customRender: 'carLicense' }
  },
  {
    title: '车型',
    dataIndex: 'carModel',
    align: 'center',
    key: 'carModel',
    width: 150,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '新车购置价',
    dataIndex: 'carPurchase',
    align: 'center',
    key: 'carPurchase',
    width: 150,
    scopedSlots: { customRender: 'carPurchase' }
  },
  // { title: '延保费用', dataIndex: 'extendPrice',align: 'center', key: 'extendPrice', width: 150 , scopedSlots: { customRender: 'extendPrice' }},
  {
    title: '保额',
    dataIndex: 'extendQuota',
    align: 'center',
    key: 'extendQuota',
    width: 150,
    scopedSlots: { customRender: 'extendQuota' }
  },
  {
    title: '新车销售时间',
    dataIndex: 'carBuyTime',
    align: 'center',
    key: 'carBuyTime',
    width: 240,
    scopedSlots: { customRender: 'carBuyTime' }
  },
  {
    title: '原厂保修公里数',
    dataIndex: 'mileage',
    align: 'center',
    key: 'mileage',
    width: 150,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '订单时间',
    dataIndex: 'createTime',
    align: 'center',
    key: 'createTime',
    width: 240,
    scopedSlots: { customRender: 'createTime' }
  },
  {
    title: '延保起期',
    dataIndex: 'extendStartTime',
    align: 'center',
    key: 'extendStartTime',
    width: 240,
    scopedSlots: { customRender: 'extendStartTime' }
  },
  {
    title: '延保止期',
    dataIndex: 'extendEndTime',
    align: 'center',
    key: 'extendEndTime',
    width: 240,
    scopedSlots: { customRender: 'extendEndTime' }
  },
  {
    title: '延保销售时间行驶里程数',
    dataIndex: 'carMileage',
    align: 'center',
    key: 'carMileage',
    width: 150,
    scopedSlots: { customRender: 'carMileage' }
  },
  {
    title: '延保项目名称',
    dataIndex: 'projectName',
    align: 'center',
    key: 'projectName',
    width: 150,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '原厂保修期',
    dataIndex: 'warrantyTime',
    align: 'center',
    key: 'warrantyTime',
    width: 240,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '延保年限',
    dataIndex: 'extendTime',
    align: 'center',
    key: 'extendTime',
    width: 150,
    scopedSlots: { customRender: 'extendTime' }
  },
  {
    title: '延长公里数',
    dataIndex: 'extendSpace',
    align: 'center',
    key: 'extendSpace',
    width: 150,
    scopedSlots: { customRender: 'extendSpace' }
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
    moment,
    cardTypeText,
    formatAmount,
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    confirm(e) {
      console.log(e);
      this.$message.success('Click on Yes');
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
