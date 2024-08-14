<template>
  <a-card title="销售信息" size="small" :loading="loadingCard" :hoverable="true" :bordered="false">
    <div id="components-form-demo-advanced-search">
      <a-form layout="inline"  :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" class="ant-advanced-search-form" :form="form" @submit="handleSearch" autoComplete = "off">
        <a-form-item label="经办人员" has-feedback :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" >
          <a-input
            allowClear
            disabled
            style="width: 200px"
            placeholder="请输入经办人员"
            v-decorator="[
              'createUserName',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入经办人员'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
         <!-- <a-form-item label="经办人员：" has-feedback  :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-select
            :disabled="isDisabled"
            allowClear
            placeholder="请选择经办人员"
            style="width: 200px"
            v-decorator="['createUserName', { rules: [{ required: true, message: '请选择经办人员' }] }]"
          >

              <a-select-option v-for="item, index in userStoreData" :key="index" :value="item.channelName">
              {{ item.channelName }}
            </a-select-option>
          </a-select>
        </a-form-item> -->
        <a-form-item label="店方信息" has-feedback :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" >
          <a-input
            allowClear
            :disabled="isDisabled"
            placeholder="请输入店方信息"
            v-decorator="[
              'saleStoreName',
              {
                rules: [{ required: true, message: '请输入店方信息' }]
              }
            ]"
            style="width: 300px"
          >
            <a-select slot="addonBefore" :disabled="isDisabled" v-decorator="['saleStoreType', { initialValue: '1' }]" style="width: 70px">
              <a-select-option value="1"> 售前 </a-select-option>
              <a-select-option value="2"> 售后 </a-select-option>
            </a-select>
          </a-input>
        </a-form-item>


        <!-- <a-row>
          <a-col :span="24" :style="{ textAlign: 'right' }">
            <a-button type="primary" html-type="submit"> 确定 </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset"> 清除 </a-button>
            <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle">
              {{ expand ? '收起' : '展开' }} <a-icon :type="expand ? 'up' : 'down'" />
            </a>
          </a-col>
        </a-row> -->
      </a-form>
    </div>
  </a-card>
</template>
<script>
import { userStore } from '@/api/index'
export default {
  name: 'SalesInformation',
  props: {
    detailsData: {
      type: Object,
      default:()=>{
        return {}
      }
    },
    isDisabled: {
      type: Boolean,
      default: ()=>{
        return false
      }
    }
  },
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
      return formLayout === 'horizontal'
        ? {
            labelCol: { span: 6 },
            wrapperCol: { span: 10 },
          }
        : {};
    }
  },
  created() {
    this.userStores()
  },
  updated() {
    console.log('updated');
  },
  methods: {
        // 用户的所属门店
    async userStores() {
      const res = await userStore()
      this.userStoreData = res.data.filter((item)=>item?.id)
      console.log(this.userStoreData)
    },
    handleSearch(e) {
      // e.preventDefault();
      this.form.validateFields((error, values) => {
        // console.log('error', error);
        console.log('form结果: ', values);
        if (error) return false
        values.createTime = Date.now()
        values.id = this.id
        values.orderNo = this.orderNo
        this.$emit('handleSalesInformation', values);
        // return values;
      });
    },

    handleReset() {
      this.form.resetFields();
    },

    toggle() {
      this.expand = !this.expand;
    },
    setFieldsValueFromDetails(e) {
      this.form.setFieldsValue({
        saleStoreType: e?.saleStoreType || undefined,
        saleStoreName:e?.saleStoreName || undefined,
        createUserName: e?.createUserName || undefined,
      })
      this.orderNo = e?.orderNo || undefined
      this.id = e?.id || undefined
    },
    createUserNameDefault() {
      this.$nextTick(()=>{
            this.form.setFieldsValue({
            createUserName:  this.$store?.state?.user?.userInfo?.realName
          })
      })
    }
       
  },
  mounted() {
    this.loadingCard = false;
    this.createUserNameDefault()
  },
  watch: {
    detailsData: {
      handler(newVal) {
        if(newVal) {
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
