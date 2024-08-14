<template>
  <a-card :loading="loadingCard" size="small" :hoverable="true" :bordered="false">
    <div id="components-form-demo-advanced-search">
      <a-form class="ant-advanced-search-form" layout="inline" :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol" :form="form" @submit="handleSearch" autoComplete="off">
        <!-- <a-col :span="10">
            <a-form-item label="统计范围：">
              <a-range-picker
                style="width: 100%"
                :placeholder="['开始日期', '结束日期']"
                v-decorator="['purchasetime']"
              >
                <template slot="dateRender" slot-scope="current">
                  <div class="ant-calendar-date" :style="getCurrentStyle(current)">
                    {{ current.date() }}
                  </div>
                </template>
              </a-range-picker>
            </a-form-item>
          </a-col> -->
        <a-form-item label="延保项目" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-select allowClear placeholder="请选择延保项目" style="width: 200px" v-decorator="['projectId']">
            <!-- <a-select-option value="1"> 延保项目 1 </a-select-option>
            <a-select-option value="2"> 延保项目 2 </a-select-option>
            <a-select-option value="3"> 延保项目 3 </a-select-option> -->
            <a-select-option v-for="item, index in getByStoreIdAndCarIdData" :key="index" :value="item.id">
              {{ item.prodName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="所属门店" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-select allowClear placeholder="请选择所属门店" style="width: 200px" v-decorator="['storeId']">
            <a-select-option v-for="item, index in userStoreData" :key="index" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="经办人员" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-select allowClear placeholder="请选择经办人员" style="width: 200px" v-decorator="['createId']">
            <a-select-option v-for="item, index in getlistCreateUserData" :key="index" :value="item.createUserId">
              {{ item.createUserName }}
            </a-select-option>
          </a-select>
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
import { userStore, listAll, listCreateUser } from '@/api/index'

export default {
  name: 'carinfo',
  data() {
    return {
      expand: false,
      loadingCard: true,
      form: this.$form.createForm(this, { name: 'advanced_search' }),
      getByStoreIdAndCarIdData: [],
      // 所属门店
      userStoreData: '',
      // 全部经办人员数据
      getlistCreateUserData: []
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
  created() {
    this.listAll()
    this.userStores()
    this.listCreateUser()
  },
  methods: {
    // 查询全部经办人员 
    async listCreateUser() {
      const obj = {}
      const res = await listCreateUser(obj)
      this.getlistCreateUserData = res.data
    },
    // 用户的所属门店
    async userStores() {
      const res = await userStore()
      this.userStoreData = res.data.filter((item) => item?.id)
      console.log(this.userStoreData)
    },
    // 延保项目
    async listAll() {
      const obj = {}
      const res = await listAll(obj)
      this.getByStoreIdAndCarIdData = res.data
    },
    handleSearch(e) {
      this.form.validateFields((error, values) => {
        this.$parent.collectDetail(values, null)
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

// .ant-advanced-search-form .ant-form-item {
//   display: flex;
// }

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
