<template>
  <div class="table-wrapper">
    <a-card :hoverable="true" :bordered="false">
      <div class="flex flex-wrap">
        <slot name="btn"></slot>
        <a-input
          v-model="fromSeach.name"
          style="width: 240px; margin-left: 24px; margin-right: 24px"
          placeholder="请输入门店名称"
          allowClear
        />
        <a-button type="primary" @click="listStore"> 搜索 </a-button>
      </div>

      <standard-table
        :tableData="tableData"
        :rowKey="(record, index) => index"
        :tableHead="tableHead"
        :loading="loading"
        :scroll="{ x: 'auto' }"
        :pagination="{
          pageSize: filterList.pageSize,
          current: filterList.pageNum,
          total: filterList.total
        }"
        @changeCurrent="handleChangeCurrent"
      >
        <div slot="index" slot-scope="{ index }">
          {{ index + 1 }}
        </div>

        <!-- updateTime 审核时间 -->
        <template slot="createTime" slot-scope="text">
          <span>{{ text ? moment(text).format('ll') : '-' }}</span>
        </template>
        <div slot="action" slot-scope="{ text }">
          <a-button type="primary" size="small" icon="edit" @click="handleEdit(text)"> 编辑 </a-button>
          <a-popconfirm title="你确定要删除当前列吗?" ok-text="是" cancel-text="否" @confirm="handleDelete(text)">
            <a-button type="danger" size="small" icon="delete" style="margin-left: 8px"> 删除 </a-button>
          </a-popconfirm>
        </div>
      </standard-table>
    </a-card>

    <a-modal
      :title="editShowTitle"
      :maskClosable="false"
      :visible="editShow"
      okText="确认"
      cancelText="取消"
      :width="620"
      @ok="handleOk"
      @cancel="cancel"
    >
      <a-form-model
        :rules="rules"
        :model="currentEdit"
        ref="ruleForm"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-model-item prop="name" label="门店名称">
          <a-input v-model="currentEdit.name" allowClear placeholder="请输入门店名称" />
        </a-form-model-item>
        <a-form-model-item label="所属城市" prop="city" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
          <a-select allowClear show-search placeholder="请选择所属城市" v-model="currentEdit.city">
            <!-- <a-select-option value="1"> 北京 </a-select-option>
              <a-select-option value="2"> 天津 </a-select-option>
              <a-select-option value="3"> 河北 </a-select-option> -->
            <a-select-option v-for="(item, index) in citys" :key="index" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item prop="address" label="门店地址">
          <a-input v-model="currentEdit.address" allowClear placeholder="请输入门店地址" />
        </a-form-model-item>
        <a-form-model-item prop="tel" label="联系电话">
          <a-input v-model="currentEdit.tel" allowClear placeholder="请输入联系电话" />
        </a-form-model-item>
        <a-form-model-item prop="carBrands" label="关联品牌">
          <a-select
            allowClear
            :maxTagCount="6"
            mode="multiple"
            placeholder="请输入关联品牌"
            v-model="currentEdit.carBrands"
          >
            <a-select-option v-for="(item, index) in ListcarBrandsData" :key="index" :value="item.carBrand">
              {{ item.carBrand }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item prop="prodNames" label="关联产品">
          <a-select
            allowClear
            :maxTagCount="6"
            mode="multiple"
            placeholder="请输入关联产品"
            v-model="currentEdit.prodNames"
          >
            <a-select-option v-for="(item, index) in liststoreProjectData" :key="index" :value="item.prodName">
              {{ item.prodName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item prop="channelName" label="所属渠道">
          <a-input v-model="currentEdit.channelName" allowClear placeholder="请输入所属渠道" />
        </a-form-model-item>
        <a-form-model-item prop="createTime" label="合作时间">
          <a-range-picker
            v-model="currentEdit.createTime"
            :ranges="{ 近一年: [moment().subtract(1, 'year'), moment().subtract(1, 'd')] }"
            :show-time="{
              hideDisabledOptions: true,
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
            }"
            format="YYYY-MM-DD"
          >
            <template slot="dateRender" slot-scope="current">
              <div class="ant-calendar-date">
                {{ current.date() }}
              </div>
            </template>
          </a-range-picker>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import standardTable from '@/components/standardTable/index';
import { listStore, saveStore, storeCarBrand, storeProject, delStore, deleteTable, editTable } from '@/api/index';
import { formatJson } from '@/utils';
import moment from 'moment';
import { isPhone } from '@/utils/validate';
import newCitys from '@/assets/utils/citys';
export default {
  name: 'tables',
  components: {
    standardTable
  },
  data() {
    return {
      tableHead: [
        {
          title: '序号',
          dataIndex: 'index',
          width: 100,
          scopedSlots: { customRender: 'index' }
        },
        // {
        //   title: '所属门店',
        //   align: 'center',
        //   // width: 150,
        //   dataIndex: 'stores',
        //   key: "stores",
        //   customCell: () => {
        //     return {
        //       style: {
        //         maxWidth: '150px',
        //         overflow: 'hidden',
        //         whiteSpace: 'nowrap',
        //         textOverflow:'ellipsis',
        //         cursor:'pointer'
        //       },
        //     }
        //   },
        //   customRender: (text) =>{
        //     const test = text.map((item)=>item.children[0]?.text).join(',') || '-'
        //     return <a-tooltip placement="topLeft" title={text}>{test}</a-tooltip>
        //   }
        // },
        {
          title: '门店名称',
          dataIndex: 'name',
          align: 'center',
          width: 240,
          customRender: text => {
            return text || '-';
          }
        },
        {
          title: '所属城市',
          dataIndex: 'city',
          align: 'center',
          width: 240,
          customRender: text => {
            return text || '-';
          }
        },
        {
          title: '门店地址',
          dataIndex: 'address',
          align: 'center',
          width: 240,
          customRender: text => {
            return text || '-';
          }
        },

        {
          title: '联系电话',
          dataIndex: 'tel',
          align: 'center',
          width: 170,
          customRender: text => {
            return text || '-';
          }
        },
        {
          title: '关联品牌',
          dataIndex: 'carBrands',
          align: 'center',
          width: 260,
          customRender: text => {
            return text || '-';
          }
        },
        {
          title: '关联产品',
          dataIndex: 'prodNames',
          align: 'center',
          width: 260,
          customRender: text => {
            return text || '-';
          }
        },
        // {
        //   title: '所属城市',
        //   dataIndex: 'city',
        //   align: 'center',
        //   width: 120,
        //   customRender: (text) => { return text || '-' }
        // },
        {
          title: '所属渠道',
          dataIndex: 'channelName',
          align: 'center',
          width: 120,
          customRender: text => {
            return text || '-';
          }
        },
        {
          title: '合作时间',
          dataIndex: 'createTime',
          align: 'center',
          width: 240,
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '操作',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
          width: 180
        }
      ],
      tableData: [],
      loading: false,
      selectedRowKeys: [],
      selectValue: [],
      currentEdit: {},
      editShow: false,
      filterList: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      deleteLoading: false,
      exportLoading: false,
      editShowTitle: '编辑账号信息',
      ListcarBrandsData: [],
      liststoreProjectData: [],
      fromSeach: {},
      rules: {
        name: [{ required: true, message: '请输入门店名称', trigger: 'change' }],
        address: [{ required: true, message: '请输入门店地址', trigger: 'change' }],
        createTime: [{ required: true, message: '请选择时间', trigger: 'change' }],
        tel: [
          { required: true, message: '请输入手机号码', trigger: 'change' },
          { validator: isPhone, trigger: 'change' }
        ],
        carBrands: [{ required: true, message: '请选择关联品牌', trigger: 'change' }],
        prodNames: [{ required: true, message: '请选择关联产品', trigger: 'change' }],
        channelName: [{ required: true, message: '请输入所属渠道', trigger: 'change' }],
        city: [{ required: true, message: '请选择所属城市', trigger: 'change' }]
      },
      citys: ''
    };
  },
  created() {
    this.listStore();
    //  湖区上级领导
    this.storeCarBrand();
    //   门店关联所有的项目
    this.ListprodNamesData();
    this.citys = newCitys;
  },
  mounted() {},
  methods: {
    moment,
    handleSelect(key, value) {
      this.selectedRowKeys = key;
      this.selectValue = value;
    },
    //  湖区上级领导
    async storeCarBrand() {
      const obj = {};
      const res = await storeCarBrand(obj);
      console.log(res);
      this.ListcarBrandsData = res.data;
    },
    //   门店关联所有的项目
    async ListprodNamesData() {
      const obj = {};
      const res = await storeProject(obj);
      console.log(res);
      this.liststoreProjectData = res.data;
    },
    // 获取用户列表
    async listStore() {
      this.loading = true;
      const { pageNum, pageSize } = this.filterList;
      const res = await listStore({ pageNum, pageSize, ...this.fromSeach });
      this.loading = false;
      if (res.code == 200) {
        const data = res?.data || {};
        this.filterList.total = data.total || 0;
        this.tableData = data?.list || [];
        this.tableData?.map(item => {
          const items = item.stores?.map(v => (
            <span>
              {v.name}
              <br />{' '}
            </span>
          ));
          let msgNode = items;
          item.stores = msgNode;
        });
      }
    },
    // 点击确认、新增、修改
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.saveStore();
        } else {
          return false;
        }
      });
    },
    // 新增、修改的接口
    async saveStore() {
      try {
        const obj = this.currentEdit;
        obj.cooperationStartTime = moment(obj.createTime[0]);
        obj.cooperationEndTime = moment(obj.createTime[1]);
        let prodNamesObj = [];
        prodNamesObj = this.liststoreProjectData?.filter(v => {
          return obj?.prodNames?.some(item => v?.prodName == item);
        });
        obj.storeProjects = prodNamesObj.map(item => {
          return { projectId: item.id || 1, prodName: item.prodName };
        });
        delete obj.prodNames;
        delete obj.createTime;
        let carBrandObj = [];
        carBrandObj = this.ListcarBrandsData?.filter(v => {
          return obj.carBrands?.some(item => v?.carBrand == item);
        });

        obj.storeCars = carBrandObj.map(item => {
          return { carId: item.id || 1, carBrand: item.carBrand };
        });
        delete obj.carBrands;

        const res = await saveStore(obj);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.editShow = false;
          this.$refs.ruleForm.resetFields();
          this.listStore();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },

    changeStatus(val) {
      this.filterList.status = val;
    },

    handleChangeCurrent(val) {
      this.filterList.pageNum = val;
      this.listStore();
    },

    search() {
      this.filterList.pageNum = 1;
      this.listStore();
    },
    cancel() {
      this.editShow = false;
      this.$refs.ruleForm.resetFields();
    },
    handleEdit(val, add) {
      const obj = {};
      if (!add) {
        this.editShowTitle = '编辑门店';
      } else {
        this.editShowTitle = '添加门店';
        obj.createTime = [];
      }
      const vals = JSON.parse(JSON.stringify(val));
      obj.prodNames = vals?.prodNames ? vals?.prodNames.split(',') : [];
      obj.carBrands = vals?.carBrands ? vals?.carBrands.split(',') : [];
      delete vals?.prodNames;
      delete vals?.carBrands;
      obj.createTime = vals ? [vals?.cooperationStartTime || '', vals?.cooperationEndTime || ''] : [];
      obj.createTime.length > 0 ? delete vals.createTime : vals.createTime;
      this.currentEdit = { ...obj, ...vals };
      this.editShow = true;
    },

    async handleDelete(val) {
      try {
        const { id } = val;
        const res = await delStore({ id });
        if (res.code == 200) {
          this.listStore();
          this.$message.success('删除成功');
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
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

  .ant-popover-inner-content {
    max-height: 150px;
    overflow: auto;
  }
}
</style>
