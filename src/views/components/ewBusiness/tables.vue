<template>
  <div class="table-wrapper">
    <a-card :hoverable="true" :bordered="false">
      <div class="flex flex-wrap">
        <slot name="btn"></slot>
      </div>

      <standard-table
        :tableData="tableData"
        :tableHead="tableHead"
        :loading="loading"
        :pagination="{
          pageSize: filterList.size,
          current: filterList.page,
          total: filterList.total,
          showTotal: total => `${filterList.total} 条`
        }"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelect }"
        @changeCurrent="handleChangeCurrent"
      >
        <div slot="index" slot-scope="{ index }">
          {{ index + 1 }}
        </div>
        <div slot="money" slot-scope="{ text }">¥ {{ text }}</div>
        <div slot="action" slot-scope="{ text }">
          <a-button type="primary" size="small" @click="handleEdit(text)"> 编辑 </a-button>
          <a-popconfirm title="你确定要删除当前列吗?" ok-text="是" cancel-text="否" @confirm="handleDelete(text)">
            <a-button type="danger" size="small" style="margin-left: 8px"> 删除 </a-button>
          </a-popconfirm>
        </div>
      </standard-table>
    </a-card>

    <a-modal
      title="编辑"
      :visible="editShow"
      okText="确认"
      cancelText="取消"
      :width="620"
      @ok="handleOk"
      @cancel="editShow = false"
    >
      <a-form-model :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" hideRequiredMark>
        <a-form-model-item prop="id" label="id">
          <a-input v-model="currentEdit.id" disabled />
        </a-form-model-item>
        <a-form-model-item prop="name" label="付款人">
          <a-input v-model="currentEdit.name" disabled />
        </a-form-model-item>
        <a-form-model-item prop="status" label="订单状态">
          <a-input v-model="currentEdit.status" disabled />
        </a-form-model-item>
        <a-form-model-item prop="date" label="下单时间">
          <a-input v-model="currentEdit.date" disabled />
        </a-form-model-item>
        <a-form-model-item prop="money" label="付款金额">
          <a-input v-model="currentEdit.money" disabled />
        </a-form-model-item>
        <a-form-model-item prop="text" label="备注">
          <a-input v-model="currentEdit.text" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import standardTable from '@/components/standardTable/index';
import { getTableData, deleteTable, editTable } from '@/api/table';
import { formatJson } from '@/utils';
export default {
  name: 'tables',
  components: { standardTable },

  data() {
    return {
      typeOption: [
        {
          key: '待付款',
          label: '待付款'
        },
        {
          key: '待发货',
          label: '待发货'
        },
        {
          key: '已发货',
          label: '已发货'
        },
        {
          key: '已收货',
          label: '已收货'
        },
        {
          key: '已评价',
          label: '已评价'
        }
      ],
      tableHead: [
        {
          title: '序号',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
          width: 60
        },
        {
          title: '用户id',
          dataIndex: 'id',
          ellipsis: true
        },
        {
          title: '付款人',
          dataIndex: 'name'
        },
        {
          title: '订单状态',
          dataIndex: 'status'
        },
        {
          title: '下单时间',
          dataIndex: 'date',
          ellipsis: true
        },
        {
          title: '付款金额',
          dataIndex: 'money',
          scopedSlots: { customRender: 'money' }
        },
        {
          title: '备注',
          dataIndex: 'text',
          ellipsis: true
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          width: 140
        }
      ],
      tableData: [],
      loading: false,
      selectedRowKeys: [],
      selectValue: [],
      currentEdit: {},
      editShow: false,
      filterList: {
        name: '',
        status: '',
        page: 1,
        size: 15,
        total: 0
      },
      deleteLoading: false,
      exportLoading: false
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    handleSelect(key, value) {
      this.selectedRowKeys = key;
      this.selectValue = value;
    },

    getTableData() {
      this.loading = true;
      const { name, status, page, size } = this.filterList;
      getTableData({ page, size, name, status }).then(res => {
        const data = res.data || {};
        this.filterList.total = data.total || 0;
        this.tableData = data.list || [];
        this.loading = false;
      });
    },

    changeStatus(val) {
      this.filterList.status = val;
    },

    handleChangeCurrent(val) {
      this.filterList.page = val;
      this.getTableData();
    },

    search() {
      this.filterList.page = 1;
      this.getTableData();
    },

    handleEdit(val) {
      this.currentEdit = { ...val };
      this.editShow = true;
    },

    handleDelete(val) {
      const { id } = val;
      deleteTable({ id }).then(res => {
        this.getTableData();
        this.$message.success('删除成功');
      });
    },

    handleOk() {
      const { id, text } = this.currentEdit;
      editTable({ id, text }).then(res => {
        this.$message.success('修改成功！');
        this.editShow = false;
        this.getTableData();
      });
    },

    //导出
    handleExport() {
      //由于是前端导出，所以只能导出当前的页的15条数据
      this.exportLoading = true;
      import('@/vendor/Export2Excel').then(excel => {
        const header = [],
          filterVal = [];
        this.tableHead.forEach(item => {
          if (item.title != '操作' && item.title != '序号') {
            header.push(item.title);
            filterVal.push(item.dataIndex);
          }
        });
        const data = formatJson(this.tableData, filterVal);

        excel.export_json_to_excel({
          header,
          data,
          filename: '表单统计'
        });
        this.exportLoading = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.table-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  .filter-wrapper {
    width: 230px;
    .label {
      min-width: 80px;
    }
    .select-width {
      width: 150px;
    }
  }
}
</style>
