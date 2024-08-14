<template>
  <a-card title="影像文件" :loading="loadingCard" :hoverable="true" :bordered="false">
    <ul class="ul">
      <li v-for="(item, index) in list" :key="index">
        <!-- <div class="image">
          <img :src="item.url" />
        </div>
        <p class="test">{{ item.title }}</p> -->
        <upload-file
          :isDisabled="isDisabled"
          :uploadText="item.title"
          :types="item.type"
          :uplodaUrl="getfile(index)"
          @uploadSuccess="uploadSuccess"
          @deleteFile="deleteFile"
          @previewImage="previewImage"
        />
      </li>
    </ul>
    <div class="covers" v-html="description" v-if="description"></div>
    <viewer :viewerList="successList" ref="viewer" style="position: fixed; z-index: -20; bottom: -10000px"> </viewer>
  </a-card>
</template>
<script>
import Vue from 'vue';
import moment from 'moment';
import uploadFile from './uploadFile';
import viewer from '@/views/components/viewer/index';
import { imgShowInfo, payTypeFn } from '@/utils/index';
import 'viewerjs/dist/viewer.css';
import Viewer from 'v-viewer';
Vue.use(Viewer);
Viewer.setDefaults({
  // 'inline': true, // 启用 inline 模式
  // 'button': true, // 显示右上角关闭按钮
  navbar: false, // 显示缩略图导航
  // 'title': false, // 显示当前图片的标题
  toolbar: {
    zoomIn: true,
    zoomOut: true,
    oneToOne: true,
    reset: true,
    prev: false,
    play: {
      show: true,
      size: 'large'
    },
    next: false,
    rotateLeft: true,
    rotateRight: true,
    flipHorizontal: true,
    flipVertical: true
  },
  hide: function (e) {
    // e.currentTarget.parentNode.previousSibling.style.display = "none";
    console.log(e.type, '图片隐藏完成', this);
    // this.description = ''
    this.__vue__.$parent.$parent.$parent.description = '';
  },
  view: function (e) {
    // e.currentTarget.parentNode.previousSibling.style.display = "inline-block";
    // console.log(e, '视图开始');
  }
});
export default {
  name: 'ImageFile',
  props: {
    fileInfos: {
      type: Array,
      default: () => {
        return [];
      }
    },
    detailsData: {
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
  components: {
    uploadFile,
    viewer
  },
  watch: {
    fileInfos: {
      handler(newVal) {
        if (newVal) {
          this.successList = newVal;
        }
      },
      deep: true
    }
  },
  data() {
    return {
      loadingCard: true,
      list: [
        { title: '身份证正面', type: 1 }, // url: require('@/assets/car/card-z.png'),
        { title: '身份证反面', type: 2 }, // url: require('@/assets/car/card-f.png'),
        { title: '行驶证件照', type: 3 }, // url: require('@/assets/car/xsz.png'),
        { title: '行驶里程', type: 4 },
        { title: '车辆前照', type: 5 },
        { title: '车辆后照', type: 6 },
        { title: '线上支付照', type: 7 },
        { title: '刷卡小票', type: 8 },
        { title: '车辆视频', type: 9 }
      ],
      successList: [],
      description: ''
    };
  },
  mounted() {
    this.loadingCard = false;
  },
  methods: {
    // 上传成功的文件
    uploadSuccess(val) {
      const isHave = this.successList.some(item => {
        return item?.fileType == val.fileType;
      });
      if (isHave) {
        this.successList.map((item, i) => {
          if (item.fileType == val.fileType) {
            this.successList.splice(i, 1, val);
          }
        });
      } else {
        this.successList.push(val);
      }
    },
    // 删除文件
    deleteFile(file) {
      this.successList.map((item, i) => {
        if (item.fileType == file.fileType) {
          this.successList = this.successList.splice(i, 1);
        }
      });
    },
    // 获取当前索引所在的数据
    getfile(index) {
      if (this.successList.length > 0) {
        // return this.successList.findLast(item => {
        //   return item.fileType == index + 1;
        // });
        const filteredPictures = this.successList.filter(item => item.fileType == index + 1);
        return filteredPictures[filteredPictures.length - 1];
      }
    },
    handleSearch() {
      if (this.successList.length <= 0) {
        this.$message.warning('请上传文件');
        return false;
      }
      const types = this.successList.map(item => item.fileType);
      // *1.身份证正面2身份证反面3行驶证证件4行驶里程5.车辆前照6.车身前后7.线上支付8.刷卡小票9.车辆视频
      if (!types.includes(1)) {
        this.$message.warning('请上传身份证正面');
        return false;
      }
      if (!types.includes(2)) {
        this.$message.warning('请上传身份证反面');
        return false;
      }
      if (!types.includes(3)) {
        this.$message.warning('请上传行驶证证件');
        return false;
      }
      if (!types.includes(8)) {
        this.$message.warning('请上传刷卡小票');
        return false;
      }
      console.log(this.successList, 'this.successList');
      this.$emit('imageFile', this.successList);
    },
    handleReset() {
      this.successList = [];
      this.$emit('imageFile', []);
    },
    async previewImage(file) {
      const index = this.successList.findIndex(item => item.fileUrl == file.fileUrl) || 0;
      this.$refs.viewer.$children[0].$viewer.index = index;
      this.$refs.viewer.$children[0].$viewer.show();
      // 待审核 或者 已审核额
      if (
        imgShowInfo().get(String(file.fileType)) &&
        (this.detailsData?.operStatus == 2 || this.detailsData?.operStatus == 3)
      ) {
        switch (file.fileType) {
          // 身份证正面信息
          case 1:
            let city, area;

            let areaValue;
            if (this.detailsData?.customerInfo?.city?.split('/')?.length == 2) {
              city = this.detailsData?.customerInfo?.city?.split('/')[0];
              area = this.detailsData?.customerInfo?.city?.split('/')[1];
            } else {
              city = this.detailsData?.customerInfo?.city || undefined;
              area = undefined;
            }

            const inNull = (this.detailsData?.customerInfo?.province && city) || area;
            if (inNull) {
              areaValue = [this.detailsData?.customerInfo?.province || undefined, city || undefined, area || undefined];
            } else {
              areaValue = undefined;
            }
            this.description =
              '使用人姓名：' +
                this.detailsData?.customerInfo?.useName +
                `<br />` +
                '身份证号：' +
                this.detailsData?.customerInfo?.cardId +
                `<br />` +
                '户籍地址：' +
                areaValue +
                this.detailsData?.customerInfo?.address || '';
            break;
          case 3:
            console.log(this.detailsData)
            const saleStoreType = this.detailsData?.saleStoreType == 2 ? '售后： ' : '售前： '
            const saleStoreName = this.detailsData?.saleStoreName || ''
            // 行驶证证件信息
            this.description =
              '客户姓名：' +
                this.detailsData?.customerInfo?.customerName +
                `<br />` +
                '车牌号码：' +
                this.detailsData?.extendInfo?.carLicenseNum +
                this.detailsData?.extendInfo?.carLicense +
                `<br />` +
                '车架编码：' +
                this.detailsData?.extendInfo?.carCode +
                '<br />' +
                '发动机号：' +
                this.detailsData?.extendInfo?.carEngine +
                '<br />' +
                '购车时间：' +
                (moment(this.detailsData?.extendInfo?.carBuyTime).format('YYYY-MM-DD') || '') +
                '<br />' +
                '服务截止时间：' +
                (moment(this.detailsData?.extendInfo?.extendEndTime).format('YYYY-MM-DD') || '') +
                '<br />' +
                '新车购置价：' +
                this.detailsData?.extendInfo?.carPurchase +
                '元' +
                '<br />' +
                saleStoreType +  saleStoreName +
                '<br />'+
                '延保项目：' +
                this.detailsData?.extendInfo?.projectName +
                '<br />'+
                '所属门店：' +
                this.detailsData?.extendInfo?.storeName
            break;
          case 4:
            // 行驶里程
            this.description = '行驶里程：' + this.detailsData?.extendInfo?.carMileage + '公里';
            break;
          case 5:
            // 车辆前照
            this.description =
              '车牌号码：' + this.detailsData?.extendInfo?.carLicenseNum + this.detailsData?.extendInfo?.carLicense;
            break;
          case 6:
            // 车辆后照
            this.description =
              '车牌号码：' + this.detailsData?.extendInfo?.carLicenseNum + this.detailsData?.extendInfo?.carLicense;
            break;
          case 7:
            // 线上支付照
            this.description =
              '支付方式：' +
              payTypeFn().get(String(this.detailsData?.payInfo?.payType)) +
              '<br />' +
              '实收金额：' +
              this.detailsData?.payInfo?.payAmount;
            break;
          case 8:
            // 刷卡小票照
            this.description =
              '支付方式：' +
              payTypeFn().get(String(this.detailsData?.payInfo?.payType)) +
              '<br />' +
              '实收金额：' +
              this.detailsData?.payInfo?.payAmount+
              '<br />' +
              '延保金额：' +
              this.detailsData?.extendInfo?.extendPrice+
              '<br />' +
              '加价金额：' +
              (this.detailsData?.payInfo?.addAmount || 0)+
              '<br />' +
              '联系电话：' +
              this.detailsData?.customerInfo?.tel +
              '<br />' +
              '备注信息：' +
              (this.detailsData?.payInfo?.remark || '无')
            break;
          default:
            break;
        }
      }
    },
    imgchange() {
      console.log(456);
    }
  }
};
</script>
<style>
.covers {
  position: fixed;
  top: 100px;
  left: 260px;
  color: #fff;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 20000;
}
</style>
<style scoped lang="scss">
.ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  list-style: none;

  li {
    width: 16%;
    margin-right: 100px;
    margin-bottom: 100px;
    margin: 40px;
    margin-bottom: 15px;
    display: flex;
    justify-content: center;

    .image {
      height: 115px;
      background: pink;
      border-radius: 20px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 20px;
        background-size: cover;
      }
    }

    .test {
      text-align: center;
      line-height: 30px;
    }
  }
}
</style>
