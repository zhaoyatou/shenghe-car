<template>
  <div>
    <a-spin :spinning="spinning">
      <a-row type="flex" :gutter="16">
        <a-col flex="1 1 200px">
          <!--车辆信息-->
          <CarInfo
            :isDisabled="isDisabled"
            :extendInfo="detailsData.extendInfo"
            ref="car-1"
            @handleCar="handleCar"
            @selectStoreInfo="selectStoreInfo"
          />
          <br />
          <!--销售信息-->
          <SalesInformation
            :isDisabled="isDisabled"
            :detailsData="detailsData"
            ref="car-2"
            @handleSalesInformation="handleSalesInformation"
          />
          <br />
          <!--客户信息-->
          <CustomerInformation
            :isDisabled="isDisabled"
            :customerInfo="detailsData.customerInfo"
            :selectStoreInfos="selectStoreInfos"
            ref="car-3"
            @handleCustomerInformation="handleCustomerInformation"
          />
          <br />
          <!--支付信息-->
          <PaymentInformation
            :isDisabled="isDisabled"
            :payInfo="detailsData.payInfo"
            ref="car-4"
            @handlePaymentInformation="handlePaymentInformation"
          />
          <br />
          <!--影像文件-->
          <ImageFile
            ref="car-5"
            :isDisabled="isDisabled"
            :detailsData="detailsData"
            :fileInfos="detailsData.fileInfos"
            @imageFile="imageFile"
          />
        </a-col>
        <a-col flex="0 1 0px">
          <RightMent :detailsData="detailsData" @navgatorIndex="navgatorIndex" />
        </a-col>
      </a-row>
    </a-spin>
    <a-modal
      v-model="ChargebackVisible"
      title="驳回处理"
      ok-text="发送"
      cancel-text="取消"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-textarea v-model="chargebackValue" placeholder="请输入驳回理由" :auto-size="{ minRows: 3, maxRows: 5 }" />
    </a-modal>
  </div>
</template>

<script>
import CarInfo from '@/views/components/ewBusiness/newFrom/CarInfo';
import SalesInformation from '@/views/components/ewBusiness/newFrom/SalesInformation';
import CustomerInformation from '@/views/components/ewBusiness/newFrom/CustomerInformation';
import PaymentInformation from '@/views/components/ewBusiness/newFrom/PaymentInformation';
import ImageFile from '@/views/components/ewBusiness/newFrom/ImageFile';
import RightMent from '@/views/components/rightMent/Menu';
import { scrollIntoViews } from '@/utils/business';
import { getCache } from '@/utils/session';
import { saveExtend, detailExtendOrder, approved, cancel } from '@/api/index';
export default {
  name: 'newBusiness',
  components: {
    CarInfo,
    SalesInformation,
    CustomerInformation,
    PaymentInformation,
    ImageFile,
    RightMent
  },
  data() {
    return {
      listBoxState: false,
      selectStoreInfos: {},
      fromVal: {
        extendInfo: {
          storeName: ''
        },
        SalesInformation: {
          saleStoreName: '',
          saleStoreType: '',
          createUserName: ''
        },
        customerInfo: {},
        payInfo: {},
        fileInfo: []
      },
      index: 0,
      saveExtendindex: 0,
      operStatus: -1,
      spinning: false,
      detailsData: {},
      isDisabled: false,
      ChargebackVisible: false,
      chargebackValue: ''
    };
  },
  computed: {
    indexs: function () {
      console.log(this.index);
      return this.index;
    }
  },
  created() {
    // 默认一进来就去请求接口详情
    this.loadDetailsOrder();
  },
  methods: {
    // 点击导航菜单，页面滚动到指定位置
    async navgatorIndex(e) {
      if (e.key.includes('car')) {
        scrollIntoViews(this, e);
        return;
      }
      // 保存草稿
      if (e.key === 'calendar-1') {
        this.operStatus = 1;
        this.index = 5;
        await this.$refs[`car-1`].handleSearch();
        console.log(this.$refs[`car-1`].dataForm);
        const car1Obj = this.$refs[`car-1`].form.getFieldsValue();
        car1Obj.projectId = getCache('projectId');
        car1Obj.warrantyTime = car1Obj?.warrantyTime ? car1Obj?.warrantyTime.split('年')[0] + '年' : '';
        this.fromVal.extendInfo = { ...car1Obj, ...this.$refs[`car-1`].dataForm };
        this.fromVal.extendInfo.storeName = this.$refs[`car-1`].form.getFieldsValue().name;
        this.fromVal.SalesInformation.saleStoreName = this.$refs[`car-2`].form.getFieldsValue().saleStoreName;
        this.fromVal.SalesInformation.saleStoreType = this.$refs[`car-2`].form.getFieldsValue().saleStoreType;
        this.fromVal.SalesInformation.createUserName = this.$refs[`car-2`].form.getFieldsValue().createUserName;
        // this.fromVal.SalesInformation.saleStoreName, // "北京利豪广厦汽车销售", // 店方信息
        // this.fromVal.SalesInformation.saleStoreType,  //  店方信息
        //  this.fromVal.SalesInformation.createUserName,  //  店方信息
        this.fromVal.customerInfo = { ...this.$refs[`car-3`].dataForm, ...this.$refs[`car-3`].form.getFieldsValue() };
        this.fromVal.payInfo = { ...this.$refs[`car-4`].dataForm, ...this.$refs[`car-4`].form.getFieldsValue() };
        this.fromVal.fileInfo = this.$refs[`car-5`].successList;
        this.saveExtend();
        this.loadDetailsOrder();
        return false;
      } else if (e.key === 'calendar-2') {
        // 提交审核 审核中
        this.operStatus = 2;
      } else if (e.key === 'sub1-1') {
        // 审核通过
        this.operStatus = 3;
      } else if (e.key === 'sub1-2') {
        // 驳回
        this.operStatus = 4;
        this.chargebackSelectValue = e;
        this.ChargebackVisible = true;
        return false;
      } else if (e.key === 'sub1-3') {
        this.isDisabled = false;
        return false;
      } else if (e.key === 'calendar-3') {
        console.log(this.detailsData);
        this.$router.push({
          path: '/view/contract',
          query: {
            contractNo: this.detailsData.contractNo || this.$route?.query?.contractNo || '无',
            orderNo: this.detailsData.orderNo || ''
          }
        });
        return false;
      }
      [1, 2, 3, 4, 5].map(item => {
        this.$refs[`car-${item}`].handleSearch();
      });
    },
    handleCar(e) {
      this.fromVal.extendInfo = e;
      console.log(e);
      this.index++;
    },
    handleSalesInformation(e) {
      console.log(e);
      this.fromVal.SalesInformation = e;
      this.index++;
    },
    handleCustomerInformation(e) {
      console.log(e);
      this.fromVal.customerInfo = e;
      this.index++;
    },
    handlePaymentInformation(e) {
      console.log(e);
      this.fromVal.payInfo = e;
      this.index++;
    },
    imageFile(e) {
      console.log(e);
      if (e.length <= 0) return;
      this.fromVal.fileInfo = e;
      this.index++;
      if (this.operStatus === 3 && this.$route.query?.orderNo && this.index >= 5 && this.detailsData?.operStatus == 2) {
        this.adminSaveExtend();
        return false;
      }
      this.loadType();
    },
    selectStoreInfo(e) {
      this.selectStoreInfos = e;
    },
    // 保存 、审核等接口
    async saveExtend() {
      const that = this;
      that.saveExtendindex++;
      console.log(that.index, '-----------');
      if (that.index >= 5 && that.operStatus != -1) {
        try {
          that.spinning = true;
          if (that.fromVal.customerInfo.email === undefined || that.fromVal.customerInfo.email === '') {
            that.fromVal.customerInfo.email = '1337836843@qq.com';
          }
          const obj = {
            extendInfo: that.fromVal.extendInfo,
            payInfo: that.fromVal.payInfo,
            fileInfos: that.fromVal.fileInfo,
            customerInfo: that.fromVal.customerInfo,
            orderNo: that.$route.query?.orderNo || '',
            sourceType: 2, // 录单来源 1 移动端 2PC端
            operStatus:
              that.$route.query?.edit == 1 && that.detailsData?.operStatus && that.operStatus == 1
                ? that.detailsData?.operStatus
                : that.operStatus, // 1 草稿 2 审核中 3 审核通过 4 拨回
            saleStoreName: that.fromVal.SalesInformation.saleStoreName, // "北京利豪广厦汽车销售", // 店方信息
            saleStoreType: that.fromVal.SalesInformation.saleStoreType, //  店方信息
            createUserName: that.fromVal.SalesInformation.createUserName, //  店方信息
            saleStoreId: that.selectStoreInfos.id || that.fromVal.extendInfo?.storeId || '', //  店方信息
            userSignUrl: '', // 签名
            id: this.detailsData?.id || '' // 有id就是修改，没有就是新增
          };
          const res = await saveExtend(obj);
          that.spinning = false;
          that.index = 0;
          if (res.code === 200) {
            that.loadDetailsOrder();
            // that.$message.success('操作成功')
            if (that.operStatus == 1) {
              that.$message.success('保存成功');
              that.selectStoreInfos = {};
              that.$router.push({
                path: '/order/list'
              });
              return false;
            }
            if (that.operStatus == 3 || that.operStatus == 4) {
              this.$router.push({
                path: '/order/list'
              });
              return false;
            }
            that.$router.push({
              path: '/aduit/result',
              query: {
                contractNo: res.data?.contractNo,
                updateTime: res.data?.updateTime,
                operStatus: that.operStatus
              }
            });
          }
        } catch (error) {
          that.$message.error('网络繁忙，稍后重试');
          that.spinning = false;
        }
      } else {
        if (this.saveExtendindex > 5) {
          this.index = 0;
          return false;
        }
        this.loadType();
      }
    },
    // 管理员=-(特殊处理了一下)通过审核保存 、审核等接口
    async adminSaveExtend() {
      const that = this;
      that.saveExtendindex++;
      console.log(that.index, '-----------');
      if (that.index >= 5 && that.operStatus != -1) {
        try {
          that.spinning = true;
          if (that.fromVal.customerInfo.email === undefined || that.fromVal.customerInfo.email === '') {
            that.fromVal.customerInfo.email = '1337836843@qq.com';
          }
          const obj = {
            extendInfo: that.fromVal.extendInfo,
            payInfo: that.fromVal.payInfo,
            fileInfos: that.fromVal.fileInfo,
            customerInfo: that.fromVal.customerInfo,
            orderNo: that.$route.query?.orderNo || '',
            sourceType: 2, // 录单来源 1 移动端 2PC端
            operStatus: 3, // 1 草稿 2 审核中 3 审核通过 4 拨回
            saleStoreName: that.fromVal.SalesInformation.saleStoreName, // "北京利豪广厦汽车销售", // 店方信息
            saleStoreType: that.fromVal.SalesInformation.saleStoreType, //  店方信息
            createUserName: that.fromVal.SalesInformation.createUserName, //  店方信息
            saleStoreId: that.selectStoreInfos.id || that.fromVal.extendInfo?.storeId || '', //  店方信息
            userSignUrl: '', // 签名
            id: this.detailsData?.id || '' // 有id就是修改，没有就是新增
          };
          const res = await saveExtend(obj);
          that.spinning = false;
          that.index = 0;
          if (res.code === 200) {
            that.loadDetailsOrder();
            if (that.operStatus == 3 || that.operStatus == 4) {
              this.$router.push({
                path: '/order/list'
              });
              return false;
            }
          }
        } catch (error) {
          that.$message.error('网络繁忙，稍后重试');
          that.spinning = false;
        }
      }
    },
    loadType() {
      if (this.operStatus === 3 && this.$route.query?.orderNo && this.index >= 5 && this.detailsData?.operStatus == 2) {
        this.approved();
        return false;
      }
      this.saveExtend();
    },
    // 审核通过
    async approved() {
      if (this.isDisabled == false && this.$route.query?.orderNo && this.$route.query?.disabled == 1) {
        this.navgatorIndex();
        return false;
      }
      const obj = {
        orderNo: this.$route.query?.orderNo
      };
      if (!this.$route.query?.orderNo) return false;
      const res = await approved(obj);
      if (res.code === 200) {
        this.$message.success('审核通过');
        this.$router.push({
          path: '/order/list'
        });
      } else {
        this.$message.error(res.message);
      }
    },
    // 从列表狗来需要请求详情接口 并且回显
    async loadDetailsOrder() {
      const queryObj = this.$route.query;
      if (!queryObj.orderNo) return false;
      const obj = {
        orderNo: queryObj.orderNo
      };
      const res = await detailExtendOrder(obj);
      console.log(res, 'loadDetailsOrder');
      if (res.data) {
        this.detailsData = res.data;
      }
      /***
       * @description 如果是从点单列表点击查看按钮 进来，name这里就是详情，是禁止修改的
       */
      const query = this.$route.query;
      if (query.orderNo && query.disabled == 1) {
        this.isDisabled = true;
      }
    },
    // 关闭退定处理弹框
    handleCancel() {
      this.ChargebackVisible = false;
      this.chargebackValue = '';
    },
    // 点击确定 执行接口
    handleOk() {
      // [1, 2, 3, 4, 5].map(item => {
      //   this.$refs[`car-${item}`].handleSearch();
      // });
      if (this.chargebackValue == '') {
        this.$message.warning('填写驳回理由');
        return false;
      }
      this.cancel();
      console.log(this.chargebackSelectValue);
    },
    async cancel() {
      const obj = {
        orderNo: this.$route.query?.orderNo,
        body: this.chargebackValue
      };
      const res = await cancel(obj);
      this.ChargebackVisible = false;
      this.chargebackValue = '';
      if (res.code === 200) {
        this.$message.success('驳回成功');
        this.$router.push({
          path: '/order/list'
        });
      } else {
        this.$message.error(res.message);
      }
    }
  }
};
</script>
