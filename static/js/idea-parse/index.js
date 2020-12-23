var videoType=["avi","wmv","m3u8","mkv","mp4","mov","rm","3gp","flv","mpg","rmvb"]
var audioType=["mp3","wma","wav","midi","ape","flac"]
//利用正则将<img width="xx" height="yy" style="xx" src="src" xx=xx />
//统一转化成<img style="width:100%" src="src" />
import wxDiscode from "./libs/wxDiscode.js"
function __prepareHtml(h){
	let c = wxDiscode.strDiscode(h)
	let img = (c||"").replace(/\\/g, "").replace(
	/<img[^>]*src=(\s?["']{0,1}[^"^'^>]+["']{0,1})\s?[^>]*>/gi, 
	"<img style=\"width:100%;margin-top:-6px\" src=$1 />");
	let p = img.replace(
	/<p[^>]*style=[^>]+>/g,
	"<p>"
	)
	//去掉fontfamily,有些编辑器生成fontfamily导致fontdamily属性出错
	//<span style="font-family: 微软雅黑, "Microsoft YaHei"; color: rgb(255, 0, 0); font-size: 14px;">注意：</span>
	//<span style="FONT-SIZE: 14px; FONT-FAMILY: 微软雅黑, "Microsoft YaHei";">2020年2月1日</span>
	//<span style="FONT-SIZE: 14px; FONT-FAMILY: 微软雅黑, "Microsoft YaHei"">2020年2月1日</span>
	let fontfamily = img.replace(/(<\s?[^>]+)(FONT-FAMILY\s?:[^;^>]+;?)([^>]+>)/gi,"$1   $3")
	
	//fontfamily = fontfamily.replace(/Microsoft\sYaHei/,"")
	//let fontfamily = img
	//iframe 标签更换
	//<iframe src="http://hnwhyfile.wentiyun.cn/hnwhy/20200213/026c1d13-112a-4309-b6fd-1045410a3881.mp4" width="390" height="250" scrolling="no" frameborder="0" align=""></iframe>
	//<iframe src="http://hnwhyfile.wentiyun.cn/hnwhy/20200209/9c72d058-ff42-4184-950f-9c285c122a0d.mp4" width="390" height="250" scrolling="no" frameborder="0" align=""></iframe>
	//<iframe src="http://hnwhyfile.wentiyun.cn/hnwhy/20200213/026c1d13-112a-4309-b6fd-1045410a3881.mp4" width="390" height="250" scrolling="no" frameborder="0" align=""></iframe>
	let iframe = fontfamily.replace(/<iframe[^>]*src=\s?["']{0,1}([^"^'^>]+)["']{0,1}\s?[^>]*>\s?<\/\s?iframe\s?>/gi,function(dom,url,c){
			let srctype = "a"
			
			audioType.forEach(o=>{
				if(url.indexOf(o)==(url.length-o.length)){
						srctype = "audio"
						return 
				}
			})
			videoType.forEach(o=>{
				if(url.indexOf(o)==(url.length-o.length)){
						srctype = "video"
						return 
				}
			})
			if(srctype=="video"){
				return `<video src="${url}">点击这里打开</video>`
			}else if(srctype=="audio"){
				return `<audio src="${url}">点击这里打开</audio>`
			}else{
				return `<a href="${url}">点击这里查看</a>`
			}
			
	})
	return iframe
	
}

function Core(){
	
}

Core.prototype.prepareHtml = __prepareHtml

var preparUtil=new Core();
export default preparUtil