<template>
	<view class="content">
		<view class="forget-bg">
			<view class="forget-card">
				<view class="forget-input forget-margin-b">
					<input type="number" v-model="userInfo.mobile" placeholder="请输入您的手机号" />
				</view>
				<view class="forget-input forget-margin-b">
					<view class="verify-left">
						<input type="number" v-model="userInfo.code" placeholder="请输入验证码" />
					</view>
					<view class="verify-right" @click="sendsms()">
						<button class="verify-btn" type="primary">获取验证码</button>
					</view>
				</view>
				<view class="forget-input">
					<input type="password" v-model="userInfo.password" placeholder="请输入密码(8-16位)" />
				</view>
			</view>
			
			<view class="login-function">
				<!-- <view class="login-forget" @click="go_forget"></view> -->
				<view class="login-register" @click="$navigateTo('/pages/login/login')">返回登陆</view>
			</view>
		</view>
		<view class="forget-btn" @click="submit">
			<button class="landing" type="primary">提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				
				captchaImg: '',
				seconds: 60,
				codeBtn: {
					text: '获取验证码',
					waitingCode: false,
					count: this.seconds
				},
				
				userInfo:{
					"mobile":"",
					"code":"",
					"password":'',
				},
				
				verifyCode:'',
			}
		},
		onLoad() {

		},
		methods: {
			submit(){
				this.$post("user/resetpwd",this.userInfo).then(res=>{
					this.$toast("密码修改成功,请重新登陆")
					setTimeout(()=>{
							this.$navigateTo("/pages/login/login");
					},1000)
				},res=>{
					this.$toast(res.msg)
				})
			},
			sendsms(){
				this.$post("open/sendsms",{"mobile":this.userInfo.mobile,"verify":this.verifyCode}).then(res=>{
					this.$toast(res.msg)
				},res=>{
					this.$toast(res.msg)
				})			
			},
			sendCode: function () {
				this.sendsms();
				
				this.codeBtn.waitingCode = true;
				this.codeBtn.count = this.seconds;
				this.codeBtn.text = this.codeBtn.count + 's';
				
				let countdown = setInterval( () => {
					this.codeBtn.count--;
					this.codeBtn.text = this.codeBtn.count + 's';
					if( this.codeBtn.count < 0 ){
						clearInterval(countdown);
						this.codeBtn.text = '重新发送';
						this.codeBtn.waitingCode = false;
					}
				},1000);
			},

		}
	}
</script>

<style>
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
	
	.verify-left{
		width: calc(100% - 260upx);
	}
	.verify-right{
		padding-left: 20upx;
	}
	.verify-btn{
		height: 80upx;
		line-height: 80upx;
		font-size: 28upx;
		width: 240upx;
		border-radius: 8upx;
		background: linear-gradient(left,#FF978D, #FFBB69);
	}
	.verify-left,.verify-right{
		float: left;
	}
	.landing{
		height: 84upx;
		line-height: 84upx;
		border-radius: 44upx;
		font-size: 32upx;
		background: linear-gradient(left,#FF978D, #FFBB69);
	}
	.forget-btn{
		padding: 10upx 20upx;
		margin-top: 380upx;
	}

	.forget-input input{
		background: #F2F5F6;
		font-size: 28upx;
		padding: 10upx 25upx;
		height: 62upx;
		line-height: 62upx;
		border-radius: 8upx;
	}
	.forget-margin-b{
		margin-bottom: 25upx;
	}
	.forget-input{
		padding: 10upx 20upx;
		overflow: auto;
	}
	.forget-card{
		background: #fff;
		border-radius: 12upx;
		padding: 60upx 25upx;
		box-shadow: 0 6upx 18upx rgba(0,0,0,0.12);
		position: relative;
		margin-top: 120upx;
	}
	.forget-bg {
		height: 260upx;
		padding: 25upx;
		background: linear-gradient(#FF978D, #FFBB69);
	}
</style>
