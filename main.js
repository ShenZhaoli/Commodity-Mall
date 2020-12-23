import Vue from 'vue'
import App from './App'

App.mpType = 'app'


/* import parserUtil from '@/static/js/htmlparse/index.js'
Vue.prototype.$htmlParser = parserUtil.$htmlParser; */

import perparUtil from '@/static/js/idea-parse/index.js'
Vue.prototype.$prepareHtml = perparUtil.prepareHtml;

import util from "./static/js/common/util.js"


 
//const CONFIG=util.getConfig();

Vue.prototype.$getRandom = util.getRandom;
Vue.prototype.$round2pos = util.round2pos;

Vue.prototype.$isNull = util.isNull;
Vue.prototype.$notNull = util.notNull;
Vue.prototype.$copyTxt = util.copyTxt;
Vue.prototype.$endwith = util.endwith;

Vue.prototype.$pushNoRepeat = util.pushNoRepeat;
Vue.prototype.$delArrItem = util.delArrItem;
Vue.prototype.$delArrItemByKv = util.delArrItemByKv;
Vue.prototype.getLi = util.getLi;
Vue.prototype.getMap = util.getMap;
Vue.prototype.$copyObj = util.copyObj;
Vue.prototype.$combineObjectInList = util.combineObjectInList;

Vue.prototype.$getDateStr = util.getDateStr;
Vue.prototype.$getDateParam = util.getDateParam;

Vue.prototype.getPlat = util.getPlat;
Vue.prototype.isWeixin = util.isWeixin;
Vue.prototype.isApp = util.isApp;
Vue.prototype.isH5 = util.isH5;
Vue.prototype.getSysInfo = util.getSysInfo;

Vue.prototype.getQuery = util.getQuery;
Vue.prototype.$jumpExter = util.jump_to_exter_page;
Vue.prototype.$navigateTo = util.navigateTo;
Vue.prototype.$redirectTo = util.redirectTo;
Vue.prototype.$switchTab = util.switchTab;
Vue.prototype.$reLaunch = util.reLaunch;

Vue.prototype.$dataLocal = util.data_local;
Vue.prototype.$dataSession = util.data_session;

Vue.prototype.$toast = util.toast;
Vue.prototype.$comfirm = util.comfirm;

Vue.prototype.$post = util.post;
Vue.prototype.$upload = util.upLoad;
Vue.prototype.$chooseImageUpload = util.choose_image_upload;


Vue.prototype.initConfig=util.initConfig;
Vue.prototype.getConfig=util.getConfig;
Vue.prototype.getConst=util.getConst;
Vue.prototype.$wxUserInfo = util.wxUserInfo;
Vue.prototype.$refreshUser = util.refresh_user;


Vue.prototype.$rmLoginMsg = util.rmLoginMsg;
Vue.prototype.wxLogin = util.wxLogin;
Vue.prototype.updateWxLogin = util.updateWxLogin;
Vue.prototype.wxmpGetUser= util.wxmpGetUser;

/* ================================================================== */



Vue.prototype.getUser=function(){
	return util.data_local("user_info")||{};
};



Vue.prototype.$updateAppVersion=function(){
	if(!util.isApp())return;
	let os_plat=util.getSysInfo().platform;
	var parseVersion=function(v){
		let v_li=v.split(".");
		let ret=0;		
		for(let i=0;i<v_li.length;i++){
			let a=parseFloat(v_li[i]);			
			let posi=v_li.length-1-i;
			let b=Math.pow(10,posi);		
			let item=a*b;		
			ret=ret+item;
		}
		return ret;	
	}
	if ("ios"==os_plat) {
		//plus.runtime.openURL(serverVersion.force_download_url);
	} else {
		util.post("config/find",{"name":"cfg_android_version"},res=>{
				let data=util.getMap(res.data.value);
				let v_code=parseVersion(data.version);
				
				var __version_code=util.getConst().version_code;
				var version_code=parseVersion(__version_code);						
				if(parseFloat(v_code)>parseFloat(version_code)){				
					var installWgt=function(path, force) {
						if( force ) plus.nativeUI.showWaiting('正在安装');
						plus.runtime.install(
							path,
							{},
							function() {
								if( force ){
									plus.nativeUI.closeWaiting();
									plus.nativeUI.alert('应用资源更新完成！', function() {								
										plus.runtime.restart();
									});
								}
							},
							function(e) {
								if( force ){
									plus.nativeUI.closeWaiting();
									plus.nativeUI.alert('资源更新安装失败[' + e.code + ']：' + e.message);
								}
							}
						);
					}
					var downloadUpdate=function (sourceurl, force) {										
						if( force ) plus.nativeUI.showWaiting('正在下载');
						plus.downloader
							.createDownload(sourceurl, { filename: '_doc/update/' }, function(d, status) {
								if( force ) plus.nativeUI.closeWaiting();
								if (status == 200) {
									installWgt(d.filename, force); //安装更新包
								} else {
									if( force ) plus.nativeUI.alert('下载资源更新包失败！');
								}
							})
							.start();
					}				
					uni.showModal({
						title: '版本更新',
						content: '您有一个新版本需要更新。点击确定开始更新！',
						success: re => {
							if (re.confirm) {
								downloadUpdate(data.url, true);
							} else {
							   // plus.runtime.quit();
							}
						}
					});				
				}							
			})						    
		}	
}
var __isFocus=function(_openid){

	if(util.isNull(_openid)){
		let user=util.data_local("user_info");
		if(!!user)_openid=user.wxOpenId;
	}
	
	if(util.isNull(_openid)){
		return;
	}
	if(!util.isWeixin()){
		return;
	}
	if(!util.isH5()){
		return;
	} 
	
	util.post("wxapi/isfocus",{openid:_openid},(res)=>{
		let data=res.data;
		let o=JSON.parse(data);
		if(0==o.subscribe){
			util.post("config/find",{"name":"wx_mp_code"},res=>{
				let val=res.data.value;
				
				let o={};
				o.image=val||"../../static/img/common/wxqrcode.png";
				o.describe="请长按识别二维码关注公众号";
				o.style="width:10rem;height:10rem"
				
				util.data_local("show_img_param",o);
				util.navigateTo("/pages/common/show-img")
			})
			
			
		}
	}) 
}
Vue.prototype.$isFocus = __isFocus;
const app = new Vue({
    ...App
})
app.$mount()