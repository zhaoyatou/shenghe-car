<template>
  <a-card :loading="loadingCard" size="small" :hoverable="true" :bordered="false">
    <div id="components-form-demo-advanced-search">
      <a-form class="ant-advanced-search-form" layout="inline" :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol" :form="form" @submit="handleSearch" autoComplete="off">
        <!-- <a-form-item label="统计类型：" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
            <a-select
              allowClear
              default-initialValue="1"
              placeholder="请选择统计类型："
              style="width: 200px"
              v-decorator="['stores']"
            >
              <a-select-option value="1"> 按销售 1 </a-select-option>
              <a-select-option value="2"> 按门店 2 </a-select-option>
              <a-select-option value="3"> 按门店 3 </a-select-option>
            </a-select>
          </a-form-item> -->
        <a-form-item label="统计时间：" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-range-picker style="width: 100%" :placeholder="['开始日期', '结束日期']" v-decorator="['purchasetime']" :show-time="{
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
        <a-form-item>
          <a-button type="primary" html-type="submit" icon="search"> 搜索 </a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-card>
</template>
<script>
import moment from 'moment';
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
        // console.log('form结果: ', values);
        values.pageNum = 1
        this.$parent.business(values, null)
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
