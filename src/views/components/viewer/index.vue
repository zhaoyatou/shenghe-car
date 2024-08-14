<template>
  <div class="content">
    <!-- <h1>Viewer图片预览插件</h1> -->
    <viewer :images="viewerList">
      <img v-for="src in viewerList" :src="src.fileUrl" :key="src.fileId"
        style="width: 50px; height: 50px; margin-right: 5px" />
    </viewer>
  </div>
</template>
 
<script>
export default {
  props: {
    viewerList: {
      type: Array,
      default: [],
    },
  },
  mounted() { },
  data() {
    return {};
  },
};
</script>
 
<style>
</style>