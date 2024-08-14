<template>
  <a-card :loading="loadingCard" size="small" :hoverable="true" :bordered="false">
    <div id="components-form-demo-advanced-search">
      <a-form class="ant-advanced-search-form" ref="searchfrom" :form="form" @submit="handleSearch" layout="inline"
        :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" autoComplete="off">
        <a-form-item label="所属门店" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-select allowClear placeholder="请选择所属门店" style="width: 200px" v-decorator="['storeId']">
            <a-select-option v-for="(item, index) in userStoreData" :key="index" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <span slot="label">合同编号</span>
          <a-input allowClear placeholder="请输入合同编号" style="width: 200px" v-decorator="['contractNo']" />
        </a-form-item>

        <a-form-item label="经办人员" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-select allowClear placeholder="请选择经办人员" style="width: 200px" v-decorator="['createUserName']">
            <a-select-option v-for="(item, index) in getlistCreateUserData" :key="index" :value="item.createUserId">
              {{ item.createUserName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="延保项目" v-show="expand" :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol">
          <a-select allowClear placeholder="请选择延保项目" style="width: 200px" v-decorator="['projectId']">
            <!-- <a-select-option value="1"> 延保项目 1 </a-select-option>
            <a-select-option value="2"> 延保项目 2 </a-select-option>
            <a-select-option value="3"> 延保项目 3 </a-select-option> -->
            <a-select-option v-for="(item, index) in getByStoreIdAndCarIdData" :key="index" :value="item.id">
              {{ item.prodName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item v-show="expand" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <span slot="label">客户姓名</span>
          <a-input allowClear placeholder="请输入客户姓名" style="width: 200px" v-decorator="['customerName']" />
        </a-form-item>

        <a-form-item v-show="expand" label="车牌号码" :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol">
          <a-input allowClear placeholder="请输入车牌号码" v-decorator="['carLicense']" style="width: 200px">
            <a-select slot="addonBefore" v-decorator="['carLicenseNum']" style="width: 60px" allowClear
              placeholder="选择">
              <a-select-option v-for="(item, index) in plateList" :key="index" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-input>
        </a-form-item>

        <a-form-item v-show="expand" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <span slot="label">车架编号</span>
          <a-input allowClear placeholder="请输入车架编号" style="width: 200px" v-decorator="['carCode']" />
        </a-form-item>

        <a-form-item v-show="expand" label="店方信息" :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol">
          <a-input allowClear placeholder="请输入店方人员" v-decorator="['saleStoreName']" style="width: 200px">
            <a-select slot="addonBefore" v-decorator="['saleStoreType']" style="width: 70px" allowClear
              placeholder="选择">
              <a-select-option value="1"> 售前 </a-select-option>
              <a-select-option value="2"> 售后 </a-select-option>
            </a-select>
          </a-input>
        </a-form-item>

        <a-form-item v-show="expand" label="录单时间：" :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol">
          <a-range-picker allowClear style="width: 100%" :placeholder="['开始日期', '结束日期']" v-decorator="['purchasetime']"
            :show-time="{
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
        <div style="width:100%;display:flex;justify-content: space-between;">
          <span>
            <a-button type="primary" html-type="submit" icon="search"> 搜索 </a-button>
            <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle">
              {{ expand ? '收起' : '展开' }}
              <a-icon :type="expand ? 'up' : 'down'" />
            </a>
          </span>
          <a-popconfirm style="width: 150px" title="确定要导出？" ok-text="确认导出" cancel-text="取消"
            @confirm="confirmexportFinance" @cancel="cancel">
            <a-button type="dashed" icon="export"> 导出 </a-button>
          </a-popconfirm>
        </div>
      </a-form>
    </div>
  </a-card>
</template>
<script>
import moment from 'moment';
import { plateList } from '@/assets/utils/plate'
import { userStore, listAll, listCreateUser, exportFinance } from '@/api/index'
export default {
  name: 'carinfo',
  data() {
    return {
      expand: true,
      loadingCard: true,
      form: this.$form.createForm(this, { name: 'advanced_search' }),
      getByStoreIdAndCarIdData: [],
      // 所属门店
      userStoreData: '',
      // 全部经办人员数据
      getlistCreateUserData: [],
      plateList: plateList(),
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
    moment,
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
        this.$parent.finance(values, null)
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
    },
    async confirmexportFinance() {
      try {
        const obj = this.$refs.searchfrom.form.getFieldsValue()
        obj.startTime = obj.purchasetime ? moment(obj?.purchasetime[0]).format('YYYY-MM-DD HH:mm:ss') : undefined
        obj.endTime = obj.purchasetime ? moment(obj?.purchasetime[1]).format('YYYY-MM-DD HH:mm:ss') : undefined
        delete obj.purchasetime
        console.log(obj)
        const res = await exportFinance(obj)
        if (res.code === 200) {
          this.$message.success('导出成功')
          window.open(res?.data?.fileUrl)
          this.handleSearch()
        } else {
          this.$message.error(res.message)
        }
      } catch (error) {

      }
    },
    cancel() {
      // this.$message.success('操作成功');
    },
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
