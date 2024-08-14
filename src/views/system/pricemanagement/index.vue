<template>
  <div>
    <tables ref="tables">
      <template #btn>
        <serch ref="serchDiv" @open="open" @listProjectCar="listProjectCar" />
      </template>
      <br />
    </tables>
  </div>
</template>
<script>
import serch from '@/views/system/pricemanagement/components/serch';
import tables from '@/views/system/pricemanagement/components/tables';
export default {
  name: 'management',
  components: {
    serch,
    tables
  },
  data() {
    return {
      heights: 0
    };
  },
  methods: {
    open() {
      this.$refs.tables.handleEdit('', true)
    },
    listProjectCar(e) {
      this.$refs.tables.listProjectCar(e)
    }
  },
};
</script>

<style scoped lang="scss">
.btn {
  margin-bottom: 20px;
}
</style>
