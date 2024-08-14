<template>
  <a-card title="支付信息" :loading="loadingCard" :hoverable="true" :bordered="false">
    <div id="components-form-demo-advanced-search">
      <a-form layout="inline" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
        class="ant-advanced-search-form" :form="form" @submit="handleSearch" autoComplete="off">
        <a-form-item label="支付方式" has-feedback :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol">
          <a-select allowClear :disabled="isDisabled" default-initialValue="1" placeholder="请选择支付方式"
            style="width: 200px" v-decorator="['payType', { rules: [{ required: true, message: '请选择支付方式' }] }]">
            <!-- 1、微信 2、支付宝 3、现金 4、刷卡   -->
            <a-select-option value="1"> 微信 </a-select-option>
            <a-select-option value="2"> 支付宝 </a-select-option>
            <a-select-option value="3"> 现金 </a-select-option>
            <a-select-option value="4"> 刷卡 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="实收金额" has-feedback :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol">
          <a-input-number :disabled="isDisabled" :formatter="value => `${value}元`" placeholder="请填写实收金额"
            id="inputNumber" style="width: 100%;" v-decorator="[
              'payAmount',
              {
                rules: [{ required: true, message: '请填写实收金额' }]
              }
            ]" :min="0" :max="90000000" />
        </a-form-item>
        <a-form-item label="代收金额" has-feedback :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol">
          <a-input-number :disabled="isDisabled" :formatter="value => `${value}元`" placeholder="请填写代收金额"
            id="inputNumber" style="width: 100%;" v-decorator="[
              'entrustAmount',
              {
                rules: [{ required: false, message: '请填写代收金额' }]
              }
            ]" :min="0" :max="90000000" />
        </a-form-item>
        <a-form-item label="加带金额" has-feedback :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol">
          <a-input-number :disabled="isDisabled" :formatter="value => `${value}元`" placeholder="请填写加带金额"
            id="inputNumber" style="width: 100%;" v-decorator="[
              'addAmount',
              {
                rules: [{ required: false, message: '请填写加带金额' }]
              }
            ]" :min="0" :max="90000000" />
        </a-form-item>
        <a-form-item label="备注说明" has-feedback :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol">
          <a-input :disabled="isDisabled" allowClear placeholder="请输入备注说明" v-decorator="['remark']" style="width: 600px"
            :maxLength="50" />
        </a-form-item>
      </a-form>
    </div>
  </a-card>
</template>
<script>

const options = [
  {
    code: 'zhejiang',
    name: '北京市',
    items: [
      {
        code: 'hangzhou',
        name: '北京市',
        items: [
          {
            code: 'xihu',
            name: '朝阳区'
          }
        ]
      }
    ]
  }
];
export default {
  name: 'PaymentInformation',
  props: {
    payInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isDisabled: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      expand: false,
      loadingCard: true,
      form: this.$form.createForm(this, { name: 'advanced_search' }),
      options,
      id: '',
      orderNo: '',
      dataForm: {},
    };
  },
  computed: {
    count() {
      return this.expand ? 11 : 7;
    },
    formItemLayout() {
      const { formLayout } = this;
      return formLayout === 'horizontal'
        ? {
          labelCol: { span: 6 },
          wrapperCol: { span: 10 },
        }
        : {};
    }
  },
  updated() {
    console.log('updated');
  },
  methods: {
    handleSearch(e) {
      // e.preventDefault();
      this.form.validateFields((error, values) => {
        // console.log('error', error);
        console.log('form结果: ', values);
        if (error) return false
        values.createTime = Date.now()
        values.id = this.id
        values.orderNo = this.orderNo
        this.$emit('handlePaymentInformation', values);
        // return values
      });
    },

    handleReset() {
      this.form.resetFields();
    },

    toggle() {
      this.expand = !this.expand;
    },
    onChange(value) {
      console.log(value);
    },
    setFieldsValueFromDetails(e) {
      this.form.setFieldsValue({
        payType: e?.payType || undefined,
        payAmount: e?.payAmount || undefined,
        entrustAmount: e?.entrustAmount || undefined,
        addAmount: e?.addAmount || undefined,
        remark: e?.remark || undefined,
      })
      this.orderNo = e?.orderNo || undefined
      this.id = e?.id || undefined
      this.dataForm.orderNo = e?.orderNo || undefined
      this.dataForm.id = e?.id || undefined
    }
  },
  mounted() {
    this.loadingCard = false;
  },
  watch: {
    payInfo: {
      handler(newVal) {
        if (newVal) {
          this.setFieldsValueFromDetails(newVal)
        }
      },
      deep: true,
    }
  },
};
</script>
<style lang="scss" scoped>
.ant-advanced-search-form {
  // padding: 24px;
  background: #fff;
  border-radius: 10px;
}

// .ant-advanced-search-form .ant-form-item {
//   display: flex;
// }

// .ant-advanced-search-form .ant-form-item-control-wrapper {
//   flex: 1;
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
