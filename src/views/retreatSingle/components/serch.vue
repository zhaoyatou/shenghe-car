<template>
  <a-card :loading="loadingCard" size="small" :hoverable="true" :bordered="false">
    <div id="components-form-demo-advanced-search">
      <a-form class="ant-advanced-search-form" :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol" layout="inline" :form="form" @submit="handleSearch" autoComplete="off">
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <span slot="label">合同编号</span>
          <a-input placeholder="请输入合同编号" v-decorator="['contractNo']" allowClear />
        </a-form-item>
        <a-form-item label="录单日期：" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-range-picker style="width: 100%" :placeholder="['开始日期', '结束日期']" v-decorator="['purchasetime']"
            :disabledDate="disabledDate" allowClear :show-time="{
              hideDisabledOptions: true,
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
            }" format="YYYY-MM-DD">
            <template slot="dateRender" slot-scope="current">
              <div class="ant-calendar-date" :style="getCurrentStyle(current)">
                {{ current.date() }}
              </div>
            </template>
          </a-range-picker>
        </a-form-item>
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <span slot="label">客户姓名</span>
          <a-input placeholder="请输入客户姓名" v-decorator="['customerName']" allowClear />
        </a-form-item>
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-button type="primary" html-type="submit"> 搜索 </a-button>
          <!-- <a-button :style="{ marginLeft: '8px' }" @click="handleReset"> 清除 </a-button>-->
        </a-form-item>
      </a-form>
    </div>
  </a-card>
</template>
<script>
import moment from 'moment';
import { disabledDate } from '@/utils/index'
export default {
  name: 'carinfo',
  data() {
    return {
      expand: false,
      loadingCard: true,
      form: this.$form.createForm(this, { name: 'advanced_search' })
    };
  },
  computed: {
    count() {
      return this.expand ? 11 : 7;
    },
    formItemLayout() {
      const { formLayout } = this;
      return formLayout === 'inline'
        ? {
          labelCol: { span: 12 },
          wrapperCol: { span: 10 },
        }
        : {};
    }
  },
  updated() {
    console.log('updated');
  },
  methods: {
    moment,
    disabledDate,
    handleSearch(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        // console.log('error', error);
        values.startTime = ''
        values.endTime = ''
        if (values?.purchasetime?.length > 0) {
          values.startTime = moment(values?.purchasetime[0]).format('YYYY-MM-DD HH:mm:ss')
          values.endTime = moment(values?.purchasetime[1]).format('YYYY-MM-DD HH:mm:ss')
          delete values?.purchasetime
        }
        console.log('form结果: ', values);
        values.pageNum = 1
        this.$parent.refundList(values, null)
      });
    },

    handleReset() {
      this.form.resetFields();
    },

    toggle() {
      this.expand = !this.expand;
      this.$nextTick(() => {
        this.$parent.getHeights();
      });
    },
    getCurrentStyle(current, today) {
      const style = {};
      if (current.date() === 1) {
        style.border = '1px solid #1890ff';
        style.borderRadius = '50%';
      }
      return style;
    }
  },
  mounted() {
    this.loadingCard = false;
  }
};
</script>
<style lang="scss" scoped>
.ant-advanced-search-form {
  // padding: 24px;
  background: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
}

.ant-advanced-search-form .ant-form-item {
  // display: flex;
  margin-bottom: 0;
}

// .ant-advanced-search-form .ant-form-item-control-wrapper {
//   flex: 1;
// }

// #components-form-demo-advanced-search .ant-form {
//   max-width: none;
// }
#components-form-demo-advanced-search .ant-form {
  max-width: none;
  display: flex;
  justify-content: flex-start;
  flex-direction: unset;
  justify-content: space-between;
  flex-wrap: wrap;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
</style>
