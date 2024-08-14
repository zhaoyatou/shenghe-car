<template>
  <a-result class="error-page" status="404" title="404" sub-title="对不起，你访问的页面不存在">
    <template #extra>
      <a-button type="primary" @click="returnHome">
        返回首页
      </a-button>
    </template>
  </a-result>
</template>
<script>
import { asyncRoutes } from '@/router';
import { getCache } from '@/utils/session';
export default {
  data() {
    return {};
  },
  computed: {
    asyncRoutes() {
      return asyncRoutes;
    }
  },
  methods: {
    returnHome() {
      const data = this.filtrRoute(this.asyncRoutes);
      this.$router.replace({
        path: data[0].path
      });
    },
    filtrRoute(routes) {
      if (routes.length == 0) {
        return [];
      }
      return routes.filter(item => item.children)[0].children;
    }
  },
  mounted() {
    const id = getCache('USERIFNO')?.authorityMenu?.authority || ''
    let num
    num = id?.[0]?.id
    switch (Number(num)) {
      case 1:
        this.$router.push('/ewbusiness/newfrom')
        break;
      case 2:
        this.$router.push('/order/list')
        break;
      case 3:
        this.$router.push('/order/retreatsingle')
        break;
      case 4:
        this.$router.push('/statistics/summarystatistics')
        break;
      case 5:
        this.$router.push('/financial/statements')
        break;
      case 6:
        this.$router.push('/business/sreport')
        break;
      case 7:
        this.$router.push('/system/storemanagement')
        break;
      case 8:
        this.$router.push('/system/commoditymanagement')
        break;
      case 9:
        this.$router.push('/system/management')
        break;
      case 12:
        this.$router.push('/system/product')
        break;
      case 13:
        this.$router.push('/system/price')
        break;
      default:
        break;
    }
  }
};
</script>
