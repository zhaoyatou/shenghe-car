<template>
  <div class="table-wrapper">
    <a-card :hoverable="true" :bordered="false">
      <div class="flex flex-wrap">
        <slot name="btn"></slot>
      </div>

      <standard-table :tableData="tableData" :rowKey="(record, index) => index" :tableHead="tableHead"
        :loading="loading" :scroll="{ x: 1500 }" :pagination="{
          pageSize: filterList.pageSize,
          current: filterList.pageNum,
          total: filterList.total,
          pageSizeOptions: filterList.pageSizeOptions,
          'showSizeChanger': true,
          'showQuickJumper': true,
        }" @changeCurrent="handleChangeCurrent">
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
    <a-modal :maskClosable="false" :title="editShowTitle" :visible="editShow" okText="确认" cancelText="取消" :width="620"
      @ok="handleOk" @cancel="cancel">
      <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol" layout="horizontal" :model="currentEdit"
        ref="ruleForm" :rules="rules" autoComplete="off">
        <a-form-model-item label="延保项目" prop="prodName">
          <a-select allowClear placeholder="请选择延保项目" :disabled="getByStoreIdAndCarIdData <= 0"
            v-model="currentEdit.projectId" @change="prodNameChange">
            <a-select-option v-for="item, index in getByStoreIdAndCarIdData" :key="index" :value="item.id">
              {{ item.prodName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="延保年限" prop="prodYear">
          <a-select :disabled="projectYears.length <= 0" v-model="currentEdit.prodYear" allowClear placeholder="请选择延保年限"
            @change="changeProjectYears">
            <a-select-option v-for="item, index in projectYears" :key="index" :value="item.prodYear">
              {{ item.prodYear }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="汽车品牌" prop="carBrand">
          <a-select v-model="currentEdit.carBrand" showSearch :filter-option="filterOption"
            :disabled="getCarIdData <= 0" allowClear placeholder="请选择汽车品牌" @change="currentEditCarId">
            <a-select-option v-for="item, index in getCarIdData" :key="index" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="车系" prop="carSeries">
          <a-select v-model="currentEdit.carSeries" showSearch :filter-option="filterOption" :loading="carSeriesLoading"
            :disabled="listCarSeriesByCarBrandData <= 0" allowClear placeholder="请选择车系" @change="currentEditCarSeries">
            <a-select-option v-for="item, index in listCarSeriesByCarBrandData" :key="index" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="车型" prop="carModel">
          <a-select v-model="currentEdit.carModel" showSearch :filter-option="filterOption" :loading="carModelLoading"
            @change="currentEditCarModel" :disabled="listCarModelByCarSeriesData <= 0" allowClear placeholder="请选择车型">
            <a-select-option v-for="item, index in listCarModelByCarSeriesData" :key="index" :value="item.id">
              {{ item.carModel }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="新车费用" prop="carExtendNew">
          <!-- <a-input allowClear placeholder="请输入新车费用" v-model.="currentEdit.carExtendNew" suffix="元" />
           -->
          <a-input-number style="width: 100%" :min="1" :max="9999999" v-model="currentEdit.carExtendNew"
            :formatter="value => `${value}元`" />
        </a-form-model-item>
        <a-form-model-item label="次新车费用" prop="carExtendOld">
          <!-- <a-input allowClear placeholder="请输入次新车费用" v-model="currentEdit.carExtendOld" suffix="元" /> -->
          <a-input-number style="width: 100%" :min="1" :max="9999999" v-model="currentEdit.carExtendOld"
            :formatter="value => `${value}元`" />
        </a-form-model-item>
        <a-form-model-item label="保外车费用" prop="carTramInsured">
          <!-- <a-input allowClear placeholder="请输入保外车费用" v-model="currentEdit.carTramInsured" suffix="元" /> -->
          <a-input-number style="width: 100%" :min="1" :max="9999999" v-model="currentEdit.carTramInsured"
            :formatter="value => `${value}元`" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import standardTable from '@/components/standardTable/index';
import { listProjectCar, saveProjectCar, delProjectCar, listAll, listCarBrandByStoreId, listCarSeriesByCarBrand, listCarModelByCarSeries } from '@/api/index';
import { findObj, findObj1, filterOption } from '@/utils';
export default {
  name: 'tables',
  components: {
    standardTable
  },
  data() {
    return {
      pageSizeOptions: ['10', '50', '200', '1000'],
      tableHead: [
        {
          title: '序号',
          dataIndex: 'index',
          width: 60,
          scopedSlots: { customRender: 'index' }
        },
        {
          title: '延保项目',
          align: 'center',
          dataIndex: 'prodName',
          width: 200,
          customRender: (text) => { return text || '-' }
        },
        {
          title: '延保年限',
          dataIndex: 'prodYear',
          align: 'center',
          width: 120,
          customRender: (text) => { return text || '-' }
        },
        {
          title: '品牌',
          dataIndex: 'carBrand',
          align: 'center',
          width: 100,
        },
        {
          title: '车系',
          dataIndex: 'carSeries',
          align: 'center',
          width: 100,
          customRender: (text) => { return text || '-' }
        },
        {
          title: '车型',
          dataIndex: 'carModel',
          align: 'center',
          width: 320,
          customRender: (text) => { return text || '-' }
        },
        {
          title: '新车费用（元）',
          dataIndex: 'carExtendNew',
          align: 'center',
          width: 140,
          customRender: (text) => { return text + '元' || '-' }
        },
        {
          title: '次新车费用（元）',
          dataIndex: 'carExtendOld',
          align: 'center',
          width: 140,
          customRender: (text) => { return text + '元' || '-' }
        },
        {
          title: '保外车费用（元）',
          dataIndex: 'carTramInsured',
          align: 'center',
          width: 140,
          customRender: (text) => { return text + '元' || '-' }
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
        projectYearsData: [{ projectMileage: '', prodYear: '', key: Date.now() }],
      },
      editShow: false,
      filterList: {
        pageSizeOptions: ['40', '80', '100',],
        pageNum: 1,
        pageSize: 40,
        total: 0
      },
      deleteLoading: false,
      exportLoading: false,
      editShowTitle: '编辑',
      ListLeaderData: [],
      getByStoreIdAndCarIdData: [],
      projectYears: [],
      getCarIdData: [],
      rules: {
        prodYear: [{ required: true, message: '请选择延保年限', trigger: 'change' }],
        carBrand: [{ required: true, message: '请选择汽车品牌', trigger: 'change' }],
        carExtendNew: [{ required: true, message: '请输入新车费用', trigger: 'change' }],
        carExtendOld: [{ required: true, message: '请输入次新车费用', trigger: 'change' }],
        carTramInsured: [{ required: true, message: '请输入保外车费用', trigger: 'change' }],
        carSeries: [{ required: true, message: '请选择车系', trigger: 'change' }],
        carModel: [{ required: true, message: '请选择车型', trigger: 'change' }],
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      listCarSeriesByCarBrandData: [],
      listCarModelByCarSeriesData: [],
      carSeriesLoading: false,
      carModelLoading: false,
    };
  },
  created() {
    this.listProjectCar();
    this.listAll()
    this.listCarBrandByStoreId()
  },
  mounted() {

  },
  methods: {
    filterOption,
    prodNameChange(id) {
      if (!id) return
      this.projectYears = findObj1(this.getByStoreIdAndCarIdData, id).projectYears
      // this.currentEdit.prodYear = null
      this.currentEdit.prodYear = undefined
    },
    changeProjectYears(e) {
      this.currentEdit.prodYear = e
      this.$forceUpdate()
    },
    // 延保项目
    async listAll() {
      const obj = {}
      const res = await listAll(obj)
      this.getByStoreIdAndCarIdData = res.data
    },
    async listCarBrandByStoreId() {
      const obj = {}
      const res = await listCarBrandByStoreId(obj)
      this.getCarIdData = res.data
    },
    handleSelect(key, value) {
      this.selectedRowKeys = key;
      this.selectValue = value;
    },
    // 获取用户列表
    async listProjectCar(e) {
      try {
        this.loading = true;
        let obj = {}
        this.$nextTick(async () => {
          console.log(this.filterList, ';this.filterList')
          const { projectId, prodYear,carSeries,carModel } = this.$children?.[0]?.$children?.[0]?.form?.getFieldsValue()
          obj.projectId = projectId || '',
            obj.prodYear = prodYear || '',
			obj.carSeries = carSeries || '',
			  obj.carModel = carModel || '',


          obj.pageNum = this.filterList.pageNum;
          obj.pageSize = this.filterList.pageSize
          const res = await listProjectCar(obj)
          this.loading = false;
          if (res.code == 200) {
            const data = res?.data || {}
            this.filterList.total = data.total || 0;
            this.tableData = data.list || [];
          }
        })
      } catch (error) {
        this.loading = false
        this.$message.error('网络异常')
        console.log(error)
      }
    },
    cancel() {
      this.editShow = false;
      this.$refs.ruleForm.resetFields();
    },
    // 点击确认、新增、修改
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.saveProjectCar()
        } else {
          return false;
        }
      });
    },
    // 新增、修改的接口
    async saveProjectCar() {
      try {
        const obj = {
          id: this.currentEdit?.id || '',
          projectId: this.currentEdit?.projectId,
          carId: this.currentEdit?.carId,
          // carModel: this.currentEdit?.carModel,
          // carSeries: this.currentEdit?.carSeries,
          carExtendNew: this.currentEdit?.carExtendNew,
          carExtendOld: this.currentEdit?.carExtendOld,
          carTramInsured: this.currentEdit?.carTramInsured,
          prodYear: this.currentEdit?.prodYear,
        }
        const res = await saveProjectCar(obj)
        if (res.code === 200) {
          this.$message.success(res.message)
          this.editShow = false;
          this.$refs.ruleForm.resetFields();
          console.log(this.$parent)
          this.$parent.$children[0].$children[0].$children[0].handleSearch()
          // this.listProjectCar()
        } else {
          this.$message.error(res.message)
        }
      } catch (error) {
        console.log(error)
      }
    },

    changeStatus(val) {
      this.filterList.status = val;
    },

    handleChangeCurrent(val, pageSize) {
      this.filterList.pageNum = val
      this.filterList.pageSize = pageSize
      this.listProjectCar();
    },
    search() {
      this.filterList.pageNum = 1;
      this.listProjectCar();
    },

    async handleEdit(val, add) {
      if (!add) {
        this.editShowTitle = '编辑项目';
      } else {
        this.editShowTitle = '添加项目';
      }
      console.log(this.getByStoreIdAndCarIdData, val.projectId)
      if (this.getByStoreIdAndCarIdData.length > 0 && val?.projectId) {
        this.projectYears = await findObj(this.getByStoreIdAndCarIdData, val.projectId).projectYears
      }
      this.currentEdit = { ...val };
      this.$nextTick(() => {
        this.editShow = true;

      })
    },

    async handleDelete(val) {
      try {
        const { id } = val;
        const res = await delProjectCar({ id })
        if (res.code == 200) {
          this.listProjectCar();
          this.$message.success('删除成功');
        } else {
          this.$message.error(res.message)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取门店关联的所有车系
    listCarSeriesByCarBrand(carBrand) {
      // const brand = findObj(this.getCarIdData, carBrand).carBrand
      this.$nextTick(async () => {
        const obj = { "carBrand": carBrand }
        this.carSeriesLoading = true
        const res = await listCarSeriesByCarBrand(obj)
        this.carSeriesLoading = false
        if (res.code == 200) {
          this.listCarSeriesByCarBrandData = res?.data
        } else {
          this.$message.error(res?.message)
        }
      })
    },
    // 获取门店关联的所有车辆信息
    listCarModelByCarSeries(carBrand, carSeries) {
      // const brand = findObj(this.getCarIdData, carBrand).carBrand
      this.$nextTick(async () => {
        const obj = { "carBrand": carBrand, "carSeries": carSeries }
        this.carModelLoading = true
        const res = await listCarModelByCarSeries(obj)
        this.carModelLoading = false
        if (res.code == 200) {
          this.listCarModelByCarSeriesData = res?.data
        } else {
          this.$message.error(res?.message)
        }
      })
    },
    currentEditCarId(e) {
      this.listCarModelByCarSeriesData = []
      this.currentEdit.carModel = undefined
      this.currentEdit.carSeries = undefined
      this.$nextTick(() => {
        this.listCarSeriesByCarBrand(e)
      })
      this.$forceUpdate()
    },
    currentEditCarSeries(e) {
      this.currentEdit.carModel = undefined
      this.$nextTick(() => {
        this.listCarModelByCarSeries(this.currentEdit.carBrand, e)
      })
      this.$forceUpdate()
    },
    currentEditCarModel(e) {
      this.currentEdit.carId = e
      this.$forceUpdate()
    }
  },
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
