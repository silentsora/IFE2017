/* 例子
ajax({
        url: "./TestXHR.aspx",              //请求地址
        type: "POST",                       //请求方式
        data: { name: "super", age: 20 },        //请求参数
        dataType: "json",
        success: function (response, xml) {
            // 此处放成功后执行的代码
        },
        fail: function (status) {
            // 此处放失败后执行的代码
        }
    });
*/
function ajax(options){
	options = options || {};
	options.type = (options.type || "GET").toUpperCase();
	options.dataType = options.dataType || "json";
	var params = formataParams(options.data);

	if (window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
	} else {	//IE6
		var xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}

	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			var status = xhr.status;
			if (status >= 200 && status < 300){
				options.success && options.success(xhr.responseText,xhr.responseXML);
			} else {
				options.fail && options.fail(status);
			}
		}
	}

	if (options.type == "GET") {
		xhr.open("GET",options.url + "?" + params,true);
		xhr.send(null);
	} else if (options.type == "POST") {
		xhr.open("POST",options.url,true);
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xhr.send(params);
	}
}

function formataParams(data) {
	var arr = [];
	for (var name in data) {
		arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
	}
	arr.push(("v=" + Math.random()).replace(".",""));
	return arr.join("&");
}