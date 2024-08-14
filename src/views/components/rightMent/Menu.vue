<template>
  <div style="width: 135px">
    <a-switch default-checked checked-children="dark" un-checked-children="light" @change="changeTheme"
      v-show="false" />
    <a-menu class="amenu" :default-selected-keys="['car']" :default-open-keys="['car', 'calendar', 'sub1']"
      mode="inline" :theme="theme" :selected-keys="[current]" @click="handleClick">
      <a-sub-menu key="car">
        <span slot="title">
          <a-icon type="setting" /><span>操作定位</span>
        </span>
        <a-menu-item key="car-1">车辆信息 </a-menu-item>
        <a-menu-item key="car-2">销售信息 </a-menu-item>
        <a-menu-item key="car-3"> 客户信息 </a-menu-item>
        <a-menu-item key="car-4"> 支付信息 </a-menu-item>
        <a-menu-item key="car-5"> 影像文件 </a-menu-item>
        <a-menu-item key="car-6" :disabled="true"> 修改记录 </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="calendar">
        <span slot="title">
          <a-icon type="calendar" /><span>操作</span>
        </span>
        <a-menu-item v-if="detailsData.operStatus == 2 || !detailsData.operStatus" key="calendar-1"
          :disabled="detailsData.operStatus == 2 || detailsData.operStatus == 3">保存草稿
        </a-menu-item>
        <a-menu-item key="calendar-1" v-if="authType() && detailsData.operStatus == 3">保存
        </a-menu-item>
        <a-menu-item key="calendar-2" :disabled="detailsData.operStatus == 2 || detailsData.operStatus == 3"> 提交审核
        </a-menu-item>
        <a-menu-item key="calendar-3" :disabled="detailsData.operStatus == 2 || detailsData.operStatus !== 3"> 查看合同
        </a-menu-item>
        <a-menu-item key="sub1-3" v-if="!authType() && detailsData.operStatus !== 3"> 修改信息 </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub1" v-if="authType() && detailsData.operStatus !== 3">
        <span slot="title">
          <a-icon type="appstore" /><span>管理</span>
        </span>
        <a-menu-item key="sub1-1">通过审核 </a-menu-item>
        <a-menu-item key="sub1-2" :disabled="detailsData.operStatus == 4"> 驳回处理 </a-menu-item>
        <a-menu-item key="sub1-3"> 修改信息 </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>
<script>
import { authType } from '@/utils/index'
export default {
  props: {
    detailsData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      current: '1',
      theme: 'light'
    };
  },
  methods: {
    authType,
    handleClick(e) {
      console.log('click ', e);
      this.$emit('navgatorIndex', e);
      this.current = e.key;
    },
    changeTheme(checked) {
      this.theme = checked ? 'dark' : 'light';
    }
  }
};
</script>
<style scoped lang="scss">
.amenu {
  position: fixed;
  top: 125px;
  height: 83%;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 170px;
  right: 0;
}
</style>
