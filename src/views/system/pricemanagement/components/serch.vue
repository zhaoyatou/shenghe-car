<template>
	<div id="components-form-demo-advanced-search">
		<a-form class="ant-advanced-search-form" :label-col="formItemLayout.labelCol"
			:wrapper-col="formItemLayout.wrapperCol" layout="inline" :form="form" @submit="handleSearch"
			autoComplete="off">
			<a-form-item label="延保项目" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
				<a-select allowClear placeholder="请选择延保项目" style="width: 200px" v-decorator="['projectId']"
					@change="prodNameChange">
					<a-select-option v-for="item, index in getByStoreIdAndCarIdData" :key="index" :value="item.id">
						{{ item.prodName }}
					</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="延保年限" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
				<a-select style="width: 200px" :disabled="projectYears.length <= 0" v-decorator="['prodYear']"
					allowClear placeholder="请选择延保年限">
					<a-select-option v-for="item, index in projectYears" :key="index" :value="item.prodYear">
						{{ item.prodYear }}
					</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="车系" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
				<a-input v-decorator="['carSeries']" placeholder="请输入搜索内容" allowClear />

			</a-form-item>
			<a-form-item label="车型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
				<a-input v-decorator="['carModel']" placeholder="请输入搜索内容" allowClear />

			</a-form-item>
			<a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
				<a-button type="primary" html-type="submit" icon="search"> 搜索 </a-button>
				<!-- <a-button :style="{ marginLeft: '8px' }" @click="handleReset"> 清除 </a-button>-->
			</a-form-item>
			<a-form-item>
				<a-button class="btn" icon="plus" @click="addPerson">新建价格</a-button>
			</a-form-item>
			<a-form-item>
				<a-button class="btn" type="primary" icon="download" @click="downFile">模板下载</a-button>
			</a-form-item>
			<a-form-item>
				<!-- <a-button class="btn" icon="swap" @click="exportData">数据导入</a-button>
         -->
				<a-upload name="file" :loading="spinning" :showUploadList="false" :headers="importHeaders"
					:before-upload="onBeforeUpload">
					<a-button>
						<a-icon type="upload" /> 数据导入
					</a-button>
				</a-upload>
			</a-form-item>
			<a-form-item>
				<a-button class="btn" type="dashed" icon="export" :loading="exportProjectCarLoading"
					@click="exportProjectCar">
					数据导出</a-button>
			</a-form-item>
		</a-form>
		<!-- <div style="float: right;">
      <a-space>
        <a-button class="btn" icon="plus" @click="addPerson">新建价格</a-button>
        <a-button class="btn" type="primary" icon="download" @click="downFile">模板下载</a-button>
        <a-button class="btn" icon="swap" @click="exportData">数据导入</a-button>
        <a-button class="btn" type="dashed" icon="export" @click="exportProjectCar">数据导出</a-button>
      </a-space>
    </div> -->
	</div>
</template>
<script>
	import store from '@/store';
	import {
		listAll,
		exportProjectCar,
		importProjectCar
	} from '@/api/index'
	import {
		findObj
	} from '@/utils'
	export default {
		name: 'carinfo',
		data() {
			return {
				importHeaders: {
					token: store.getters.token
				},
				expand: true,
				loadingCard: true,
				spinning: false,
				form: this.$form.createForm(this, {
					name: 'advanced_search'
				}),
				getByStoreIdAndCarIdData: [],
				projectYears: [],
				exportProjectCarLoading: false
			};
		},
		computed: {
			count() {
				return this.expand ? 11 : 7;
			},
			formItemLayout() {
				const {
					formLayout
				} = this;
				return formLayout === 'inline' ?
					{
						labelCol: {
							span: 12
						},
						wrapperCol: {
							span: 10
						},
					} :
					{};
			}
		},
		updated() {
			console.log('updated');
		},
		created() {
			this.listAll()
		},
		methods: {
			prodNameChange(id) {
				if (!id) {
					this.projectYears = []
					this.form.resetFields('prodYear')
					return false
				}
				this.projectYears = findObj(this.getByStoreIdAndCarIdData, id).projectYears
				this.form.resetFields('prodYear')
			},
			// 延保项目
			async listAll() {
				const obj = {}
				const res = await listAll(obj)
				this.getByStoreIdAndCarIdData = res.data
			},
			handleSearch(e) {
				// e.preventDefault();
				this.form.validateFields((error, values) => {
					console.log('form结果: ', values);
					values.pageNum = 1
					this.$emit('listProjectCar', values)
					// this.$parent.productListAll(values, null)
				});
			},
			handleReset() {
				this.form.resetFields();
			},
			addPerson() {
				// 调用子组件编辑弹框的方法
				console.log(this)
				this.$emit('open')
				// this.$parent.handleEdit('', true);
			},
			// 魔板下载
			downFile() {
				window.open('http://47.94.241.160/165371904185962.xlsx')
			},
			onBeforeUpload(file) {
				const isIMAGE = file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
				const isLt1M = file.size / 1024 / 1024 < 10;
				if (!isIMAGE) {
					this.$message.error('上传文件只能是xlsx格式!');
					return false
				}
				if (!isLt1M) {
					this.$message.error('上传文件大小不能超过 10M!');
					return false
				}
				// 上传
				this.importProjectCar(file)
			},
			// 数据导出
			async exportProjectCar() {
				try {
					const obj = this.form.getFieldsValue()
					this.exportProjectCarLoading = true
					const res = await exportProjectCar(obj)
					this.exportProjectCarLoading = false
					if (res.code == 200) {
						console.log('数据导出成功')
						window.open(res?.data?.fileUrl)
					} else {
						this.$message.error('数据导出失败')
					}
				} catch (e) {
					this.exportProjectCarLoading = false
					console.error('数据导出失败---->exportProjectCar', e)
				}
			},
			// 导入数据
			async importProjectCar(value) {
				let that = this
				try {
					// if (value.fileList.length > 1) {
					//   //限制只上传一个文件，再次上传时则替换(覆盖)以前的文件
					//   value.fileList.splice(0, 1)
					// }
					const formData = new FormData()
					formData.append('file', value)
					that.spinning = true
					const res = await importProjectCar(formData)
					that.spinning = false
					if (res.code === 200) {
						that.$message.success(res.message || '上传成功')
						that.listAll()
					} else {
						that.$message.warning(res.message || '上传失败，请稍后再试')
					}
				} catch (error) {
					that.spinning = false
				}
			}
		},
		mounted() {
			this.loadingCard = false;
		}
	};
</script>
<style lang="scss" scoped>
	.ant-advanced-search-form {
		// padding: 24px;
		background: #fff;
		border-radius: 10px;
		display: flex;
		align-items: center;
	}

	.ant-advanced-search-form .ant-form-item {
		// display: flex;
		margin-bottom: 0;
	}

	// .ant-advanced-search-form .ant-form-item-control-wrapper {
	//   flex: 1;
	// }

	#components-form-demo-advanced-search {
		display: flex;
		justify-content: space-between;
		width: 100%;
		align-items: center;
		margin-bottom: 20px;
	}

	#components-form-demo-advanced-search .ant-form {
		max-width: none;
		display: flex;
		justify-content: flex-start;
		flex-direction: unset;
		justify-content: space-between;
		flex-wrap: wrap;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
	}
</style>