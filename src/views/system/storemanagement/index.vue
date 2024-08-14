<template>
  <div>
    <tables ref="tables">
      <template #btn>
        <a-button type="primary" class="btn" icon="plus" @click="addPerson">添加门店</a-button>
        <a-button style="margin-left: 12px;" type="dashed" icon="export" @click="exportTable" :loading="exportLoading"> 导出表格 </a-button>
      </template>
    </tables>
  </div>
</template>
<script>
import tables from '@/views/system/storemanagement/components/tables';
import { exportStore } from '@/api/index';
export default {
  name: 'management',
  components: {
    tables
  },
  data() {
    return {
      heights: 0,
      exportLoading: false
    };
  },
  methods: {
    addPerson() {
      // 调用子组件编辑弹框的方法
      this.$refs.tables.handleEdit('', true);
    },
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
        brHeight: 24,
        tableCardSmall: 80,
        // tableBtnHeight: 32,
        tablePageAgeHeight: 64,
        tableHeaderHeight: 54
      };
      // this.heights = getHight(this, 'serchDiv', heightObj);
      // console.log(this.heights);
    },
    async exportTable() {
      try {
        this.exportLoading = true;
        const res = await exportStore();
        this.exportLoading = false;
        if (res.code === 200) {
          this.$message.success('导出成功');
          window.open(res?.data?.fileUrl);
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        this.exportLoading = false;
      }
    }
  },
  mounted() {
    const that = this;
    that.$nextTick(() => {
      that.getHeights();
    });
    window.onresize = () => {
      that.getHeights();
    };
  }
};
</script>

<style scoped lang="scss">
.btn {
  margin-bottom: 20px;
}
</style>
