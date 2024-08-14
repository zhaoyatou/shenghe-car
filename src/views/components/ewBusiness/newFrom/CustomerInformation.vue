<template>
  <a-card title="客户信息" :loading="loadingCard" :hoverable="true" :bordered="false">
    <div id="components-form-demo-advanced-search">
      <a-form layout="inline" class="ant-advanced-search-form" :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol" :form="form" @submit="handleSearch" autoComplete="off">
        <a-form-item label="客户姓名" has-feedback :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol">
          <a-input onmouseover="this.title=this.value" allowClear placeholder="请输入客户姓名" :disabled="isDisabled" style="width: 200px" v-decorator="[
            'customerName',
            {
              rules: [
                // {
                //   type: 'email',
                //   message: 'The input is not valid E-mail!'
                // },
                {
                  required: true,
                  message: '请输入客户姓名'
                }
              ]
            }
          ]" />
        </a-form-item>

        <a-form-item label="使用人姓名" has-feedback :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol">
          <a-input allowClear :disabled="isDisabled" placeholder="请输入使用人姓名" style="width: 200px"
            v-decorator="['useName']" />
        </a-form-item>





        <a-form-item label="联系电话" has-feedback :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol">
          <a-input allowClear :disabled="isDisabled" placeholder="请输入联系电话" style="width: 200px" v-decorator="[
            'tel',
            {
              rules: [
                {
                  required: true,
                  message: '请输入联系电话'
                },
                {
                  validator: isPhone
                }
              ]
            }
          ]" />
        </a-form-item>


        <a-form-item label="电子邮箱" has-feedback :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol">
          <a-input onmouseover="this.title=this.value"  allowClear :disabled="isDisabled" placeholder="1337836843@qq.com" style="width: 200px" v-decorator="[
            'email',
            {
              rules: [
                {
                  required: false,
                  message: '请输入E-mail'
                },
                {
                  validator: IsEmail,
                }
              ]
            }
          ]" />
        </a-form-item>
        <a-form-item label="证件类型" has-feedback :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol">
          <a-input allowClear :disabled="isDisabled" placeholder="请输入证件编号" style="width: 300px" v-decorator="[
            'cardId',
            {
              rules: checkNick != 1 ? [{ required: true, message: '请输入证件编号' }] : [{ validator: regIdNo }]
            },
          ]">
            <a-select slot="addonBefore" v-decorator="['cardType', { initialValue: '1' }]" style="width: 80px"
              placeholder="选择类型" :disabled="isDisabled" @change="selectCardType">
              <a-select-option value="1"> 身份证 </a-select-option>
              <a-select-option value="2"> 驾驶证 </a-select-option>
              <a-select-option value="3"> 护照</a-select-option>
              <a-select-option value="4"> 港澳台证件 </a-select-option>
            </a-select>
          </a-input>
        </a-form-item>

        <a-form-item style="margin-bottom: 0px;display: flex;justify-content: space-between;"
          :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <span slot="label"> 户籍地址 </span>
          <a-form-item has-feedback :style="{ display: 'inline-block' }">
            <a-cascader :disabled="isDisabled" :field-names="{ label: 'label', value: 'label', children: 'children' }"
              :options="options" :show-search="{ filter }" placeholder="请选择户籍地址" v-model="areaValue"
              @change="onChange" />
            <!-- ['北京','北京市', '海淀区'] -->
          </a-form-item>
          <span :style="{ display: 'inline-block', width: '12px', textAlign: 'center' }"> </span>
          <a-form-item :style="{ display: 'inline-block' }">
            <a-input style="width: 300px" :disabled="isDisabled" placeholder="请填写详细地址" :maxLength="40" v-decorator="[
              'address',
              {
                rules: [{ required: true, message: '请填写详细地址', whitespace: true }]
              }
            ]" />
          </a-form-item>
        </a-form-item>
        <!-- <a-row>
          <a-col :span="24" :style="{ textAlign: 'right' }">
            <a-button type="primary" html-type="submit"> 确定 </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset"> 清除 </a-button>
            <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle">
              {{ expand ? '收起' : '展开' }}
              <a-icon :type="expand ? 'up' : 'down'" />
            </a>
          </a-col>
        </a-row> -->
      </a-form>
    </div>
  </a-card>
</template>
<script>
import options from '@/assets/utils/city';
import {
  IsEmail,
  isPhone,
  regIdNo,
} from '@/utils/validate'
export default {
  name: 'CustomerInformation',
  props: {
    selectStoreInfos: {
      type: Object,
      default: () => {
        return {}
      }
    },
    customerInfo: {
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
      options: options.options,
      dataForm: {
        id: "",
        orderNo: "",
        extendPrice: ''
      },
      areaValue: [],
      checkNick: 1
    };
  },
  watch: {
    selectStoreInfos: {
      handler(newVal, oldVal) {
        // console.log('oldVal:', oldVal)
        // console.log('newVal:', newVal)
        if (newVal) {
          this.form.setFieldsValue({
            // address: newVal.address,
            defaultCity: newVal.city?.split('-')
          })
        }
      },
      deep: true,
    },
    customerInfo: {
      handler(newVal, oldVal) {
        // console.log('oldVal:', oldVal)
        // console.log('newVal:', newVal)
        if (newVal) {
          this.setFieldsValueFromDetails(newVal)
        }
      },
      deep: true,
    },
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
    // console.log('updated');
  },
  methods: {
    IsEmail,
    isPhone,
    regIdNo,
    filter(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    },
    handleSearch(e) {
      // e.preventDefault();
      this.form.validateFields((error, values) => {
        // console.log('error', error);
        console.log('form结果: ', values);
        if (error) return false
        // return values;
        if (!this.dataForm?.province) {
          this.$message.warning('请选择户籍地址')
          return false
        }
        this.dataForm.createTime = Date.now()
        const newObj = { ...this.dataForm, ...values };
        this.$emit('handleCustomerInformation', newObj);
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
      this.dataForm.province = value[0]
      this.dataForm.city = value[1] + '/' + value[2]
    },
    setFieldsValueFromDetails(e) {
      this.form.setFieldsValue({
        customerName: e.customerName || undefined,
        useName: e.useName || undefined,
        tel: e.tel || undefined,
        cardId: e.cardId || undefined,
        cardType: e.cardType || undefined,
        email: e.email || undefined,
        address: e.address || undefined,
      })

      let city, area
      if (e?.city?.split('/')?.length == 2) {
        city = e?.city?.split('/')[0]
        area = e?.city?.split('/')[1]
      } else {
        city = e?.city || undefined
        area = undefined
      }

      setTimeout(() => {
        const inNull = e.province && city || area
        if (inNull) {
          this.areaValue = [e.province || undefined, city || undefined, area || undefined]
        } else {
          this.areaValue = undefined
        }

      }, 900)
      // this.dataForm.extendPrice = e.extendPrice || 0
      this.dataForm.orderNo = e?.orderNo || undefined
      this.dataForm.id = e?.id || undefined
      this.dataForm.province = e?.province || undefined
      this.dataForm.city = e?.city || undefined
      this.checkNick = e?.cardType
    },
    selectCardType(e) {
      this.checkNick = e
      this.$nextTick(() => {
        this.form.validateFields(['cardId'], { force: true });
      });
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
