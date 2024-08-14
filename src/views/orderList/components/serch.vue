<template>
  <a-card :loading="loadingCard" size="small" :hoverable="true" :bordered="false">
    <div id="components-form-demo-advanced-search">
      <a-form class="ant-advanced-search-form" :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol" :form="form" layout="inline" @submit="handleSearch" autoComplete="off">
        <a-form-item label="所属城市" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-select allowClear show-search default-initialValue="1" placeholder="请选择所属城市" style="width: 200px"
            v-decorator="['city']">
            <!-- <a-select-option value="1"> 北京 </a-select-option>
              <a-select-option value="2"> 天津 </a-select-option>
              <a-select-option value="3"> 河北 </a-select-option> -->
            <a-select-option v-for="item in citys" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="合同状态" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-select allowClear default-initialValue="1" placeholder="请选择合同状态" style="width: 200px"
            v-decorator="['operStatus']">
            <!-- 合同状态：1，待审核 2，已生效 3，未生效 4，草稿 -->
            <a-select-option value="2"> 待审核 </a-select-option>
            <a-select-option value="3"> 已生效 </a-select-option>
            <a-select-option value="4"> 未生效 </a-select-option>
            <a-select-option value="1"> 草稿 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <span slot="label">合同编号</span>
          <a-input placeholder="请输入合同编号" style="width: 200px" v-decorator="['contractNo']" allowClear />
        </a-form-item>

        <a-form-item label="所属门店" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
          v-show="expand">
          <a-select allowClear placeholder="请选择所属门店" style="width: 200px" v-decorator="['storeId']">
            <a-select-option v-bind:title="item.name" v-for="item, index in userStoreData" :key="index" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
       <!-- <a-form-item label="经办人员" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
          v-show="expand">
          <a-select allowClear placeholder="请选择经办人员" style="width: 200px" v-decorator="['createUserName']">
            <a-select-option v-for="item, index in getlistCreateUserData" :key="index" :value="item.createUserId">
              {{ item.createUserName }}
            </a-select-option>
          </a-select>
        </a-form-item> -->
		<a-form-item allowClear :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
		  v-show="expand">
		  <span slot="label">经办人员</span>
		  <a-input placeholder="请输入经办人员" style="width: 200px" v-decorator="['createUserName']" allowClear />
		</a-form-item>
        <a-form-item allowClear :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
          v-show="expand">
          <span slot="label">客户姓名</span>
          <a-input placeholder="请输入客户姓名" style="width: 200px" v-decorator="['customerName']" allowClear />
        </a-form-item>

        <a-form-item label="车牌号码" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
          v-show="expand">
          <a-input allowClear placeholder="请输入车牌号码" v-decorator="['carLicense']" style="width: 200px">
            <a-select slot="addonBefore" v-decorator="['carLicenseNum']" style="width: 60px" allowClear
              placeholder="选择">
              <a-select-option v-for="item, index in plateList" :key="index" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-input>
        </a-form-item>
        <a-form-item label="车架编码" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
          v-show="expand">
          <a-input allowClear placeholder="请输入车架编码" v-decorator="['carCode']" />
        </a-form-item>
        <a-form-item label="店方信息" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
          v-show="expand">
          <a-input allowClear placeholder="请输入店方人员" v-decorator="['saleStoreName']" style="width: 200px">
            <a-select slot="addonBefore" v-decorator="['saleStoreType']" style="width: 65px" allowClear
              placeholder="选择">
              <a-select-option value="1"> 售前 </a-select-option>
              <a-select-option value="2"> 售后 </a-select-option>
            </a-select>
          </a-input>
        </a-form-item>
        <a-form-item label="延保项目" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
          v-show="expand">
          <a-select allowClear default-initialValue="1" placeholder="请选择延保项目" style="width: 200px"
            v-decorator="['projectId']">
            <a-select-option v-for="item, index in getByStoreIdAndCarIdData" :key="index" :value="item.id">
              {{ item.prodName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item allowClear :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
          v-show="expand">
          <span slot="label">使用人姓名</span>
          <a-input placeholder="请输入使用人姓名" style="width: 200px" v-decorator="['useName']" allowClear />
        </a-form-item>
        <a-form-item label="录单日期" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
          v-show="expand">
          <a-range-picker style="width: 100%" :placeholder="['开始日期', '结束日期']" v-decorator="['purchasetime']" allowClear
            :disabledDate="disabledDate" :show-time="{
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
        <p></p>
        <div style="width:100%;display:flex;justify-content: space-between;">
          <span>
            <a-button type="primary" html-type="submit" icon="search"> 搜索 </a-button>
            <!--<a-button :style="{ marginLeft: '8px' }" @click="handleReset"> 清除 </a-button>-->
            <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle">
              {{ expand ? '收起' : '展开' }}
              <a-icon :type="expand ? 'up' : 'down'" />
            </a>
          </span>
          <!-- <a-button type="link"> 批量导入 </a-button> -->
        </div>
      </a-form>
    </div>
  </a-card>
</template>
<script>
import newCitys from '@/assets/utils/citys'
import { plateList } from '@/assets/utils/plate'
import { userStore, listAll, listCreateUser } from '@/api/index'
import { disabledDate } from '@/utils/index'
import moment from 'moment';
export default {
  name: 'carinfo',
  data() {
    return {
      citys: '',
      plateList: plateList(),
      expand: true,
      loadingCard: true,
      form: this.$form.createForm(this, { name: 'advanced_search' }),
      getlistCreateUserData: [],
      getByStoreIdAndCarIdData: [],
      // 所属门店
      userStoreData: '',
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
    this.userStores()
    this.listAll()
    this.listCreateUser()
    this.citys = newCitys
  },
  methods: {
    disabledDate,
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
        }
        console.log('form结果: ', values);
        values.pageNum = 1
        this.$parent.listExtendOrder(values, null)
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
}

.ant-advanced-search-form .ant-form-item {
  // display: flex;
  margin-bottom: 0;
}

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
