<template>
  <div class="tableCommon-wrapper">
    <a-table
      :columns="tableHead"
      :data-source="tableData"
      :loading="loading"
      :pagination="pagination"
      :row-selection="rowSelection"
      @change="handleTableChange"
      :customRow="customRow"
      rowKey="id"
      :scroll="scroll"
    >
      <template
        slot-scope="text, record, index"
        :slot="slot"
        v-for="slot in Object.keys($scopedSlots).filter(key => key !== 'expandedRowRender')"
      >
        <slot :name="slot" v-bind="{ text, record, index }"></slot>
      </template>
    </a-table>
  </div>
</template>

<script>
export default {
  name: 'standardTable',
  props: {
    tableHead: {
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Boolean | Object
    },
    rowSelection: {
      type: Object
    },
    scroll: {
      type: Object
    }
  },
  data() {
    return {
      // 自定义行
      customRow(record) {
        return {
          on: {
            click: e => {
              const children = e.target.parentNode.children;
              let hasClass = false;
              for (let i = 0; i < children.length; i++) {
                if (children[i].classList.contains('checked-td-of-add-table')) {
                  hasClass = true;
                }
              }
              const oldList = document.querySelectorAll('.checked-td-of-add-table');
              if (oldList) {
                for (let j = 0; j < oldList.length; j++) {
                  oldList[j].classList.remove('checked-td-of-add-table');
                }
              }
              if (!hasClass) {
                for (let i = 0; i < children.length; i++) {
                  children[i].classList.add('checked-td-of-add-table');
                }
              }
            }
          }
        };
      }
    };
  },
  methods: {
    handleTableChange(val) {
      this.$emit('changeCurrent', val.current, val.pageSize);
    }
  }
};
</script>
<style scoped labg="scss">
/deep/ .checked-td-of-add-table {
  background-color: #e6f7ff;
}
</style>
