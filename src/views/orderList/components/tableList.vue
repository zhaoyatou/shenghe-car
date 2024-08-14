<template>
  <a-card :loading="loadingCard" size="small" :hoverable="true" :bordered="false">
    <a-table
      :columns="columns"
      :data-source="dataList"
      :rowKey="(record, index) => record.orderNo"
      :scroll="{ x: 1500, y: heights }"
      @change="change"
      :locale="{ emptyText: '暂无数据' }"
      :customRow="customRow"
      :pagination="{
        total: total,
        defaultPageSize: 30,
        pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
        current: current,
        showSizeChanger: true
      }"
    >
      <!-- 
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, getCheckboxProps: getCheckboxProps }" -->
      <!-- 合同状态 -->
      <template slot="operStatus" slot-scope="text, record">
        <!-- <span :style="{color: operStatusColor().get(text).color}">{{operStatusColor().get(text).text}}</span> -->
        <a-tag :color="operStatusColor().get(text).color">
          {{ operStatusColor().get(text).text }}
        </a-tag>
      </template>
      <!-- 录单日期 -->
      <template slot="createTime" slot-scope="text, record">
        <span>{{ text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-' }}</span>
      </template>
      <!-- 购车日期 -->
      <template slot="carBuyTime" slot-scope="text, record">
        <span>{{ text ? moment(text).format('YYYY-MM-DD') : '-' }}</span>
      </template>
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
      <!-- extendPrice 延保费用 -->
      <template slot="extendPrice" slot-scope="text, record">
        <span>{{ text ? text + '元' : '-' }}</span>
      </template>
      <!-- extendPrice 延保费用 -->
      <template slot="addAmount" slot-scope="text, record">
        <span>{{ text ? text + '元' : '-' }}</span>
      </template>
      <!-- extendPrice 实收金额 -->
      <template slot="payAmount" slot-scope="text, record">
        <span>{{ text ? text + '元' : '-' }}</span>
      </template>
      <!-- extendPrice 代收金额 -->
      <template slot="entrustAmount" slot-scope="text, record">
        <span>{{ text ? text + '元' : '-' }}</span>
      </template>
      <!-- saleStoreType 店方信息 -->
      <template slot="saleStoreType" slot-scope="text, record">
        <span>{{ text == 1 ? '售前' : '售后' }}</span>
      </template>
      <!-- carPurchase 新车购置价 -->
      <template slot="carPurchase" slot-scope="text, record">
        <span>{{ text ? text + '元' : '-' }}</span>
      </template>
      <!-- carMileage 当前行驶里程 -->
      <template slot="carMileage" slot-scope="text, record">
        <span>{{ text ? text + '公里' : '-' }}</span>
      </template>
      <!-- extendTime 延保年限 -->
      <template slot="extendTime" slot-scope="text, record">
        <span>{{ text ? text + '年' : '-' }}</span>
      </template>

      <!-- payType 支付方式 -->
      <template slot="payType" slot-scope="text, record">
        <span>{{ text ? payTypeFn().get(text) : '-' }}</span>
      </template>

      <!-- updateTime 审核时间 -->
      <template slot="updateTime" slot-scope="text, record">
        <span>{{ text ? moment(text).format('lll') : '-' }}</span>
      </template>

      <!-- city 所属城市 -->
      <template slot="city" slot-scope="text, record">
        <span>{{
          text
            ? text.split('/').length >= 2
              ? text.split('/')[0].length > 1
                ? text.split('/')[0] === '市辖区'
                  ? text.split('/')[1]
                  : text.split('/')[0] || '-'
                : text.split('/')[1] || '-'
              : text.split('/')[0]
              ? text.split('/')[0]
              : '-'
            : '-'
        }}</span>
      </template>

      <!-- 操作 -->
      <span slot="action" slot-scope="text, record">
        <template>
          <a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              操作
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <!-- <a-menu-item key="0">
                <a-button type="primary" size="small" @click="toDetails(record)">查看</a-button>
              </a-menu-item>
              <a-menu-item key="2">
                <a-button type="dashed" size="small" @click="toEditDetails(record)">编辑</a-button>
              </a-menu-item>
              <a-menu-item key="1">
                <a-button size="small" @click="chargeback(record)">退单</a-button>
              </a-menu-item>
              <a-menu-item key="3">
                <a-popconfirm
                  title="确定要删除？"
                  ok-text="确认删除"
                  cancel-text="取消"
                  @confirm="deleteConfirm(record)"
                  @cancel="cancel"
                >
                  <a-button type="danger" size="small">删除</a-button>
                </a-popconfirm>
              </a-menu-item>
               <a-menu-item key="4">
                <a-button type="primary" size="small" @click="viewContract(record)">合同</a-button>
              </a-menu-item> -->

              <a-menu-item :key="index" v-for="(item, index) in btnTypeAuth().get(record.operStatus)">
                <a-button
                  :type="item.btnType"
                  size="small"
                  v-if="!item.popconfirm"
                  @click="handleMenuClick(record, item.text)"
                  >{{ item.text }}</a-button
                >
                <a-popconfirm
                  v-else
                  title="确定要删除？"
                  ok-text="确认删除"
                  cancel-text="取消"
                  @confirm="deleteConfirm(record)"
                  @cancel="cancel"
                >
                  <a-button type="danger" size="small">{{ item.text }}</a-button>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </span>
    </a-table>
    <slot name="opercate"></slot>
    <a-modal
      v-model="ChargebackVisible"
      title="退订处理"
      ok-text="发送"
      cancel-text="取消"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-textarea v-model="reason" placeholder="请输入退单理由" :auto-size="{ minRows: 3, maxRows: 5 }" />
    </a-modal>
  </a-card>
</template>
<script>
import { operStatusColor, cardTypeText, btnTypeAuth, authType, payTypeFn } from '@/utils/index';
import moment from 'moment';
import { del, refundOrder } from '@/api/index';
const columns = [
  {
    title: '编号',
    customRender: (text, record, index) => `${index + 1}`, // 显示每一行的序号,
    width: 60,
    dataIndex: 'index',
    key: 'index',
    align: 'center'
  },
  {
    title: '合同状态',
    width: 100,
    align: 'center',
    dataIndex: 'operStatus',
    key: 'operStatus',
    scopedSlots: { customRender: 'operStatus' }
  },
  {
    title: '合同编号',
    width: 150,
    align: 'center',
    dataIndex: 'contractNo',
    key: 'contractNo',
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '延保项目',
    dataIndex: 'projectName',
    align: 'center',
    key: 'projectName',
    width: 200,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '录单日期',
    dataIndex: 'createTime',
    align: 'center',
    key: 'createTime',
    width: 80,
    scopedSlots: { customRender: 'createTime' },
    width: 230
  },

  {
    title: '所属门店',
    dataIndex: 'storeName',
    align: 'center',
    key: 'storeName',
    width: 150,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '经办人员',
    dataIndex: 'createUserName',
    align: 'center',
    key: 'createUserName',
    width: 100,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '店方信息',
    dataIndex: 'saleStoreType',
    align: 'center',
    key: 'saleStoreType',
    width: 200,
    scopedSlots: { customRender: 'saleStoreType' }
  },
  {
    title: '店方人员',
    dataIndex: 'saleStoreName',
    align: 'center',
    key: 'saleStoreName',
    width: 100,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '客户姓名',
    dataIndex: 'customerName',
    align: 'center',
    key: 'customerName',
    width: 100,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '证件类型',
    dataIndex: 'cardType',
    align: 'center',
    key: 'cardType',
    width: 100,
    scopedSlots: { customRender: 'cardType' }
  },
  {
    title: '证件号码',
    dataIndex: 'cardId',
    align: 'center',
    key: 'cardId',
    width: 160,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '户籍地址',
    dataIndex: 'province',
    align: 'center',
    key: 'province',
    width: 100,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '所属城市',
    dataIndex: 'city',
    align: 'center',
    key: 'city',
    width: 100,
    scopedSlots: { customRender: 'city' }
  },
  {
    title: '联系电话',
    dataIndex: 'tel',
    align: 'center',
    key: 'tel',
    width: 100,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '联系邮箱',
    dataIndex: 'email',
    align: 'center',
    key: 'email',
    width: 160,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '延保费用',
    dataIndex: 'extendPrice',
    align: 'center',
    key: 'extendPrice',
    width: 100,
    scopedSlots: { customRender: 'extendPrice' }
  },
  {
    title: '加价金额',
    dataIndex: 'addAmount',
    align: 'center',
    key: 'addAmount',
    width: 100,
    scopedSlots: { customRender: 'addAmount' }
  },
  {
    title: '实收金额',
    dataIndex: 'payAmount',
    align: 'center',
    key: 'payAmount',
    width: 100,
    scopedSlots: { customRender: 'payAmount' }
  },
  {
    title: '代收金额',
    dataIndex: 'entrustAmount',
    align: 'center',
    key: 'entrustAmount',
    width: 100,
    scopedSlots: { customRender: 'entrustAmount' }
  },
  {
    title: '支付方式',
    dataIndex: 'payType',
    align: 'center',
    key: 'payType',
    width: 100,
    scopedSlots: { customRender: 'payType' }
  },
  {
    title: '车型名称',
    dataIndex: 'carModel',
    align: 'center',
    key: 'carModel',
    width: 180,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '车牌编号',
    dataIndex: 'carLicense',
    align: 'center',
    key: 'carLicense',
    width: 120,
    scopedSlots: { customRender: 'carLicense' }
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
    title: '发动机号',
    dataIndex: 'carEngine',
    align: 'center',
    key: 'carEngine',
    width: 100,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '新车购置价',
    dataIndex: 'carPurchase',
    align: 'center',
    key: 'carPurchase',
    width: 130,
    scopedSlots: { customRender: 'carPurchase' }
  },
  {
    title: '当前行驶里程',
    dataIndex: 'carMileage',
    align: 'center',
    key: 'carMileage',
    width: 130,
    scopedSlots: { customRender: 'carMileage' }
  },
  {
    title: '购车日期',
    dataIndex: 'carBuyTime',
    align: 'center',
    key: 'carBuyTime',
    width: 200,
    scopedSlots: { customRender: 'carBuyTime' }
  },
  {
    title: '延保年限',
    dataIndex: 'extendTime',
    align: 'center',
    key: 'extendTime',
    width: 100,
    scopedSlots: { customRender: 'extendTime' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    align: 'center',
    key: 'remark',
    width: 450,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '审核人',
    dataIndex: 'examineUserName',
    align: 'center',
    key: 'examineUserName',
    width: 80,
    customRender: text => {
      return text || '-';
    }
  },
  {
    title: '审核时间',
    dataIndex: 'updateTime',
    align: 'center',
    key: 'updateTime',
    width: 150,
    scopedSlots: { customRender: 'updateTime' }
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
    btnTypeAuth,
    payTypeFn,
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
    // 查看
    toDetails(e) {
      console.log(e);
      if (e.operStatus == 4) {
        this.$router.push({
          path: '/aduit/result',
          query: {
            orderNo: e.orderNo,
            contractNo: e.contractNo,
            operStatus: e.operStatus,
            updateTime: e.updateTime,
            details: 1,
            disabled: 1
          }
        });
        return false;
      }
      // aduit/result?contractNo=ZQ16530544011294193&updateTime=1653054401129&operStatus=2
      this.$router.push({
        path: '/ewbusiness/newfrom',
        query: {
          contractNo: e.contractNo || '',
          orderNo: e.orderNo,
          details: 1,
          disabled: 1
        }
      });
    },
    // 去详情编辑
    toEditDetails(e) {
      console.log(e);
      if (e.operStatus == 4) {
        this.$router.push({
          path: '/aduit/result',
          query: {
            orderNo: e.orderNo,
            contractNo: e.contractNo,
            operStatus: e.operStatus,
            updateTime: e.updateTime,
            details: 2, // 编辑
            edit: 1
          }
        });
        return false;
      }
      this.$router.push({
        path: '/ewbusiness/newfrom',
        query: {
          contractNo: e.contractNo || '',
          orderNo: e.orderNo,
          details: 2, // 编辑
          edit: 1
        }
      });
    },
    // 退定处理
    chargeback(e) {
      this.chargebackSelectValue = e;
      this.ChargebackVisible = true;
    },
    // 关闭退定处理弹框
    handleCancel() {
      this.ChargebackVisible = false;
      this.reason = '';
    },
    // 点击确定 执行接口
    handleOk() {
      if (!this.reason) {
        this.$message.error('请输入退订理由');
        return false;
      }
      this.ChargebackVisible = false;
      this.refundOrder();
    },
    // 删除
    async deleteConfirm(e) {
      const that = this;
      try {
        const obj = {
          orderNos: [e.orderNo]
        };
        const res = await del(obj);
        if (res.code === 200) {
          that.$message.success('删除成功');
          that.$emit('listExtendOrder');
        } else {
          that.$message.error(res.message);
        }
      } catch (error) {
        that.$message.error(res.message);
      }
    },
    // 退回订单
    async refundOrder() {
      const that = this;
      const obj = {
        orderNo: that.chargebackSelectValue?.orderNo,
        reason: that.reason
      };
      const res = await refundOrder(obj);
      that.reason = '';
      if (res.code === 200) {
        that.$message.success('退单成功');
        that.$emit('listExtendOrder');
      } else {
        that.$message.error(res.message);
      }
    },
    // 查看合同
    viewContract(e) {
      this.$router.push({
        path: '/view/contract',
        query: {
          contractNo: e.contractNo || '',
          orderNo: e.orderNo || ''
        }
      });
    },
    // 只有查看权限的禁止删除
    getCheckboxProps(record) {
      return {
        props: {
          /***
           * 全部默认禁止选中
             disabled: true,
             某几项默认禁止选中(R: 当state等于1时)
             2、待审核：查看
             3、已生效：查看  （管理员或审核人员：编辑，退单，删除）
           * 
           * */
          disabled: (record.operStatus == 3 && !authType()) || record.operStatus == 2
          // defaultChecked: record.state == 1,
        }
      };
    },
    // 按钮权限点击
    handleMenuClick(e, text) {
      console.log(e);
      switch (text) {
        case '查看':
          this.toDetails(e);
          break;
        case '编辑':
          this.toEditDetails(e);
          break;
        case '合同':
          this.viewContract(e);
          break;
        case '退单':
          this.chargeback(e);
        default:
          break;
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
