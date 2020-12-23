<template>
	<view class="content">
		<view class="login-bg">
			<view class="login-card">
				<view class="login-head">请输入你的账户</view>
				<view class="login-input login-margin-b">
					<input type="number" v-model="loginInfo.mobile" placeholder="手机号或者邮箱" />
				</view>
				<view class="login-input">
					<input type="password" v-model="loginInfo.password" placeholder="请输入密码(8-16位)" />
				</view>
				<view class="login-function">
					<view class="login-forget" @click="go_forget">忘记密码</view>
					<view class="login-register" @click="go_register">快速注册></view>
				</view>
			</view>
		</view>
		<view class="login-btn"  @click="loginin">
			<button class="landing" type="primary">登陆</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				
				loginInfo:{
					"mobile":"",
					"password":'',
				}
			}
		},
		onLoad() {
			this.autoLogin();

		},
		methods: {
			autoLogin(){
				let user=this.getUser();
				let mobile=user.mobile;
				let password=this.$dataLocal("password");
				if(!!mobile)this.loginInfo.mobile=mobile;
				if(!!password)this.loginInfo.password=password;
				if(!!mobile&&!!password){
					//this.loginin();
				}
			},
			loginin(){				
				this.$post("user/authwithpwd",this.loginInfo).then(res=>{
					if(res.status!=200){
							this.$toast(res.msg)
							return 
					}
					let user=res.data;
					this.$dataLocal("token",user.token);
					delete user.token;
					this.$dataLocal("user_info",user);
					
					this.$dataLocal("password",this.loginInfo.password);	
					
					
					
					let pre_reg_page=this.$dataLocal("pre_reg_page");
					if(!!pre_reg_page){
						this.$dataLocal("pre_reg_page",null);
						this.$redirectTo(pre_reg_page);
					}else{
						this.$redirectTo("/pages/index/index");
					}				
					
				},err=>{
					this.$toast(err.msg)
				})
			},
			
			go_forget(){
				this.$navigateTo('/pages/login/forget')

			},
			go_register(){
				this.$navigateTo('/pages/login/register')

			}
			
		}
	}
</script>

<style>
	.landing{
		height: 84upx;
		line-height: 84upx;
		border-radius: 44upx;
		font-size: 32upx;
		background: linear-gradient(left,#FF978D, #FFBB69);
	}
	.login-btn{
		padding: 10upx 20upx;
		margin-top: 350upx;
	}
	.login-function{
		overflow: auto;
		padding: 20upx 20upx 30upx 20upx;
	}
	.login-forget{
		float: left;
		font-size: 26upx;
		color: #999;
	}
	.login-register{
		color: #666;
		float: right;
		font-size: 26upx;

	}
	.login-input input{
		background: #F2F5F6;
		font-size: 28upx;
		padding: 10upx 25upx;
		height: 62upx;
		line-height: 62upx;
		border-radius: 8upx;
	}
	.login-margin-b{
		margin-bottom: 25upx;
	}
	.login-input{
		padding: 10upx 20upx;
	}
	.login-head{
		font-size: 34upx;
		text-align: center;
		padding: 25upx 10upx 55upx 10upx;
	}
	.login-card{
		background: #fff;
		border-radius: 12upx;
		padding: 10upx 25upx;
		box-shadow: 0 6upx 18upx rgba(0,0,0,0.12);
		position: relative;
		margin-top: 120upx;
	}
	.login-bg {
		height: 260upx;
		padding: 25upx;
		background: linear-gradient(#FF978D, #FFBB69);
	}
</style>
