var CONFIG={
	baseuri:"http://ssq.51gang.top/",
	 baseuri:"http://120.24.68.107:8090/"
}
CONFIG.API=CONFIG.baseuri;

CONFIG.uploadUrl=CONFIG.API+"attach/upload";
//CONFIG.verifyUrl=CONFIG.API+"open/verify";

CONFIG.localKey={
	"show_img_param":"show_img_param" ,//show-img页面传值
	"page_url":"page_url",             //web-page页面传值
	"server_config":"server_config",
	"user_info":"user_info",
	"token":"token",
	"password":"password",
	"pre_guider_page":"pre_guider_page",
	"pre_reg_page":"pre_reg_page",
	"wxapp_refresh_stat":"wxapp_refresh_stat",
	"wxh5_refresh_stat":"wxh5_refresh_stat",
	
}


CONFIG.logisterMap={
	"STO":"申通",
	"ZTO":"中通",
	"YTO":"圆通快递",
	"SFEXPRESS":"顺丰",
	"YUNDA":"韵达快递",
	"HTKY":"百世快递",
	"CHINAPOST":"邮政包裹",
	"ziti":"自提",
}


CONFIG.sucComment=2;











export default CONFIG;