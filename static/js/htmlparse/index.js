import htmlParser from './html-parser'
function prepareHtml(c){
	return (c||"").replace(/\\/g, "").replace(
	/<img[^>]*src=(\s?["']{0,1}[^"^'^>]+["']{0,1})\s?[^>]*>/g, 
	"<img style=\"width:100%\" src=$1 />");;
}

function Core(){
	
}
Core.prototype.prepareHtml = function(c){
		return (c||"").replace(/\\/g, "").replace(
		/<img[^>]*src=(\s?["']{0,1}[^"^'^>]+["']{0,1})\s?[^>]*>/g, 
		"<img style=\"width:100%\" src=$1 />");;
}

Core.prototype.$htmlParser = function(c){
		let html = parserUtil.prepareHtml(c)
		return htmlParser(html)
}

var parserUtil=new Core();
export default parserUtil