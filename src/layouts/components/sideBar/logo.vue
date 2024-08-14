<template>
  <router-link to="/ewbusiness/newfrom" class="logo-wrapper">
    <svg-icon icon="logo" class="verticalMiddle" :size="20" />
    <div class="logo-title verticalMiddle">{{titleName}}</div>
  </router-link>
</template>

<script>
	import { getCache } from '@/utils/session';
export default {
  name: 'logo',
  data() {
    return {
		titleName: '北京盛合业务中心'
	};
  },
  created() {
  	let systemUrl = getCache('SYSTEMURL');
  	console.log(systemUrl)
  	if (systemUrl === '//bjshqcyb.com/branch') {
  		this.titleName = '河北群嘉业务中心';
  	}
  
  },
};
</script>
