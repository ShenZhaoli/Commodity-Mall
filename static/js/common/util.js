import CONFIG from "./constant.js"

function Core(){
	
}


Core.prototype.getRandom=function(n,m){			
	return Math.floor(Math.random()*(m-n+1)+n)
}
Core.prototype.round2pos=function(num){
	var ret= Math.round(num*100)/100;
	return ret;
}
/* ===============================number */	

Core.prototype.isIdcard=function(str){
	var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	if(reg.test(str) === false) {  
	 return false; 
	}else{
		return true;
	}
	
}

Core.prototype.replaceSpace=function(str){
	 let _str=str.replace(/\s+/g,"");
	 return _str;
}
Core.prototype.isNull=function(e){
	 var ret=false;
	 if(typeof e=="undefinded"||e==null||!e){
	  ret=true;
	 }
	 return ret;
};
Core.prototype.notNull=function(e){
	var ret=mainUtil.isNull(e);
	return !ret;
}
Core.prototype.isEmpty=function(e){
	let str=mainUtil.replaceSpace(e);
	return mainUtil.isNull(str);
}
Core.prototype.notEmpty=function(e){
	return !mainUtil.isEmpty(e);
}
Core.prototype.copyTxt=function(content) {
	
  if(mainUtil.isH5()){
	  let textarea = document.createElement("textarea")
	  textarea.value = content
	  textarea.readOnly = "readOnly"
	  document.body.appendChild(textarea)
	  textarea.select() // 选择对象
	  textarea.setSelectionRange(0, content.length) //核心
	  let result = document.execCommand("copy") // 执行浏览器复制命令
	  textarea.remove();
	  mainUtil.toast("复制成功！")
	  return result  	  
  }else{
	  uni.setClipboardData({
		   data: content,
		   success: function () {
			   mainUtil.toast("复制成功！");
		   },
	  	   fail(){
	  		 console.log('此功能不支持h5!');
	  		}
	  });
  }  
}
Core.prototype.endwith=function(str,length,char=''){
	if(mainUtil.isNull(str))return "";	
	let ret="";
	if(str.length>length){
		ret=str.substring(0,length)+char;
	}else{
		ret=str;
	}
	return ret;
}
/* ===============================string */
Core.prototype.pushNoRepeat=function(li, item) {
			var isRepeat = false;
			for (var i in li) {
				var ite = li[i];
				if (item == ite) isRepeat = true
			}
			if (isRepeat == false) {
				li.push(item)
			}
			return li;
	
}
Core.prototype.delArrItem=function(arr, item) { //根据k-v对来删除数组元素
		let n_arr=[];
		for(var i in arr) {
			if(arr[i] != item) {
				n_arr.push(arr[i]);
			}
		}
		return n_arr;
}
Core.prototype.delArrItemByKv=function(arr, k, v) { //根据k-v对来删除数组元素
		let n_arr=[];
		for(var i in arr) {
			if(arr[i][k] != v) {
				n_arr.push(arr[i]);
			}
		}
		return n_arr;
}

Core.prototype.isMapStr=function(_str){
	if(mainUtil.isNull(_str))return false;
	if(_str[0]!='{')return false;
	return _str.indexOf(":")>-1&&_str.indexOf("{")>-1&&_str.indexOf("}")>-1;
}
Core.prototype.isLiStr=function(_str){
	if(mainUtil.isNull(_str))return false;
	if(_str[0]!='[')return false;
	return _str.indexOf("[")>-1&&_str.indexOf("]")>-1;
}

Core.prototype.isJSONString=function(str){
	if(mainUtil.isNull(str))return false;
	let ret=false;
	if(mainUtil.isMapStr(str)||mainUtil.isLiStr(str))ret=true;
	return ret;
}
Core.prototype.parseJSON=function(str){  //主要是为了解决JSON.parse 解析非JSON串的报错问题
	if(mainUtil.isJSONString(str)){
		return JSON.parse(str);
	}else{
		return str;
	}
}

Core.prototype.getLi=function(arr){
	let c_list=[];	
	let local_c_list=[];	
	if(typeof arr=="object")local_c_list=arr;
	if(typeof arr=="string")local_c_list=mainUtil.parseJSON(arr);
		
	if(typeof local_c_list=="object"&&local_c_list.length>0){
		c_list=local_c_list
	}
	return c_list;
}

Core.prototype.getMap=function(obj){
	let c_obj={};
	let local_c_list={};
	if(typeof obj=="object")local_c_list=obj;
	if(typeof obj=="string")local_c_list=mainUtil.parseJSON(obj);		
	if(typeof local_c_list=="object"&&typeof local_c_list!="undefined"){
		c_obj=local_c_list
	}
	return c_obj;
}

Core.prototype.copyObj =function(obj) {          //obj arr 对象的克隆（区分于指针赋值）
       /*  if(obj.constructor == Array) {
            var a = [];
            for(var i in obj) {
                a.push(obj[i]);
            }
            return a;
        } else {
            var o = {}
            for(var i in obj){
                o[i] = obj[i];
            }
            return o;
        } */
       let ret="";
	   ret=JSON.parse(JSON.stringify(obj));
	   return ret;
}

Core.prototype.combineObjectInList =function(arr, item, list) {   //数组去除重复，item为重复判定项，list为重复记录需要累加的值的数组
        var obj = {};            
        var a = [];
        for(var i in arr) {
            if(!obj[arr[i][item]]) {
                obj[arr[i][item]] = mainUtil.copyObj(arr[i]);  //数组克隆
            } else if(!!obj[arr[i][item]]) {
                for(var j in list) {          
                    obj[arr[i][item]][list[j]] = obj[arr[i][item]][list[j]] + parseFloat(arr[i][list[j]]);
                }
            }
        }
        for(var k in obj) {
            a.push(obj[k]);
        }
        return a;
}

/* ===============================object */

Core.prototype.formatTime=function(time, fmt) {
	if(time == null) {
		return;
	}
	var fmt = fmt ? fmt : 'yyyy-MM-dd';
	var time = new Date(time);
	var z = {
		M: time.getMonth() + 1,
		d: time.getDate(),
		h: time.getHours(),
		m: time.getMinutes(),
		s: time.getSeconds()
	};
	fmt = fmt.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
		return((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2);
	});
	return fmt.replace(/(y+)/g, function(v) {
		return time.getFullYear().toString().slice(-v.length);
	});
};

Core.prototype.add_o=function(i){
	return parseInt(i)<10?("0"+i):i;
}
Core.prototype.getDateFormat= function (date,fmt='yyyy-MM-dd hh:mm:ss') { //保证所有浏览器都能得到一个时间格式
    var y = date.getFullYear(), m = date.getMonth() + 1,d = date.getDate(), h =date.getHours(),mi=date.getMinutes(),s=date.getSeconds();
	m=mainUtil.add_o(m);d=mainUtil.add_o(d);h=mainUtil.add_o(h);mi=mainUtil.add_o(mi);s=mainUtil.add_o(s);
	let li=fmt.split(" ");
	if(!!li&&!!li[0]){
		let li3=li[0].split("-");
		let fmt_y=li3[0];let fmt_m=li3[1];let fmt_d=li3[2];
		if(fmt_m=="01")m="01";
		if(fmt_d=="01")d="01";
	}
	if(!!li&&!!li[1]){
		let li2=li[1].split(":");
		let fmt_h=li2[0];let fmt_mi=li2[1];let fmt_s=li2[2];
		if(fmt_h=="00")h="00";else if(fmt_h=="23")h="23";
		if(fmt_mi=="00")mi="00";else if(fmt_mi=="59")mi="59";
		if(fmt_s=="00")s="00";else if(fmt_s=="59")s="59";
	}
	if(!li[1]){
		h=null;mi=null;s=null;
	}
    var str=y + "-" + m + "-" + d;
    if(null!=h){
    	str=str+" "+h;
    	if(null!=mi){
    		str=str+":"+mi;
    		if(null!=s){
    			str=str+":"+s;
    		}		
    	}
    }
    return str;
}
Core.prototype.getDateStr=function(_date,fmt='yyyy-MM-dd hh:mm:ss'){//在不确定后端返回时间 格式 到底是时间戳还是 时间字符串的时候调用此函数
	let date=null;
	let ret="";
	
	let type=typeof _date;
	if("object"==type){
		date=_date;
		//return mainUtil.getDateFormat(_date,fmt);
	}else{
		let date_time=_date;
		if("number"==type)date_time=_date.toString();
		
		if(!(date_time.indexOf(":")>-1)){  //说明入参不是时间格式
			 date=new Date(parseFloat(date_time));				
			// date_time=mainUtil.formatTime(_t_,fmt);
			//date_time=mainUtil.getDateFormat(_t_,fmt);
			// return date_time;
		}else{
			//ret=_date;
			return _date;
		}
	}	
	ret=mainUtil.getDateFormat(date,fmt);
	return ret;
}
Core.prototype.getWeekStartDate=function(time){ //获得本周的开端日期
   var now = new Date(time); //当前日期   
	var nowDayOfWeek = now.getDay(); //今天本周的第几天  
	var nowYear = now.getYear(); //当前年   
	var nowMonth = now.getMonth(); //月   
	var nowDay = now.getDate(); //日   
	var beginHour="09:00:00";  
	var endHour="23:59:59";  
	  
	     nowYear += (nowYear < 2000) ? 1900 : 0; //  
	 nowDayOfWeek = nowDayOfWeek==0?7:nowDayOfWeek; // 如果是周日，就变成周七  
	   
	   
	    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+1);  
	    //return weekStartDate.format("yyyy-MM-dd hh:mm:ss"); 
		  return mainUtil.getDateStr(weekStartDate,"yyyy-MM-dd hh:mm:ss");	
}  
	   
Core.prototype.getWeekEndDate=function(time){//获得本周的停止日期  
		var now = new Date(time); //当前日期   
	    var nowDayOfWeek = now.getDay(); //今天本周的第几天  
	    var nowYear = now.getYear(); //当前年   
	    var nowMonth = now.getMonth(); //月   
	    var nowDay = now.getDate(); //日   
	    var beginHour="09:00:00";  
	    var endHour="23:59:59";  
	  
	     nowYear += (nowYear < 2000) ? 1900 : 0; //  
	     nowDayOfWeek = nowDayOfWeek==0?7:nowDayOfWeek; // 如果是周日，就变成周七  
		
	    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek+1));  
	    //return weekEndDate.format("yyyy-MM-dd hh:mm:ss");  
		
		return mainUtil.getDateStr(weekEndDate,"yyyy-MM-dd hh:mm:ss");	
}
Core.prototype.getDateParam = function(c){
	let o={};
	let now=new Date();
	let nextmonth=new Date(now.getFullYear(),now.getMonth()+1,now.getDate());
	let nextyear=new Date(now.getFullYear()+1,now.getMonth(),now.getDate());
	
	o.todaybegin=mainUtil.getDateStr(now,"yyyy-MM-dd 00:00:00");
	o.todayend=mainUtil.getDateStr(now,"yyyy-MM-dd 23:59:59");
	o.monthbegin=mainUtil.getDateStr(now,"yyyy-MM-01 00:00:00");
	o.monthend=mainUtil.getDateStr(nextmonth,"yyyy-MM-01 00:00:00");
	o.yearbegin=mainUtil.getDateStr(now,"yyyy-01-01 00:00:00");	
	o.yearend=mainUtil.getDateStr(nextyear,"yyyy-01-01 00:00:00");
	
	
	o.weekbegin=mainUtil.getWeekStartDate(new Date().getTime());
	o.weekend=mainUtil.getWeekEndDate(new Date().getTime());
	
	return o;
}

/* ===============================datetime */


Core.prototype.getPlat=function(){
	let ret={};
	//ret.platform=uni.getSystemInfoSync().platform;
	
	// #ifdef H5 
	ret.plat="H5";
	// #endif 
	
	// #ifdef MP-WEIXIN 
	ret.plat="MP-WEIXIN";
	// #endif
	// #ifdef MP-ALIPAY
	ret.plat="MP-ALIPAY";
	// #endif
	// #ifdef MP-BAIDU
	ret.plat="MP-BAIDU";
	// #endif
	// #ifdef MP-TOUTIAO
	ret.plat="MP-TOUTIAO";
	// #endif
	// #ifdef MP-QQ
	ret.plat="MP-QQ";
	// #endif
	// #ifdef MP-360
	ret.plat="MP-360";
	// #endif
	
	// #ifdef APP-PLUS
	ret.plat="APP-PLUS";
	// #endif
	// #ifdef APP-PLUS-NVUE
	ret.plat="APP-PLUS-NVUE";
	// #endif 
		
	return ret.plat;
}

Core.prototype.isWeixin=function(){
	return (typeof navigator!="undefined" 
	&& typeof navigator.userAgent!="undefined"
	&& navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger"
	)
}

Core.prototype.isApp=function(){
	let b1= "APP-PLUS"==mainUtil.getPlat();
	let b2= "APP-PLUS-NVUE"==mainUtil.getPlat();
	return b1||b2;
};

Core.prototype.isH5=function(){
	return "H5"==mainUtil.getPlat();	
};

Core.prototype.getSysInfo=function(){
    let o=uni.getSystemInfoSync();	
	return o;
};

/* ===============================platinfo */



Core.prototype.getQuery = function(url){
	    if(!mainUtil.isH5())return {};
	
	    var obj = {};
		if(typeof url=="undefined")url= location.href;
		var query = url.substr(url.indexOf("?"));
		query=query.substr(1);
		var reg = /([^=&\s]+)[=\s]*([^=&\s]*)/g;
		while(reg.exec(query)){
			obj[RegExp.$1] = decodeURI(RegExp.$2);
		}
		
	    return obj;
}

Core.prototype.jump_to_exter_page=function(src,title){
	if(mainUtil.isWeixin()){
		location.href=src;
	}else{
		let o={};
		o.src=src;o.title=title;
		mainUtil.data_local("page_url",o)
		mainUtil.navigateTo("/pages/common/web-page");
	}		
}

Core.prototype.navigateTo=function (url) {  
   let _url=url;
	uni.navigateTo({
		"url":_url,
		"complete":function(res){
			if("navigateTo:fail can not navigateTo a tabbar page"==res.errMsg){
				mainUtil.switchTab(_url);
			}
		}
	})
}
Core.prototype.redirectTo=function (url) {  
   let _url=url;
	uni.redirectTo({
		"url":_url,
		"complete":function(res){
			if(res.errMsg.indexOf("fail")>-1){
				mainUtil.switchTab(_url);
			} 
		}
	})
}
Core.prototype.reLaunch=function (url) {  
   let _url=url;
	uni.reLaunch({
	    url: _url,
		"complete":function(res){
			if("navigateTo:fail can not navigateTo a tabbar page"==res.errMsg){
				mainUtil.switchTab(_url);
			}
		}
	});
}
Core.prototype.switchTab=function (url) {  
   let _url=url;
	uni.switchTab({
		"url":_url
	})
}

/* ===============================navigetr */

Core.prototype.data_session=function(k,d){
	//console.log("data",k,d)
	if(typeof d=="undefined"){
		var o = sessionStorage.getItem(k);
		if(o==null){
			return null;
		}else{
			o = JSON.parse(o)
			return o.data||o;
		}		
		
	}else if(null==d){
		return sessionStorage.removeItem(k)
	}else{
		var m = {};
		m.type = "string";
		m.data = d;
		sessionStorage.setItem(k, JSON.stringify(m));
	}
}

Core.prototype.data_local=function(k,d){
	if(typeof d=="undefined"){
		var o = uni.getStorageSync(k)
		//console.log(o==null||!o)
		if(o==null||!o){
			return null;
		}else{
			o = JSON.parse(o);
			return o;
		}						
	}else if(null==d){
		return uni.removeStorageSync(k)
	}else{
		return uni.setStorageSync(k,JSON.stringify(d))
	}
}

/* ===============================datachace */


Core.prototype.comfirm = (_content='content',func,_title='提示')=>{
	uni.showModal({
		title: _title,
		content: _content,
		success: function (res) {
			if(res.confirm==true){
				func();
			}		
		}
	});	
}
Core.prototype.toast = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

/* ===============================interactive */

Core.prototype.choose_image_upload=function (imgNum,callback){
	let img_list=[];

	uni.chooseImage({
		 sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
		 sourceType: ['album'], //从相册选择
		 count: imgNum,
			success: (res) => {
				img_list = img_list.concat(res.tempFilePaths);
			    mainUtil.upload_img(img_list,callback)
			}
	})

}
Core.prototype.upload_img=function (img_list,callback){				
				let LIST=img_list;
				let  images = [];
				for(var i = 0,len = LIST.length; i < len; i++){
					var image_obj = {name:'image-'+i,uri:LIST[i]};
					images.push(image_obj);
				}
				var uploadNum=0;
				var imgList=[];
				console.log(images.length+"===上传文件的个数");	
				uni.showLoading({"title":"上传中"});
				for(let i in images){
					let file=images[i].uri;
					mainUtil.upLoad(file,(uploadFileRes)=>{
						let obj=JSON.parse(uploadFileRes);
						let img=obj.data[0].url
						imgList.push(img);
						uploadNum++;
					},(err)=>{
						
					})
				}
				var i=setInterval(()=>{
					if(uploadNum==images.length){
						uni.hideLoading()
						callback(imgList);
						clearInterval(i);
					}
				},2000)							
},
Core.prototype.upLoad=function (file,onSuccess,onError) {//用于base64图片的上传
	return new Promise((resolve,reject)=>{
			uni.uploadFile({
			        url: CONFIG.uploadUrl, //仅为示例，非真实的接口地址
			        filePath: file,
			        name: 'file',
					formData: {
						'user': 'test'
					},
			        success:  (res) =>{
						if(typeof onSuccess=="function"){
							onSuccess(res.data)
						}
						resolve(res.data)
			        },
					fail:(res)=>{
						if(typeof onError=="function"){
							onError(res.data)
						}
						onError(res.data)	
					}
			    });
	})
}

Core.prototype.post=function(url, data, onSuccess, onError) {
			return new Promise((resolve,reject)=>{
				var conf = {};					 
				if(url.indexOf("http")==-1){
					url=CONFIG.API+url;
				}
				conf.url  = url
				if (data) {
					conf.data = data
				}
				conf.success = (res)=>{
					//console.log(res);
					res.data.isOk=()=>{
						return res.data.status==200
					}
					if(!res.data.isOk()){
						if(typeof onError =="function"){
								onError(res.data)
						}
						reject(res.data)
						return 
						
					}
					if(typeof onSuccess =="function"){
							onSuccess(res.data)
					}
					resolve(res.data)
				};
				conf.fail = (res)=>{
					
					if(typeof onError =="function"){
							onError(res.data)
					}
					reject(res.data)
				};
				
				conf.header={
					"Content-Type":"application/x-www-form-urlencoded;charset=utf-8",
					"clientplatform":"xapp"
				}
				let clientid = mainUtil.data_local("clientid")
				if(!!clientid){
					conf.header.clientid = clientid
				}
				
				let user=mainUtil.data_local("user_info");
				if(!!user&&mainUtil.notNull(user.token)){
					conf.header["M-Token"]=user.token;
				}
				let token=mainUtil.data_local("token");
				if(mainUtil.notNull(token)){
					conf.header["M-Token"]=token;
				}
				
				conf.method = "POST";
				return uni.request(conf)
			})
			
	};

/*=============================== xhr */



Core.prototype.refresh_user=function (userid,func) { 
   mainUtil.post("user/find",{id:userid},function(res){
	   let b=!!res&&!!res.data;
	   if(b){
		   mainUtil.data_local("user_info",res.data);
		   if(!!func&&typeof func=="function"){func(res);}	
	   }    
	 },function(err){}) 
}

Core.prototype.wxUserInfo=function(func,param,g_prepage){
			if(!mainUtil.isWeixin()){
				return 
			}
	
			var userInfo = mainUtil.data_local("user_info");
			if(!!userInfo && !!userInfo.wxOpenId){
				return 
			}
			
			var url = location.href.split("#")[0];
			var query = mainUtil.getQuery();
			if(!query["code"]){
				if(!!param) mainUtil.data_local("wxreg_param",param);
				if(!!g_prepage) mainUtil.data_local("pre_guider_page",g_prepage);
				
			    mainUtil.post("wxapi/authorize",{"dsturl":encodeURIComponent(url)},function(res){
					location.replace(res.data)	
			    })
			}else{
				var o={};
				o.code=query["code"];				
				let wxreg_param=mainUtil.data_local("wxreg_param");
				if(!!wxreg_param){
					for(let i in wxreg_param){
						let item=wxreg_param[i];
						if(!mainUtil.isNull(item))o[i]=item;					
					}
					mainUtil.data_local("wxreg_param",null);
				}
							
			    mainUtil.post("wxapi/userinfo",o,(resp)=>{ 
					 if(!!func&&typeof func=="function"){func(resp);}	
			    },function(r){})
			}
}
Core.prototype.getConst=function(){	
	return CONFIG;
}
Core.prototype.getConfig =function(){	
	let ret=mainUtil.data_local("server_config")||{};
	
	return ret;
}
Core.prototype.initConfig =function(func){
	mainUtil.post("config/findall",{},res=>{
		let li=res.rows;
		let CONFIG={}
		for(let  i in li){
			let item=li[i];
			let _val=item.value;
			let val=_val;
			if(mainUtil.isLiStr(_val)){
				val=mainUtil.getLi(_val);
			}else if(mainUtil.isMapStr(_val)){
				val=mainUtil.getMap(_val);
			}					
			CONFIG[item.name]=val;
		}
		delete CONFIG.cfg_weixin_menu;
		delete CONFIG.cfg_access_token;
		delete CONFIG.cfg_agt_fee;
		delete CONFIG.cfg_js_token;
		delete CONFIG.cfg_order_finish_day;
		delete CONFIG.cfg_verify_token;
		delete CONFIG.cfg_wd_point;
		delete CONFIG.join_for_mem;
		delete CONFIG.rebuy_for_mem;	
		mainUtil.data_local("server_config",CONFIG);
		if(!!func&&typeof func=="function")func();
	})
}



/*=============================== other */




Core.prototype.rmLoginMsg=function(){
	mainUtil.data_local("user_info",null);
	
	mainUtil.data_local("token",null);
	mainUtil.data_local("password",null);
	
	mainUtil.data_local("pre_guider_page",null);
	mainUtil.data_local("pre_reg_page",null);
	
};

var __getwxuser__=function(pre_guider_page){
	let query=mainUtil.getQuery();
	let o={};
	for(var key in query){
		o[key]=query[key];
	}
	
	mainUtil.wxUserInfo((res)=>{
		if(res.status==200){
			mainUtil.toast("getwxuser2 callback")
			mainUtil.data_local("user_info",res.data);
			let page=mainUtil.data_local("pre_guider_page");
			if(!!page){
				mainUtil.data_local("pre_guider_page",null);
				if(mainUtil.isWeixin()){
					location.replace(page);
				}else{
					mainUtil.navigateTo(page);
				}			
			}
		}			
	},o,pre_guider_page)
}
var __getwxuser=function(pre_guider_page){
	let _CONFIG=mainUtil.getConfig();
	let val=_CONFIG.wxh5_refresh_stat||'0';
	let local_version=mainUtil.data_local("wxh5_refresh_stat")||"0";
	if(local_version!=val){
		mainUtil.rmLoginMsg();		
		mainUtil.data_local("wxh5_refresh_stat",val)
	}
	__getwxuser__(pre_guider_page);
	
}

var ___updatewxuser=function(pre_guider_page){
	mainUtil.rmLoginMsg();
	__getwxuser__(pre_guider_page);
}







var ____appgetwxuser=function(){
	let _CONFIG=mainUtil.getConfig();
	let val=_CONFIG.wxapp_refresh_stat||'0';
	let local_version=mainUtil.data_local("wxapp_refresh_stat")||"0";
	if(local_version!=val){
		mainUtil.rmLoginMsg();		
		mainUtil.data_local("wxapp_refresh_stat",val)
	}
	____appgetwxuser___();
}

var ____appgetwxuser___=function(){
	let user=mainUtil.data_local("user_info");
	if(!!user&&!!user.wxAppOpenId)return;
	uni.login({
	  provider: 'weixin',
	  success: function (loginRes) {
		  let auth=loginRes.authResult;
		  let o={"token":auth.access_token,"openid":auth.openid};
		  mainUtil.post("wxapi/userinfo_app",o,res=>{		  
			 mainUtil.data_local("user_info",res.data);
		  },err=>{
			  mainUtil.toast(JSON.stringify(err))
		  })
	  }
	});	
}

var ___updateappwxuser=function(pre_guider_page){
	mainUtil.rmLoginMsg();
	____appgetwxuser___();
}




var ____mpgetwxuser=function(){
	
	let _CONFIG=mainUtil.getConfig();
	let val=_CONFIG.wxmp_refresh_stat||'0';
	let local_version=mainUtil.data_local("wxmp_refresh_stat")||"0";
	if(local_version!=val){
		mainUtil.rmLoginMsg();		
		mainUtil.data_local("wxmp_refresh_stat",val)
	}
	____mpgetwxuser___();
}

var ____mpgetwxuser___=function(){
	let user=mainUtil.data_local("user_info");
	if(!!user&&!!user.wxMpOpenId)return;
	uni.login({
	  provider: 'weixin',
	  success: function (loginRes) {
		  let o={"code":loginRes.code};
		  mainUtil.post("wxapi/userinfo_mp",o,res=>{		  
			 mainUtil.data_local("user_info",res.data);		 
		  },err=>{
			  mainUtil.toast(JSON.stringify(err))
		  })
	  }
	});	
}

var ___updatempwxuser=function(pre_guider_page){
	mainUtil.rmLoginMsg();
	____mpgetwxuser___();
}

Core.prototype.wxmpGetUser=function(e){
	let wx_user=e.detail.userInfo;
	let data=mainUtil.data_local("user_info");
	data.wxNickName=wx_user.nickName;
	data.wxHeadImg=wx_user.avatarUrl;
	mainUtil.post("user/update",data,res2=>{
		mainUtil.data_local("user_info",res2.data);
	})	
}

Core.prototype.wxLogin=function(pre_guider_page){
	if(mainUtil.isH5()){
		__getwxuser(pre_guider_page);
	}else if(mainUtil.isApp()){
		____appgetwxuser();
	}else {
		____mpgetwxuser();
	}
}

Core.prototype.updateWxLogin=function(pre_guider_page){
	if(mainUtil.isH5()){
		___updatewxuser(pre_guider_page);
	}else if(mainUtil.isApp()){
		___updateappwxuser();
	}else {
		___updatempwxuser();
	}
}




/* ========================================================= */

var mainUtil=new Core();
export default mainUtil