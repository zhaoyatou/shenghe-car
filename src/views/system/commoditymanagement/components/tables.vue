<template>
  <div class="table-wrapper">
    <a-card :hoverable="true" :bordered="false">
      <div class="flex flex-wrap center" style="margin-bottom: 20px">
        <a-space>
          <slot name="btn"></slot>
          <a-select v-model="fromSeach.carBrand" placeholder="请选择品牌名称" style="width: 200px" allowClear>
            <a-select-option v-for="(item, index) in ListcarBrandsData" :key="index" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
          <a-input v-model="fromSeach.content" placeholder="请输入搜索内容" allowClear />
          <a-button type="primary" @click="listAllByName"> 搜索 </a-button>
          <a-button class="btn" type="primary" icon="download" @click="downFile">模板下载</a-button>
          <a-upload
            name="file"
            :loading="spinning"
            :showUploadList="false"
            :headers="importHeaders"
            :before-upload="onBeforeUpload"
          >
            <a-button> <a-icon type="upload" /> 数据导入 </a-button>
          </a-upload>
        </a-space>
      </div>

      <standard-table
        :tableData="tableData"
        :rowKey="(record, index) => index"
        :tableHead="tableHead"
        :loading="loading"
        :pagination="{
          pageSize: filterList.pageSize,
          current: filterList.pageNum,
          total: filterList.total
        }"
        @changeCurrent="handleChangeCurrent"
        :scroll="{ x: 1000 }"
      >
        <div slot="index" slot-scope="{ index }">
          {{ index + 1 }}
        </div>

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
        <a-form-model-item prop="carBrand" label="品牌名称">
          <!-- <a-select v-model="currentEdit.carBrand" placeholder="请选择品牌名称">
            <a-select-option v-for="item, index in ListcarBrandsData" :key="index" :value="item">
              {{ item }}
            </a-select-option>
          </a-select> -->
          <a-input v-model="currentEdit.carBrand" allowClear placeholder="请输入品牌名称" />
        </a-form-model-item>
        <a-form-model-item prop="carSeries" label="车系">
          <a-input v-model="currentEdit.carSeries" allowClear placeholder="请输入车系" />
        </a-form-model-item>
        <a-form-model-item prop="carModel" label="车型">
          <a-input v-model="currentEdit.carModel" allowClear placeholder="请输入车型" />
        </a-form-model-item>
        <a-form-model-item prop="carType" label="类型">
          <a-input v-model="currentEdit.carType" allowClear placeholder="请输入汽车类型" />
        </a-form-model-item>
        <a-form-model-item prop="carPeriod" label="质保周期">
          <a-input v-model="currentEdit.carPeriod" allowClear suffix="年" placeholder="请输入质保周期" />
        </a-form-model-item>
        <a-form-model-item prop="carMileage" label="质保里程">
          <a-input v-model="currentEdit.carMileage" allowClear suffix="里程" placeholder="请输入质保里程" />
        </a-form-model-item>
        <a-form-model-item prop="carCapacity" label="排量">
          <a-input v-model="currentEdit.carCapacity" allowClear placeholder="请输入排量" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import standardTable from '@/components/standardTable/index';
import { listAllByName, saveCar, delCar, listCarBrand, importProjectData } from '@/api/index';
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
          width: 80,
          scopedSlots: {
            customRender: 'index'
          }
        },
        {
          title: '品牌',
          align: 'center',
          dataIndex: 'carBrand',
          width: 200,
          customRender: text => {
            return text || '-';
          }
        },
        {
          title: '车系',
          dataIndex: 'carSeries',
          align: 'center',
          width: 350,
          customRender: text => {
            return text || '-';
          }
        },
        {
          title: '车型',
          dataIndex: 'carModel',
          align: 'center',
          width: 170
        },

        {
          title: '类型',
          dataIndex: 'carType',
          align: 'center',
          width: 200,
          customRender: text => {
            return text || '-';
          }
        },
        {
          title: '排量',
          dataIndex: 'carCapacity',
          align: 'center',
          width: 120,
          customRender: text => {
            return text || '-';
          }
        },
        {
          title: '质保周期（年）',
          dataIndex: 'carPeriod',
          align: 'center',
          width: 120,
          customRender: text => {
            return text ? text + '年' : '-';
          }
        },
        {
          title: '质保里程（公里）',
          dataIndex: 'carMileage',
          align: 'center',
          width: 120,
          customRender: text => {
            return text ? text + '公里' : '-';
          }
        },

        {
          title: '操作',
          align: 'center',
          fixed: 'right',
          scopedSlots: {
            customRender: 'action'
          },
          width: 180
        }
      ],
      tableData: [],
      loading: false,
      selectedRowKeys: [],
      selectValue: [],
      currentEdit: {
        projectYearsData: [
          {
            projectMileage: '',
            prodYear: '',
            key: Date.now()
          }
        ]
      },
      editShow: false,
      filterList: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      deleteLoading: false,
      exportLoading: false,
      editShowTitle: '编辑',
      ListLeaderData: [],
      rules: {
        carBrand: [
          {
            required: true,
            message: '请输入品牌名称',
            trigger: 'change'
          }
        ],
        carSeries: [
          {
            required: true,
            message: '请输入车系',
            trigger: 'change'
          }
        ],
        carModel: [
          {
            required: true,
            message: '请输入车型',
            trigger: 'change'
          }
        ],
        carType: [
          {
            required: true,
            message: '请输入汽车类型',
            trigger: 'change'
          }
        ],
        carPeriod: [
          {
            required: true,
            message: '请输入质保周期',
            trigger: 'change'
          }
        ],
        carMileage: [
          {
            required: true,
            message: '请输入质保里程',
            trigger: 'change'
          }
        ],
        carCapacity: [
          {
            required: true,
            message: '请输入排量',
            trigger: 'change'
          }
        ]
      },
      ListcarBrandsData: [],
      fromSeach: {}
    };
  },
  created() {
    this.listAllByName();
    this.listCarBrand();
  },
  mounted() {},
  methods: {
    // 魔板下载
    downFile() {
      window.open('http://47.94.241.160/%E6%95%B0%E6%8D%AE%E5%BA%93%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xlsx');
    },
    onBeforeUpload(file) {
      const isIMAGE = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const isLt1M = file.size / 1024 / 1024 < 10;
      if (!isIMAGE) {
        this.$message.error('上传文件只能是xlsx格式!');
        return false;
      }
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 10M!');
        return false;
      }
      // 上传
      this.importProjectData(file);
    },
    // 导入数据
    async importProjectData(value) {
      let that = this;
      try {
        // if (value.fileList.length > 1) {
        //   //限制只上传一个文件，再次上传时则替换(覆盖)以前的文件
        //   value.fileList.splice(0, 1)
        // }
        const formData = new FormData();
        formData.append('file', value);
        that.spinning = true;
        const res = await importProjectData(formData);
        that.spinning = false;
        if (res.code === 200) {
          that.$message.success(res.message || '上传成功');
          that.listAll();
        } else {
          that.$message.warning(res.message || '上传失败，请稍后再试');
        }
      } catch (error) {
        that.spinning = false;
      }
    },
    // 品牌列表
    async listCarBrand() {
      const obj = {};
      const res = await listCarBrand(obj);
      console.log(res);
      this.ListcarBrandsData = res.data;
    },
    handleSelect(key, value) {
      this.selectedRowKeys = key;
      this.selectValue = value;
    },
    // 获取用户列表
    async listAllByName() {
      this.loading = true;
      const { pageNum, pageSize } = this.filterList;
      const res = await listAllByName({
        pageNum,
        pageSize,
        ...this.fromSeach
      });
      this.loading = false;
      if (res.code == 200) {
        const data = res?.data || {};
        this.filterList.total = data.total || 0;
        this.tableData = data.list || [];
        this.tableData?.map(item => {
          const items = item.projectYears?.map(v => (
            <span>
              {' '}
              {v.prodYear}
              年 <br />{' '}
            </span>
          ));
          let msgNode = items;
          item.projectYearsText = msgNode;
        });
      }
    },
    cancel() {
      this.editShow = false;
      this.$refs.ruleForm.resetFields();
      this.currentEdit.projectYearsData = [
        {
          projectMileage: '',
          prodYear: 'sdfsf',
          key: Date.now()
        }
      ];
    },
    // 点击确认、新增、修改
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.saveCar();
        } else {
          return false;
        }
      });
    },
    // 新增、修改的接口
    async saveCar() {
      try {
        const obj = this.currentEdit;
        const res = await saveCar(obj);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.editShow = false;
          this.listAllByName();
          this.$refs.ruleForm.resetFields();
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
      this.listAllByName();
    },

    search() {
      this.filterList.pageNum = 1;
      this.listAllByName();
    },

    handleEdit(val, add) {
      if (!add) {
        this.editShowTitle = '编辑项目';
        this.currentEdit = {
          ...val
        };
      } else {
        this.editShowTitle = '添加项目';
        this.currentEdit = {
          ...val
        };
      }
      this.editShow = true;
    },

    async handleDelete(val) {
      try {
        const { id } = val;
        const res = await delCar({
          id
        });
        if (res.code == 200) {
          this.listAllByName();
          this.$message.success('删除成功');
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
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