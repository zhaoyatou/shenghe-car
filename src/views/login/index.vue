<template>
	<div class="login-container bgImg content">
		<div class="layout">
			<a-row>
				<a-col :span="12">
					<div class="img">
						<!-- <img :src="loginImg" />-->
					</div>
				</a-col>
				<a-col :span="12" style="
            background: rgb(48 141 224);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          ">
					<a-form-model :model="loginForm" :rules="loginRules" class="form-container"
						:wrapper-col="{ span: 24 }" ref="loginForm">
						<div class="title">业务员登录</div>
						<!-- <a-tabs v-model="currentTab" class="tabs" :tabBarGutter="35"> -->
						<!--   <a-tab-pane key="user" tab="账号密码登录"> -->
						<a-form-model-item prop="system" v-if="currentTab === 'user'">
							<a-select @change="handleSystemChange" allowClear placeholder="请选择系统" size="large"
								v-model.trim="loginForm.system">
								<a-select-option value="1"> 北京盛合 </a-select-option>
								<a-select-option value="2"> 河北群嘉 </a-select-option>

							</a-select>

						</a-form-model-item>
						<a-form-model-item prop="userName" v-if="currentTab === 'user'">
							<a-input v-model.trim="loginForm.userName" placeholder="请输入账号" size="large" allow-clear
								@pressEnter="focusPassword">
								<a-icon slot="prefix" type="user" />
							</a-input>
						</a-form-model-item>
						<a-form-model-item prop="password">
							<a-input-password v-model.trim="loginForm.password" placeholder="请输入密码" size="large"
								allow-clear @pressEnter="toLogin" ref="password">
								<svg-icon icon="password" :size="14" slot="prefix"> </svg-icon>
							</a-input-password>
						</a-form-model-item>
						<a-form-model-item prop="vcode">
							<a-row type="flex">
								<a-col :span="16">
									<a-input v-model.trim="loginForm.verificationCode" placeholder="请输入验证码" size="large"
										allow-clear @pressEnter="toLogin" ref="vcode" style="width: 100%">
										<svg-icon icon="password" :size="14" slot="prefix"> </svg-icon>
									</a-input>
								</a-col>
								<a-col :span="8"><img :src="objCode.img" @click="getVerificationCodes"
										style="width: 100%; height: 40px; vertical-align: inherit" />
								</a-col>
							</a-row>
						</a-form-model-item>
						<!--  </a-tab-pane>-->
						<!-- </a-tabs>-->

						<a-form-item style="margin-top: -7px">
							<a-button type="primary" block size="large" :loading="loading" @click="toLogin"> 登录
							</a-button>
						</a-form-item>
					</a-form-model>
				</a-col>
			</a-row>
		</div>
	</div>
</template>

<script>
	import {
		isPhone,
		isPassWord,
		isCode
	} from '@/utils/validate';
	import {
		getCache,
		setCache,
		removeCache
	} from '@/utils/session';
	import {
		getPhoneCode
	} from '@/api/user';
	import {
		getVerificationCode,
		login
	} from '@/api/index';
	export default {
		name: 'login',
		data() {
			const validateUsername = (rule, value, callback) => {
				if (value.trim().length === 0) {
					callback(new Error('用户名不能为空'));
				} else {
					callback();
				}
			};
			const validatePassword = (rule, value, callback) => {
				if (!isPassWord(value)) {
					callback(new Error('请正确输入密码'));
				} else {
					callback();
				}
			};

			const validatePhone = (rule, value, callback) => {
				if (!isPhone(value)) {
					callback(new Error('手机号码有误，请重新填写'));
				} else {
					callback();
				}
			};
			const validateCode = (rule, value, callback) => {
				if (!value) {
					callback(new Error('请输入验证码'));
				} else {
					callback();
				}
			};

			return {
				loginImg: require('@/assets/login/login2.jpg'),
				currentTab: 'user',
				loginForm: {
					userName: '',
					password: '',
					phone: '',
					verificationCode: '',
					code: '',
					remember: true,
					system: '1'
				},
				loginRules: {
					userName: [{
						required: true,
						trigger: 'blur',
						validator: validateUsername
					}],
					password: [{
						required: true,
						trigger: 'blur',
						validator: validatePassword
					}],
					phone: [{
						required: true,
						trigger: 'blur',
						validator: validatePhone
					}],
					code: [{
						required: true,
						trigger: 'blur',
						validator: validateCode
					}],
					verificationCode: [{
						required: true,
						trigger: 'blur',
						validator: validateCode
					}]
				},
				loading: false,
				phoneCode: '获取验证码',
				codeStatus: false,
				currentCode: null,
				objCode: ''
			};
		},
		created() {
			this.loginForm.system = '1';
			setCache('SYSTEMURL', '//bjshqcyb.com/api');
			this.getVerificationCodes();

		},
		mounted() {
			const cache = getCache('LOGIN_INFO');

			if (cache) {
				// this.loginForm.username = cache.username;
				// this.loginForm.password = cache.password;
			}
		},
		methods: {
			handleSystemChange() {
				let baseUrl = '//bjshqcyb.com/api';
				if (this.loginForm.system === '2') {
					baseUrl = '//bjshqcyb.com/branch'
				}
				setCache('SYSTEMURL', baseUrl);
				this.getVerificationCodes();
			},
			focusPassword() {
				this.$refs.password.focus();
			},
			async getVerificationCodes() {
				// this.objCode = await getVerificationCode();
			},
			//获取验证码
			getCode() {
				if (isPhone(this.loginForm.phone)) {
					this.codeStatus = true;
					let time = 60;
					var getPhoneIntval = setInterval(() => {
						if (time > 0) {
							time--;
							this.phoneCode = `重新获取(${time}s)`;
						} else {
							clearInterval(getPhoneIntval);
							getPhoneIntval = null;
							this.phoneCode = '获取验证码';
							this.codeStatus = false;
						}
					}, 1000);

					this.$refs.code.focus();
					getPhoneCode().then(res => {
						this.currentCode = res.data;
						setTimeout(() => {
							this.$notification.success({
									message: '提示',
									description: '验证码获取成功，您的验证码为：' + res.data
								},
								12
							);
						}, 1000);
					});
				} else {
					this.$message.error('请正确输入手机号');
				}
			},
			//登录
			toLogin() {
				this.$refs.loginForm.validate(async valid => {
					if (valid) {
						// 老版接口域名：https://bjshqcyb.com/api
						// 新版接口域名：https://bjshqcyb.com/branch
						// 新版本账号：admin 密码 ：123
						let baseUrl = '//bjshqcyb.com/api';
						if (this.loginForm.system === '2') {
							baseUrl = '//bjshqcyb.com/branch'
						}
						setCache('SYSTEMURL', baseUrl);
						this.loading = true;
						if (this.currentTab === 'user') {
							const {
								userName,
								password,
								verificationCode
							} = this.loginForm;
							const key = this.objCode.key;
							try {
								const res = await login({
									userName,
									password,
									verificationCode,
									key
								});
								if (res.code === 200) {
									this.loading = false;
									this.$store.dispatch('user/userInfos', res?.data);
									this.$router.push({
										path: '/index'
									});
								}
							} catch (err) {
								this.getVerificationCodes()
								this.loading = false;
							}
						} else if (this.currentTab === 'phone') {
							const {
								phone,
								code
							} = this.loginForm;
							this.$store
								.dispatch('user/codeTest', {
									phone,
									code
								})
								.then(() => {
									removeCache('LOGIN_INFO');
									this.$router.push({
										path: '/index'
									});
									this.loading = false;
								})
								.catch(() => {
									setTimeout(() => {
										this.loading = false;
									}, 500);
								});
						}
					} else {
						return false;
					}
				});
			}
		}
	};
</script>
<style lang="scss" scoped>
	.login-container {
		// background-image: url('~@/assets/login/background.jpg');
		height: 100%;
		background-size: cover;

		.layout {
			// width: 55%;
			min-width: 900px;
			margin: 0 auto;

			.img {
				width: 100%;
				background-image: url('~@/assets/login/bj-6.jpg');
				height: 100vh;
				background-position: center;
				background-size: cover;
				background-repeat: no-repeat;
			}

			.form-container {
				width: 400px;
				background: #fff;
				padding: 20px;

				.title {
					font-weight: 700;
					font-size: 1rem;
					text-align: center;
					margin-bottom: 15px;
				}

				.tabs {
					margin: 15px 0;
				}

				.forge-password {
					font-size: 14px;
					float: right;
					color: #1890ff;
				}
			}

			.has-error .ant-form-explain,
			.has-error .ant-form-split {
				text-align: left;
			}
		}
	}
</style>
<style lang="scss">
	.login-container {
		.ant-tabs-bar {
			border-bottom: none !important;
		}

		.ant-input-affix-wrapper .ant-input:not(:first-child) {
			padding-left: 35px !important;
		}

		.ant-tabs-bar {
			margin-bottom: 30px !important;
		}

		.has-error .ant-form-explain {
			text-align: left;
		}
	}
</style>