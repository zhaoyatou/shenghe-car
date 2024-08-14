<template>
  <div class="table-wrapper">
    <a-card :hoverable="true" :bordered="false">
      <div class="flex flex-wrap">
        <slot name="btn"></slot>
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
        :scroll="{ x: 1200 }"
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
      :maskClosable="false"
      :title="editShowTitle"
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
        style="text-align: center"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-model-item prop="prodName" label="项目名称">
          <a-input v-model="currentEdit.prodName" allowClear placeholder="请输入项目名称" />
        </a-form-model-item>
        <a-form-model-item prop="customerDesc" label="客户声明">
          <tinymce v-model="currentEdit.customerDesc" />
        </a-form-model-item>
        <a-form-model-item prop="prodRules" label="服务手册">
          <tinymce v-model="currentEdit.prodRules" />
        </a-form-model-item>
        <a-form-model-item prop="remark" label="备注">
          <a-textarea
            v-model="currentEdit.remark"
            auto-size
            allowClear
            placeholder="请输入备注"
            :auto-size="{ minRows: 2, maxRows: 3 }"
          />
        </a-form-model-item>
        <a-form-model-item prop="projectType" label="车辆类型">
          <!-- 新增projectType （ 1 非运营 2 运营） -->
          <a-radio-group v-model="currentEdit.projectType" style="float: left; margin-top: 8px">
            <a-radio :value="1">非运营</a-radio>
            <a-radio :value="2">运营</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-row :gutter="5">
          <a-col :span="10">
            <a-form-model-item
              label="延保年限"
              v-for="(items, index) in currentEdit.projectYearsData"
              :prop="'projectYearsData.' + index + '.prodYear'"
              :key="items.key"
              :label-col="{ span: 8 }"
            >
              <a-input-number
                :default-value="1"
                :min="1"
                :max="20"
                style="width: 90%"
                :formatter="value => `${value}年`"
                @change="prodYear(items.prodYear, index)"
                v-model="items.prodYear"
              />
              <!-- <a-select
                allowClear
                style="width: 90%;"
                placeholder="请选择延保项目"
                @change="prodYear(items.prodYear, index)"
                v-model="items.prodYear"
              >
                <a-select-option v-for="item, indexs in YearsArr" :key="indexs" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select> -->
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="延保里程"
              v-for="(items, index) in currentEdit.projectYearsData"
              :prop="'projectYearsData.' + index + '.projectMileage'"
              :key="items.key"
              :label-col="{ span: 8 }"
              :rules="{
                required: false,
                message: '请输入延保里程',
                trigger: 'blur'
              }"
            >
              <a-input-number
                :default-value="1"
                :min="1"
                :formatter="value => `${value}公里`"
                style="width: 80%; margin-right: 5px"
                v-model="items.projectMileage"
                @change="projectMileage(items.projectMileage, index)"
                allowClear
                placeholder="请输入延保里程"
              />
              <!-- <a-input suffix="公里" style="width: 80%;margin-right: 5px;" v-model="items.projectMileage" @change="projectMileage(items.projectMileage, index)" allowClear placeholder="请输入延保里程" /> -->
              <a-icon
                v-if="currentEdit.projectYearsData.length > 1"
                class="dynamic-delete-button"
                type="minus-circle-o"
                @click="removeDomain(items)"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-button type="dashed" style="width: 70%" @click="addDomain"> <a-icon type="plus" /> 增加延保年限 </a-button>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import tinymce from '@/components/tinymce/index';
import standardTable from '@/components/standardTable/index';
import { productListAll, saveproduct, delProject } from '@/api/index';
export default {
  name: 'tables',
  components: {
    standardTable,
    tinymce
  },
  data() {
    return {
      tableHead: [
        {
          title: '序号',
          dataIndex: 'index',
          width: 80,
          scopedSlots: { customRender: 'index' }
        },
        {
          title: '项目名称',
          align: 'center',
          dataIndex: 'prodName',
          width: 200,
          customRender: text => {
            return text || '-';
          }
        },

        {
          title: '客户声明',
          dataIndex: 'customerDesc',
          align: 'center',
          width: 350,
          // ellipsis: true,
          customCell: () => {
            return {
              style: {
                maxWidth: '150px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                cursor: 'pointer'
              }
            };
          },
          customRender: text => {
            const test = this.highlight(text);
            // const test = text.map((item) => item.children[0]?.text).join('/') || '-'
            return test ? (
              test.length > 50 ? (
                <a-tooltip placement="topLeft" title={test}>
                  {test}
                </a-tooltip>
              ) : (
                test
              )
            ) : (
              '-'
            );
          }
        },
        {
          title: '服务手册',
          dataIndex: 'prodRules',
          align: 'center',
          width: 350,
          // ellipsis: true,
          customCell: () => {
            return {
              style: {
                maxWidth: '150px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                cursor: 'pointer'
              }
            };
          },
          customRender: text => {
            const test = this.highlight(text);
            // const test = text.map((item) => item.children[0]?.text).join('/') || '-'
            return test ? (
              test.length > 50 ? (
                <a-tooltip placement="topLeft" title={test}>
                  {test}
                </a-tooltip>
              ) : (
                test
              )
            ) : (
              '-'
            );
          }
        },
        {
          // saveProject 新增projectType （ 1 非运营 2 运营）
          title: '车辆类型',
          dataIndex: 'projectType',
          align: 'center',
          width: 120,
          customRender: text => {
            return text || '-';
          }
        },
        {
          title: '延保年限',
          dataIndex: 'projectYearsText',
          align: 'center',
          width: 170,
          customCell: () => {
            return {
              style: {
                maxWidth: '150px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                cursor: 'pointer'
              }
            };
          },
          customRender: text => {
            const test = text.map(item => item.children[0]?.text).join('/') || '-';
            return text ? (
              text.length > 4 ? (
                <a-tooltip placement="topLeft" title={text}>
                  {test}
                </a-tooltip>
              ) : (
                test
              )
            ) : (
              '-'
            );
          }
        },

        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center',
          width: 120,
          customRender: text => {
            return text || '-';
          }
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
      currentEdit: {
        projectYearsData: [{ projectMileage: '', prodYear: '', key: Date.now() }]
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
        prodName: [{ required: true, message: '请输入项目名称', trigger: 'change' }],
        customerDesc: [{ required: true, message: '请输入客户声明', trigger: 'change' }],
        prodRules: [{ required: true, message: '请输入服务手册', trigger: 'change' }],
        remark: [{ required: false, message: '请输入备注', trigger: 'change' }],
        projectType: [{ required: true, message: '请选择车辆类型', trigger: 'change' }]
        // prodYear: [{ required: true, message: '请选择延保年限', trigger: 'change' }],
        // projectMileage: [{ required: true, message: '请输入延保里程', trigger: 'change' }],
      }
      // YearsArr: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    };
  },
  created() {
    this.productListAll();
    //  this.listAll()
  },
  mounted() {},
  methods: {
    handleSelect(key, value) {
      this.selectedRowKeys = key;
      this.selectValue = value;
    },
    // 获取用户列表
    async productListAll() {
      this.loading = true;
      const { pageNum, pageSize } = this.filterList;
      const res = await productListAll({ pageNum, pageSize });
      this.loading = false;
      if (res.code == 200) {
        const data = res?.data || {};
        this.filterList.total = data.total || 0;
        this.tableData = data.list || [];
        this.tableData?.map(item => {
          const items = item.projectYears?.map(v => (
            <span>
              {v.prodYear}年<br />{' '}
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
      this.currentEdit.projectYearsData = [{ projectMileage: '', prodYear: 'sdfsf', key: Date.now() }];
    },
    // 点击确认、新增、修改
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const obj = this.currentEdit;
          obj.projectYearsData.forEach((item, i) => {
            if (!item.projectMileage) {
              this.$message.warning(`请补充第${i + 1}条延保年限`);
              throw new Error(`请补充第${i + 1}条延保年限`);
            }
          });
          this.saveproduct();
        } else {
          return false;
        }
      });
    },
    // 新增、修改的接口
    async saveproduct() {
      try {
        const obj = this.currentEdit;
        obj.projectYears = obj.projectYearsData;
        delete obj.projectYearsText;
        delete obj.projectYearsData;
        const res = await saveproduct(obj);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.editShow = false;
          this.productListAll();
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
      this.productListAll();
    },

    search() {
      this.filterList.pageNum = 1;
      this.productListAll();
    },

    handleEdit(val, add) {
      if (!add) {
        this.editShowTitle = '编辑项目';
        val.projectYearsData = val.projectYears;
        this.currentEdit = { ...val };
      } else {
        this.editShowTitle = '添加项目';
        this.currentEdit = { ...val };
        this.currentEdit.prodRules = '';
        this.currentEdit.customerDesc = '';
        this.currentEdit.projectYearsData = [{ projectMileage: '', prodYear: '', key: Date.now() }];
      }
      this.editShow = true;
    },

    async handleDelete(val) {
      try {
        const { id } = val;
        const res = await delProject({ id });
        if (res.code == 200) {
          this.productListAll();
          this.$message.success('删除成功');
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    removeDomain(item) {
      let index = this.currentEdit.projectYearsData.indexOf(item);
      if (index !== -1) {
        this.currentEdit.projectYearsData.splice(index, 1);
        this.$forceUpdate();
      }
    },
    addDomain() {
      const obj = { projectMileage: '', prodYear: '', key: Date.now() };
      const projectYearsData = this.currentEdit?.projectYearsData || [];
      this.currentEdit.projectYearsData.push(obj);
      this.$forceUpdate();
    },
    prodYear(e, i) {
      this.$forceUpdate();
    },
    projectMileage(e, i) {
      this.$forceUpdate();
    },
    highlight(item) {
      return item.replace(/<[^>]+>/g, ''); // 去掉所有的html标记
    }
  }
};
</script>
<style>
.ant-tooltip-inner {
  width: 500px;
  height: 200px;
  overflow-y: auto;
}
</style>
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
