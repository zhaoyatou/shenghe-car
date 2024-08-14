<template>
  <a-card title="车辆信息" :loading="loadingCard" size="small" :hoverable="true" :bordered="false">
    <div id="components-form-demo-advanced-search">
      <a-form
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        class="ant-advanced-search-form"
        layout="inline"
        :form="form"
        @submit="handleSearch"
        autoComplete="off"
      >
        <a-form-item
          label="所属门店："
          has-feedback
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-select
            :disabled="isDisabled"
            allowClear
            placeholder="请选择门店"
            style="width: 400px"
            @change="listByStore"
            v-decorator="['name', { rules: [{ required: true, message: '请选择门店' }] }]"
          >
            <!--<a-select-option value="1"> 门店 1 </a-select-option>
            <a-select-option value="2"> 门店 2 </a-select-option>
            <a-select-option value="3"> 门店 3 </a-select-option>-->
            <a-select-option v-for="(item, index) in userStoreData" :key="index" :value="item.name">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="车辆品牌："
          has-feedback
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-select
            allowClear
            :disabled="isDisabled"
            :loading="carBrandLoading"
            placeholder="请选择品牌"
            style="width: 400px"
            @change="changelistByStoreId"
            v-decorator="['carBrand', { rules: [{ required: true, message: '请选择品牌' }] }]"
          >
            <a-select-option v-for="(item, index) in listCarBrandByStoreData" :key="index" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="车系："
          has-feedback
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-select
            allowClear
            :disabled="isDisabled || listCarSeriesByCarBrandData.length <= 0"
            :loading="carSeriesLoading"
            placeholder="请选择车系"
            style="width: 400px"
            @change="listCarSeriesBycarSeries"
            v-decorator="['carSeries', { rules: [{ required: true, message: '请选择车系' }] }]"
          >
            <a-select-option v-for="(item, index) in listCarSeriesByCarBrandData" :key="index" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="车型"
          has-feedback
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-select
            allowClear
            :disabled="isDisabled"
            :loading="carModelLoading"
            placeholder="请选择车型"
            style="width: 400px"
            @change="listCarSeriesBycarModel"
            v-decorator="['carModel', { rules: [{ required: true, message: '请选择车型' }] }]"
          >
            <a-select-option v-for="(item, index) in listCarModelByCarSeriesData" :key="index" :value="item.id">
              {{ item.carModel }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="车牌号码："
          has-feedback
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input
            allowClear
            :disabled="isDisabled"
            placeholder="请输入车牌号码"
            v-decorator="[
              'carLicense',
              {
                rules: [
                  { required: true, message: '请输入车牌号码' },
                  {
                    validator: islicenseplatenumber
                  }
                ]
              }
            ]"
            style="width: 200px"
          >
            <a-select
              slot="addonBefore"
              :disabled="isDisabled"
              v-decorator="['carLicenseNum', { initialValue: '新' }]"
              style="width: 60px"
              show-search
            >
              <!-- <a-select-option value="1"> 京 </a-select-option>
              <a-select-option value="2"> 津 </a-select-option> -->

              <a-select-option v-for="(item, index) in plateList" :key="index" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-input>
        </a-form-item>
        <a-form-item
          label="车架编码"
          has-feedback
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input
            allowClear
            :disabled="isDisabled"
            :maxLength="18"
            style="min-width: 170px"
            placeholder="请输入车架编码"
            v-decorator="[
              'carCode',
              {
                rules: [
                  // {
                  //   type: 'email',
                  //   message: 'The input is not valid E-mail!'
                  // },
                  {
                    required: true,
                    message: '请输入车架编码'
                  },
                  {
                    validator: isVehicleVINCode
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item has-feedback :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <span slot="label"> 发动机号</span>
          <a-input
            allowClear
            :disabled="isDisabled"
            placeholder="请输入发动机号"
            style="width: 200px"
            v-decorator="[
              'carEngine',
              {
                rules: [
                  { required: true, message: '请输入发动机号', whitespace: true },
                  {
                    validator: isEngineNumber
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          label="购车时间"
          has-feedback
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-date-picker
            style="width: 200px"
            :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
            :disabled="isDisabled"
            @change="calPrice()"
            :disabledDate="disabledDate"
            placeholder="请选择购车时间"
            format="YYYY-MM-DD"
            v-decorator="[
              'carBuyTime',
              { rules: [{ type: 'object', required: true, message: '请选择购车时间', whitespace: true }] }
            ]"
          />
        </a-form-item>
        <a-form-item
          label="新车购置价"
          has-feedback
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input-number
            style="width: 200px"
            :disabled="isDisabled"
            :formatter="value => `${value}元`"
            id="inputNumber"
            placeholder="请填写新车购置价"
            v-decorator="[
              'carPurchase',
              {
                rules: [{ required: true, message: '请填写新车购置价' }]
              }
            ]"
            :min="1"
            :max="90000000"
          />
        </a-form-item>
        <a-form-item
          :disabled="isDisabled"
          label="行驶里程"
          has-feedback
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input-number
            :disabled="isDisabled"
            @change="calPrice()"
            :formatter="value => `${value || 0}公里`"
            placeholder="请填写行驶里程"
            id="inputNumber"
            style="width: 200px"
            v-decorator="[
              'carMileage',
              {
                rules: [{ required: true, message: '请填写行驶里程' }]
              },
              {
                initialValue: 1
              }
            ]"
            :min="1"
            :max="90000000"
          />
        </a-form-item>
        <a-form-item
          label="延保项目"
          has-feedback
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-select
            allowClear
            :disabled="isDisabled || getByStoreIdAndCarIdData.length <= 0"
            placeholder="请选择延保项目"
            style="width: 200px"
            @change="prodNameChange"
            v-decorator="['projectId', { rules: [{ required: true, message: '请选择延保项目' }] }]"
          >
            <a-select-option v-for="(item, index) in getByStoreIdAndCarIdData" :key="index" :value="item.id">
              {{ item.prodName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="原厂保质"
          has-feedback
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input
            allowClear
            disabled
            style="width: 200px"
            placeholder="请输入原厂保质"
            v-decorator="[
              'warrantyTime',
              {
                rules: [{ required: true, message: '请输入原厂保质', whitespace: true }]
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          label="延长保修期"
          has-feedback
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-select
            :disabled="isDisabled || projectYears.length <= 0"
            allowClear
            placeholder="请选择延长保修期"
            @change="calPrice()"
            style="width: 200px"
            v-decorator="['extendTime', { rules: [{ required: true, message: '请选择延长保修期' }] }]"
          >
            <a-select-option v-for="(item, index) in projectYears" :key="index" :value="item.prodYear">
              {{ item.prodYear }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="保额"
          has-feedback
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input-number
            style="width: 200px"
            :disabled="isDisabled"
            :formatter="value => `${value}元`"
            placeholder="请选择保额"
            id="inputNumber"
            v-decorator="[
              'extendQuota',
              {
                rules: [{ required: false, message: '请输入保额' }]
              }
            ]"
            :min="1"
            :max="90000000"
          />
        </a-form-item>
        <a-form-item
          style="margin-bottom: 0"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <span slot="label">
            服务有效期截止时间&nbsp;
            <a-tooltip title="原厂质保时间+延长保修时间=服务有效截止时间">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-form-item :style="{ display: 'inline-block' }">
            <a-date-picker
              placeholder="请填写服务有效期截止时间"
              style="width: 240px"
              v-decorator="[
                'extendEndTime',
                {
                  rules: [
                    { type: 'object', required: true, message: '请填写服务有效期截止时间', whitespace: true },
                    ,
                    { validator: estimateRegistration }
                  ]
                }
              ]"
            />
          </a-form-item>
          <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }"> 或 </span>
          <a-form-item :style="{ display: 'inline-block' }">
            <a-input-number
              :formatter="value => `${value}公里`"
              id="inputNumber"
              placeholder="请填写公里数"
              style="width: 200px"
              v-decorator="[
                'extendSpace',
                {
                  rules: [{ required: true, message: '请填写公里数' }]
                }
              ]"
              :min="1"
            />
            <span style="margin-left: 10px">服务有效期以前述条件先到者为准</span>
          </a-form-item>
        </a-form-item>
        <a-form-item style="margin-bottom: 0; width: 300px">
          <h2 style="display: flex">
            <span slot="label"> 延保价格&nbsp; </span> <a-statistic :precision="2" :value="dataForm.extendPrice" />元
          </h2>
        </a-form-item>
        <!-- <a-row>
          <a-col :span="24" :style="{ textAlign: 'right' }">
            <a-button type="primary" html-type="submit"> 确定 </a-button>
             <a-button :style="{ marginLeft: '8px' }" @click="handleReset"> 清除 </a-button>
            <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggle">
              {{ expand ? '收起' : '展开' }} <a-icon :type="expand ? 'up' : 'down'" />
            </a> </a-col
          >
        </a-row> -->
      </a-form>
    </div>
  </a-card>
</template>
<script>
import moment from 'moment';
import { islicenseplatenumber, isVehicleVINCode, isEngineNumber } from '@/utils/validate';
import {
  userStore,
  getByStoreIdAndCarId,
  calPrice,
  listCarBrandByStoreId,
  listCarSeriesByCarBrand,
  listCarModelByCarSeries
} from '@/api/index';
import { plateList } from '@/assets/utils/plate';
import { findObj, disabledDate } from '@/utils/index';
import { setCache, getCache } from '@/utils/session';

export default {
  name: 'carinfo',
  props: {
    extendInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isDisabled: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {
      plateList: plateList(),
      expand: false,
      loadingCard: true,
      form: this.$form.createForm(this, { name: 'advanced_search' }),
      storeId: '',
      storeItem: '',
      listByStoreIdData: '',

      getByStoreIdAndCarIdData: '',
      userStoreData: '',
      dataForm: {
        id: '',
        orderNo: '',
        extendPrice: '',
        originCarMileage: ''
      },
      isLoadcalPrice: true,
      projectYears: [],
      listCarBrandByStoreData: [],
      listCarSeriesByCarBrandData: [],
      listCarModelByCarSeriesData: [],
      carBrandLoading: false,
      carSeriesLoading: false,
      carModelLoading: false,
      carBuyTime: '',
      warrantyTime: ''
    };
  },
  watch: {
    extendInfo: {
      handler(newVal) {
        if (newVal) {
          this.setFieldsValueFromDetails(newVal);
          if (newVal?.storeId) {
            this.listCarBrandByStoreId(newVal?.storeId);
            this.listCarSeriesByCarBrand(newVal?.storeId, newVal?.carBrand);
            this.listCarModelByCarSeries(newVal?.storeId, newVal?.carBrand, newVal?.carSeries);
          }
        }
      },
      deep: true
    }
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
            wrapperCol: { span: 10 }
          }
        : {};
    }
  },
  updated() {
    console.log('updated');
    // this.calPrice()
  },
  created() {
    this.userStores();
  },
  methods: {
    islicenseplatenumber,
    isVehicleVINCode,
    isEngineNumber,
    // 购车时间- 限制今天以后的时间不可选
    disabledDate,
    moment,
    handleSearch(e) {
      // e.preventDefault();
      this.form.validateFields((error, values) => {
        // console.log('error', error);

        // return values
        if (error) return false;
        // values.carBrand = values?.carBrand?.carBrand
        console.log('form结果car: ', values);
        const query = this.$route.query;
        if (query.orderNo && (query.disabled == 1 || query.details == 2)) {
          values.projectId = getCache('projectId');
        }
        values.carBuyTime = values.carBuyTime ? parseInt(moment(values['carBuyTime']).valueOf()) : '';
        values.extendEndTime = values.extendEndTime ? parseInt(moment(values['extendEndTime']).valueOf()) : '';
        const isNumber =
          (typeof Number(e?.carModel) == 'number' && !isNaN(Number(e?.carModel))) ||
          (typeof Number(values?.carModel) == 'number' && !isNaN(Number(values?.carModel)));
        if (isNumber) {
          values.carModel = findObj(this.listCarModelByCarSeriesData, values.carModel).carModel;
          this.dataForm.carModel = values.carModel;
        }
        values.warrantyTime = values?.warrantyTime ? values?.warrantyTime.split('年')[0] + '年' : '';
        const newObj = { ...this.dataForm, ...values };
        this.$emit('handleCar', newObj);
      });
    },

    handleReset() {
      this.form.resetFields();
    },

    toggle() {
      this.expand = !this.expand;
    },
    // 用户的所属门店
    async userStores() {
      const res = await userStore();
      this.userStoreData = res.data.filter(item => item?.id);
      console.log(this.userStoreData);
    },
    // 用户的车辆品牌，车系，车型接口
    async listByStore(id) {
      if (!id) return;
      this.storeId = findObj(this.userStoreData, id).id;
      this.dataForm.storeId = findObj(this.userStoreData, id).id;
      this.dataForm.storeName = findObj(this.userStoreData, id).name;
      this.$emit('selectStoreInfo', findObj(this.userStoreData, id) || {});
      // const res = await listByStoreId({ storeId: findObj(this.userStoreData, id).id })
      // this.listByStoreIdData = res.data
      console.log(findObj(this.userStoreData, id));
      // 获取门店关联的所有品牌
      this.listCarBrandByStoreId(findObj(this.userStoreData, id).id);
      this.form.resetFields();
      this.listCarSeriesByCarBrandData = [];
      this.listCarModelByCarSeriesData = [];
    },
    async changelistByStoreId(item) {
      if (!item) return;
      // console.log(this.listByStoreIdData, 'this.listByStoreIdData')
      this.listCarSeriesByCarBrand(this.storeId, item);
      this.dataForm.carBrand = item;
      this.form.resetFields('carSeries');
      this.form.resetFields('carModel');
      this.listCarModelByCarSeriesData = [];
      console.log(this.dataForm.carBrand, 'this.dataForm.carBrand');
    },
    listCarSeriesBycarSeries(e) {
      this.form.setFieldsValue({
        carSeries: e
      });
      this.listCarModelByCarSeries(this.storeId, this.dataForm.carBrand, e);
    },
    listCarSeriesBycarModel(item) {
      this.dataForm.carId = findObj(this.listCarModelByCarSeriesData, item).id;
      this.warrantyTime = findObj(this.listCarModelByCarSeriesData, item).carPeriod + '年';
      this.dataForm.originCarMileage = findObj(this.listCarModelByCarSeriesData, item).carMileage + '公里';
      this.calPrice();
      this.dataForm.carModel = findObj(this.listCarModelByCarSeriesData, item).carModel;
      this.form.setFieldsValue({
        carSeries: findObj(this.listCarModelByCarSeriesData, item).carSeries,
        // carModel: findObj(this.listCarModelByCarSeriesData, item).carModel,
        warrantyTime: findObj(this.listCarModelByCarSeriesData, item).carPeriod + '年' // + findObj(this.listCarModelByCarSeriesData, item).carMileage + '公里'
      });
      this.getByStoreIdAndCarId();
    },
    // 延保项目
    async getByStoreIdAndCarId() {
      const obj = {
        storeId: this.storeId,
        carId: this.dataForm.carId
      };
      const res = await getByStoreIdAndCarId(obj);
      this.getByStoreIdAndCarIdData = res?.data;
    },
    prodNameChange(id) {
      if (!id) return;
      setCache('projectId', id);
      // this.dataForm.prodTime = findObj(this.getByStoreIdAndCarIdData, id).prodTime
      this.dataForm.projectName = findObj(this.getByStoreIdAndCarIdData, id).prodName;
      this.projectYears = findObj(this.getByStoreIdAndCarIdData, id).projectYears;
      // this.form.setFieldsValue({
      //   extendTime:findObj(this.getByStoreIdAndCarIdData, id).prodTime
      // })
      this.calPrice();
    },
    calPrice() {
      this.$nextTick(async () => {
        if (!this.isLoadcalPrice) return false;
        if (
          !this.form.getFieldValue('extendTime') ||
          !this.form.getFieldValue('projectId') ||
          !this.dataForm.carId ||
          !this.form.getFieldValue('carBuyTime') ||
          !this.form.getFieldValue('carMileage')
        )
          return;
        const query = this.$route.query;
        let projectId;
        if ((query.orderNo && query.disabled == 1) || query.details == 2) {
          projectId = getCache('projectId');
        } else {
          projectId = this.form.getFieldValue('projectId');
        }
        this.carBuyTime = this.form.getFieldValue('carBuyTime');
        const obj = {
          projectId: projectId, // this.form.getFieldValue('projectId'),
          carId: this.dataForm.carId,
          //购车时间
          carBuyTime: moment(this.form.getFieldValue('carBuyTime')).format('YYYY-MM-DD'),
          //行驶里程
          carMileage: this.form.getFieldValue('carMileage'),
          extendTime: this.form.getFieldValue('extendTime')
        };
        const res = await calPrice(obj);
        this.isLoadcalPrice = true;
        this.dataForm.extendPrice = res?.data?.extendPrice;
        this.form.setFieldsValue({
          extendEndTime: moment(res?.data?.extendEndTime),
          extendSpace: res?.data?.extendSpace
        });
      });
    },
    async setFieldsValueFromDetails(e) {
      // e.carBrand = findObj(this.listByStoreIdData, e.carBrand).carBrand
      const firstData =
        e?.warrantyTime && e?.warrantyTime?.length > 1
          ? e?.warrantyTime.split('年')[0] + '年'
          : e?.warrantyTime
          ? e?.warrantyTime + '年'
          : '';
      const originCarMileage =
        e?.originCarMileage && e?.originCarMileage.includes('公里')
          ? e?.originCarMileage
          : e?.originCarMileage
          ? e?.originCarMileage + '公里'
          : '';
      const warrantyTime = firstData + originCarMileage;
      this.form.setFieldsValue({
        name: e?.storeName || undefined,
        carBrand: e?.carBrand || undefined,
        carSeries: e?.carSeries || undefined,
        carModel:
          typeof Number(e?.carModel) == 'number' && !isNaN(Number(e?.carModel))
            ? Number(e?.carModel)
            : e?.carModel || undefined,
        carLicense: e?.carLicense || undefined,
        carLicenseNum: e?.carLicenseNum || undefined,
        carCode: e?.carCode || undefined,
        carEngine: e?.carEngine || undefined,
        carBuyTime: e?.carBuyTime ? moment(e.carBuyTime) : undefined,
        carPurchase: e?.carPurchase ? Number(e.carPurchase) : undefined,
        carMileage: e.carMileage || undefined,
        projectId: e.projectName || undefined,
        warrantyTime: warrantyTime,
        extendQuota: e?.extendQuota || undefined,
        extendEndTime: e?.extendEndTime ? moment(e?.extendEndTime) : undefined,
        extendSpace: e?.extendSpace || undefined,
        extendTime: e?.extendTime || undefined
      });
      this.dataForm.extendPrice = e?.extendPrice || undefined;
      this.dataForm.orderNo = e?.orderNo || undefined;
      this.dataForm.id = e?.id || undefined;
      this.dataForm.carId = e?.carId || undefined;
      // 后加
      this.storeId = e.storeId || undefined;
      this.dataForm.storeId = e?.storeId || undefined;
      this.dataForm.storeName = e?.storeName || undefined;
      this.dataForm.projectName = e?.projectName || undefined;
      this.dataForm.originCarMileage = e?.originCarMileage || undefined;
      // this.dataForm.carModel = typeof Number(e?.carModel) == 'number' && !isNaN(Number(e?.carModel)) ? Number(e?.carModel) : (e?.carModel || undefined)
      setCache('projectId', e?.projectId || undefined);
      this.calPrice();
      await this.getByStoreIdAndCarId();
    },
    getCardInfo() {
      this.listCarBrandByStoreId();
      this.listCarSeriesByCarBrand();
      this.listCarModelByCarSeries();
    },
    // 获取门店关联的所有品牌
    async listCarBrandByStoreId(storeId) {
      const obj = { storeId: storeId };
      this.carBrandLoading = true;
      const res = await listCarBrandByStoreId(obj);
      this.carBrandLoading = false;
      if (res.code == 200) {
        this.listCarBrandByStoreData = res?.data;
      } else {
        this.$message.error(res?.message);
      }
    },
    // 获取门店关联的所有车系
    async listCarSeriesByCarBrand(storeId, carBrand) {
      const obj = { storeId: storeId, carBrand: carBrand };
      this.carSeriesLoading = true;
      const res = await listCarSeriesByCarBrand(obj);
      this.carSeriesLoading = false;
      if (res.code == 200) {
        this.listCarSeriesByCarBrandData = res?.data;
      } else {
        this.$message.error(res?.message);
      }
    },
    // 获取门店关联的所有车辆信息
    async listCarModelByCarSeries(storeId, carBrand, carSeries) {
      const obj = { storeId: storeId, carBrand: carBrand, carSeries: carSeries };
      this.carModelLoading = true;
      const res = await listCarModelByCarSeries(obj);
      this.carModelLoading = false;
      if (res.code == 200) {
        this.listCarModelByCarSeriesData = res?.data;
      } else {
        this.$message.error(res?.message);
      }
    },
    // 判断服务有效期截止时间是否大于八年
    estimateRegistrationTime(beginDate, endDate) {
      const begin = new Date(beginDate).getTime();
      const end = new Date(endDate).getTime();
      const day = (end - begin) / (24 * 60 * 60 * 1000);
      if (day > 365 * 8 + 1) {
        return true;
      } else {
        return false;
      }
    },
    estimateRegistration(rule, value, callback) {
      const carBuyTime = this.form.getFieldValue('carBuyTime');
      if (!value) {
        callback(false);
      }
      if (!carBuyTime) {
        // this.form.setFieldsValue({ extendEndTime: '' })
        callback('请选择购车时间');
      }
      if (value && carBuyTime) {
        const isTime = this.estimateRegistrationTime(carBuyTime, value);
        if (isTime) {
          callback('服务有效期不能超过8年');
        } else {
          callback();
        }
      }
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

.ant-advanced-search-form .ant-form-item .ant-form-item-label {
  width: 108px;
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
<style lang="scss">
#components-form-demo-advanced-search .ant-form .ant-form-item .ant-form-item-label {
  min-width: 108px;
}
</style>
