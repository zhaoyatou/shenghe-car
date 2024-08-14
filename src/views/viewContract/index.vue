<template>
  <div>
    <p class="contract">
      延保订单合同
    </p>
    <a-card :title="`合同编号：` + queryInfo.contractNo || '无'" :loading="loading">
      <a-space :size="10" slot="extra">
        <a-button type="dashed" @click="send">重新发送</a-button>
        <!-- <a-button type="primary" @click="print" :disabled="isContractDisabled">打印合同</a-button> -->
        <a-button type="primary" @click="contractdownLoadFile">下载合同</a-button>
      </a-space>
      <div>
        <!-- <contracts /> -->
        <iframe name="proxy_iframe" ref="Frame" style="width: 100%;" :height='heights' id="show-iframe" frameborder=0
          scrolling=auto :src='`${hostIp}${url}`'></iframe>
      </div>
    </a-card>
    <div>
      <a-modal title="邮件发送" :visible="visible" :confirm-loading="confirmLoading" :footer="null" @cancel="handleCancel">
        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
          <a-form-item label="邮件地址">
            <a-input
              v-decorator="['email', { rules: [{ required: true, message: '请输入邮件地址' }, { validator: IsEmail }] }]"
              placeholder="请输入邮件地址" />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
            <a-button type="primary" html-type="submit" :loading="btnLoading">
              发送
            </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleCancel">
              取消
            </a-button>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>
<script>
import { getHight } from '@/utils/business';
import { IsEmail } from '@/utils/validate';
import { sendEmail } from '@/api/index';
import contracts from './contract';
import { getCache } from '@/utils/session';

export default {
  name: 'contract',
  components: {
    contracts,
  },
  data() {
    return {
      heights: '',
      loading: false,
      btnLoading: false,
      visible: false,
      confirmLoading: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      queryInfo: '',
      isContractDisabled: false,
      hostIp: window.location.port ? 'http://47.94.241.160' : window.location.origin,
	  url: '/contract.html'
    }
  },
  methods: {
    IsEmail,
    getHeights() {
      // 100 是顶部固定的高度, 48是card 的padding 上下, 64是搜索框的高度（变量需获取）24 是<br/> 标签，
      // 24是table  card small padding 上下，32 是表格内的按钮操作的高度
      // 64 是分页的高度+上下margin的距离
      // 54 是table 表头的高度
      // const headerFixedHeight = 100  // 100 是顶部固定的高度
      // const bodyCardHeight = 48  // 48是card 的padding 上下
      // const brHeight = 24 // 是<br/> 标签
      // const tableCardSmall = 24 // 24是table  card small padding 上下
      // const tableBtnHeight = 32 // 32 是表格内的按钮操作的高度
      // const tablePageAgeHeight = 64  // 64 是分页的高度+上下margin的距离
      // const tableHeaderHeight = 54  // 54 是table 表头的高度
      // const { headerFixedHeight, bodyCardHeight, brHeight, tableCardSmall, tableBtnHeight, tablePageAgeHeight, tableHeaderHeight } = heightObj
      const heightObj = {
        headerFixedHeight: 100,
        bodyCardHeight: 48,
        brHeight: 210,
        tableCardSmall: 0,
        tableBtnHeight: 0,
        tablePageAgeHeight: 0,
        tableHeaderHeight: 0
      };
      this.heights = getHight(this, 'serchDiv', heightObj);
    },
    send() {
      this.visible = true;
    },
    print() {
      this.isContractDisabled = true
      this.executePrintPDF()
    },
    handleCancel(e) {
      console.log('Clicked cancel button');
      this.visible = false;
      this.visible = false;
      this.confirmLoading = false;
      this.btnLoading = false
      this.form.resetFields();
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          this.confirmLoading = true;
          this.btnLoading = true
          if (!this.$route.query?.contractNo) {
            this.$message.warning('此订单无合同编号，发生失败！')
            return false
          }
          values.orderNo = this.$route.query?.orderNo || ''
          this.sendEmail(values)
        }
      });
    },
    handleSelectChange(value) {
      console.log(value);
      this.form.setFieldsValue({
        note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
      });
    },
    async sendEmail(values) {
      try {
        const res = await sendEmail(values)
        if (res.code === 200) {
          this.$message.success('邮件发送成功')
          this.visible = false;
          this.confirmLoading = false;
          this.btnLoading = false
          this.form.resetFields();
        }
      } catch (error) {
        this.$message.error('邮件发送失败')
        this.visible = false;
        this.confirmLoading = false;
        this.btnLoading = false
        this.handleCancel()
      }
    },
    queryRouterInfo() {
      this.queryInfo = this.$route.query
	  let systemUrl = getCache('SYSTEMURL');
	  console.log(systemUrl)
	  if (systemUrl === '//bjshqcyb.com/branch') {
	  	this.url = '/branchcontract.html';
	  }
	  console.log(this.queryInfo)
	  console.log(this.url)
    },
    executePrintPDF() {
      this.isContractDisabled = true
      window.frames["proxy_iframe"].focus();
      window.frames["proxy_iframe"].print();
      //调用打印机打印pdf文件
      this.isContractDisabled = false
    },
    Frame() {
      this.$nextTick(() => {
        let Frame = this.$refs["Frame"];
        var obj = {
          orderNo: this.$route.query.orderNo || '',
          token: this.$store.getters.token
        };
        let ip = window.location.port
        if (ip) {
          ip = 'http://47.94.241.160'
        } else {
          ip = window.location.origin
        }
        if (Frame.attachEvent) {
          //兼容浏览器判断
          Frame.attachEvent("onload", function () {
            let iframeWin = Frame.contentWindow;
            iframeWin.postMessage(obj, ip);
            //obj传递的参数   https://xxxx.xx.xx写成子页面的域名或者是ip
          })
        } else {
          Frame.onload = function () {
            let iframeWin = Frame.contentWindow;
            iframeWin.postMessage(obj, ip);
          }
        }
      });
    },
    async contractdownLoadFile() {
      const orderNo = this.$route?.query?.orderNo
      let ip = window.location.port
      if (ip) {
        ip = 'http://47.94.241.160'
      } else {
        ip = window.location.origin
      }
	  let systemUrl = getCache('SYSTEMURL');
	  console.log(systemUrl)
	  if (systemUrl === '//bjshqcyb.com/branch') {
	  	window.open(`${ip}/branch/contract/downLoadFile?orderNo=${orderNo}`)
	  }else {
		  window.open(`${ip}/api/contract/downLoadFile?orderNo=${orderNo}`)
	  }
      
    }
  },
  created() {
	
    this.queryRouterInfo()
    this.Frame()
  },
  mounted() {
    const that = this;
	
    that.getHeights();
    window.onresize = () => {
      that.getHeights();
    };
    that.loading = false
  }
}
</script>
<style scoped lang="scss">
.contract {
  text-align: center;
  line-height: 50px;
  font-size: 30px;
}
</style>