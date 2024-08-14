<template>
  <div class="table-wrapper">
    <a-card :hoverable="true" :bordered="false">
      <div class="flex flex-wrap">
        <slot name="btn"></slot>
      
          <a-input v-model="fromSeach.name" style="width: 240px;margin-left: 24px;margin-right: 24px;" placeholder="请输入业务员姓名" allowClear />
          <a-button type="primary" @click="userListAll"> 搜索 </a-button>
      </div>

      <standard-table
        :tableData="tableDataList"
        :rowKey="(record, index) => index"
        :tableHead="tableHead"
        :loading="loading"
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

        <div slot="action" slot-scope="{ text }">
          <a-button type="primary" size="small" icon="edit" @click="handleEdit(text.id)"> 编辑 </a-button>
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
        <a-form-model-item prop="loginAccount" label="登录账号">
          <a-input v-model="currentEdit.loginAccount" allowClear placeholder="请输入登录账号" />
        </a-form-model-item>
        <a-form-model-item prop="realName" label="真实姓名">
          <a-input v-model="currentEdit.realName" allowClear placeholder="请输入真实姓名" />
        </a-form-model-item>
        <a-form-model-item prop="mobile" label="手机号码">
          <a-input v-model="currentEdit.mobile" allowClear placeholder="请输入手机号码" />
        </a-form-model-item>
        <a-form-model-item prop="leaderId" label="上级领导">
          <a-select allowClear placeholder="请选择上级领导" v-model="currentEdit.leaderId">
            <a-select-option v-for="(item, index) in ListLeaderData" :key="index" :value="item.id">
              {{ item.realName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item prop="password" label="登录密码">
          <a-input v-model="currentEdit.password" allowClear placeholder="请输入登录密码" />
        </a-form-model-item>
        <a-form-model-item prop="storesArr" label="关联门店">
          <a-select
            allowClear
            showSearch
            :filter-option="filterOption"
            placeholder="请选择关联门店"
            mode="multiple"
            v-model="currentEdit.storesArr"
          >
            <a-select-option v-for="(item, index) in selectStore" :key="index" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item prop="rule" label="系统权限">
          <a-select
            v-if="editShowTitle != '编辑业务人员'"
            style="width: 200px"
            allowClear
            v-model="selectChangePerson"
            placeholder="请选择业务人员"
            size="small"
            @change="handleSelectChange"
          >
            <a-select-option value="['1','2']"> 业务人员 </a-select-option>
            <a-select-option value="['1','2','3']"> 审核人员 </a-select-option>
            <a-select-option value="['4','5','6']"> 财务人员 </a-select-option>
          </a-select>
          <a-checkbox-group v-model="currentEdit.rule" style="width: 100%">
            <a-row>
              <a-col :span="item.id == 11 ? 24 : 8" v-for="(item, index) in currentEdit.authority" :key="index">
                <a-checkbox :value="item.id"> {{ item.name }} </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import standardTable from '@/components/standardTable/index';
import { userListAll, systemSaveUser, systemListLeader, systedel, userSelectStore } from '@/api/index';
import { formatJson, defaultAuthority, findObj, filterOption } from '@/utils';
import { isPhone } from '@/utils/validate';
import store from '@/store';
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
          scopedSlots: { customRender: 'index' }
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'realName',
          width: 200,
          customRender: text => {
            return text || '-';
          }
        },
        {
          title: '所属门店',
          align: 'center',
          // width: 150,
          dataIndex: 'stores',
          key: 'stores',
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
            if (!text) {
              return '-';
            }
            const test = text.map(item => item?.children?.[0]?.text).join(',') || '-';
            return (
              <a-tooltip placement="topLeft" title={text}>
                {test}
              </a-tooltip>
            );
          }
        },
        {
          title: '联系电话',
          dataIndex: 'mobile',
          align: 'center',
          width: 170,
          customRender: text => {
            return text || '-';
          }
        },
        {
          title: '上级领导',
          dataIndex: 'leaderName',
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
      tableDataList: [],
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
      ListLeaderData: [],
      rules: {
        loginAccount: [{ required: true, message: '请输入登录账号', trigger: 'change' }],
        realName: [{ required: true, message: '请输入真实姓名', trigger: 'change' }],
        date1: [{ required: true, message: '请选择时间', trigger: 'change' }],
        mobile: [
          { required: true, message: '请输入手机号吗', trigger: 'change' },
          { validator: isPhone, trigger: 'change' }
        ],
        leaderId: [{ required: false, message: '请选择上级领导', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码', trigger: 'change' }],
        rule: [
          {
            type: 'array',
            required: true,
            message: '请选择系统权限',
            trigger: 'change'
          }
        ],
        storesArr: [{ required: true, message: '请选择关联门店', trigger: 'change' }]
      },
      selectChangePerson: [],
      selectStore: [],
      fromSeach: {}
    };
  },
  created() {
    this.userListAll();
    //  湖区上级领导
    this.systemListLeader();
    this.userSelectStore();
  },
  mounted() {},
  methods: {
    filterOption,
    handleSelect(key, value) {
      this.selectedRowKeys = key;
      this.selectValue = value;
    },
    //  湖区上级领导
    async systemListLeader(id) {
      const obj = {};
      obj.userId = id || ''; // store?.state?.user?.userInfo?.id
      const res = await systemListLeader(obj);
      console.log(res);
      this.ListLeaderData = res.data;
    },
    // 获取用户列表
    async userListAll() {
      this.loading = true;
      const { pageNum, pageSize } = this.filterList;
      const res = await userListAll({ pageNum, pageSize,...this.fromSeach });
      this.loading = false;
      if (res.code == 200) {
        const data = res?.data || {};
        this.tableData = JSON.parse(JSON.stringify(res?.data?.list));
        this.filterList.total = data.total || 0;
        this.tableDataList = data?.list || [];
        this.tableDataList?.map(item => {
          const items = item?.stores?.map(v => (
            <span>
              {v?.name}
              <br />{' '}
            </span>
          ));
          let msgNode = items;
          item.stores = msgNode;
        });
      }
    },
    cancel() {
      this.editShow = false;
      this.$refs.ruleForm.resetFields();
      this.selectChangePerson = [];
    },
    // 点击确认、新增、修改
    handleOk() {
      console.log(this.currentEdit);
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.systemSaveUser();
        } else {
          return false;
        }
      });
    },
    // 新增、修改的接口
    async systemSaveUser() {
      let authority = defaultAuthority();
      try {
        const obj = this.currentEdit;
        // obj.rule?.map((item)=>{
        authority = authority?.filter(v => {
          return obj.rule?.some(item => v?.id == item);
        });
        // })
        obj['authorityMenu'] = { authority };
        obj['authorityType'] = obj.rule?.some(item => 11 == item) ? 1 : 2;
        delete obj.authority;
        delete obj.rule;
        if (obj.storesArr) {
          const arr = [];
          this.selectStore.map(item => {
            obj.storesArr.map(v => {
              if (item.id == v) {
                arr.push(item);
              }
            });
          });
          obj.stores = arr; // [findObj(this.selectStore, obj.stores)]
        }
        console.log(this.ListLeaderData);
        obj.leaderName = findObj(this.ListLeaderData, obj.leaderId).realName;
        obj.leaderId = findObj(this.ListLeaderData, obj.leaderId).id;
        delete obj.storesArr;
        console.log(obj);
        const res = await systemSaveUser(obj);
        if (res.code === 200) {
          this.$message.success(res.message);
          this.editShow = false;
          this.$refs.ruleForm.resetFields();
          this.userListAll();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(
          error,
          this.currentEdit.stores.map(item => item.id)
        );
        this.currentEdit.rule = this.currentEdit['authorityMenu']?.authority.map(item => item.id);
        this.currentEdit.authority = defaultAuthority();
        this.currentEdit.storesArr = this.currentEdit.stores.map(item => item.id);
        this.$forceUpdate();
      }
    },

    changeStatus(val) {
      this.filterList.status = val;
    },

    handleChangeCurrent(val) {
      this.filterList.pageNum = val;
      this.userListAll();
    },

    search() {
      this.filterList.pageNum = 1;
      this.userListAll();
    },

    handleEdit(val, add) {
      let Authority = defaultAuthority();

      if (!add) {
        this.editShowTitle = '编辑业务人员';
        this.userSelectStore(val.id ? val.id : val);
        this.systemListLeader(val.id ? val.id : val);
      } else {
        this.editShowTitle = '添加业务人员';
        let obj = {};
        obj.rule = [];
        obj.authority = [...Authority];
        this.currentEdit = { ...obj };
        delete this.currentEdit?.id;
        this.editShow = true;
        return false;
      }
      val = findObj(this.tableData, val);
      val?.authorityMenu?.authority?.map(item => {
        Authority = Authority?.filter(v => item?.id !== v?.id);
      });
      val.rule = val ? val?.authorityMenu?.authority.map(item => item?.id) : [];
      val.authority = [...val?.authorityMenu?.authority, ...Authority];
      val.storesArr = val?.stores?.length > 0 && val?.stores[0] ? val?.stores?.map(item => item?.id) : [];
      this.currentEdit = { ...val };
      this.editShow = true;
    },

    async handleDelete(val) {
      try {
        const { id } = val;
        const res = await systedel({ id });
        if (res.code == 200) {
          this.userListAll();
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
    },
    handleSelectChange(e) {
      console.log(e);
      this.currentEdit.rule = eval(e);
    },
    async userSelectStore(id) {
      const obj = {
        id: id || ''
      };
      const res = await userSelectStore(obj);
      this.selectStore = res?.data;
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
