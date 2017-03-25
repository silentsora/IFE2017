function Vue(obj){
	that = this;

	for (let attr in obj){
		// 值为对象则递归下一层
		if (typeof obj[attr] === 'object') obj[attr] = new Vue(obj[attr]);
		this[attr] = obj[attr];
	}

	// 编译HTML模板片段
	if(this.hasOwnProperty('el')){
		this.node = document.getElementById(this.el.replace("#",''));
		compile(this.node,this.data);
	}
}

function compile(node,data){
	var patt = /\{\{.*\}\}/g;
	var nodeHTML = node.innerHTML;
	var newHTML = nodeHTML.replace(/[{}]/g,'');
	var newModel = [];

	var model = nodeHTML.match(patt);
	
	model.forEach(function(e){
		newModel.push(e.replace(/[{}]/g,''));
	});

	// 变量字符串转译为JS语句
	newModel.forEach(function(e){
		newHTML = newHTML.replace(e,eval('data.' + e));
	})

	node.innerHTML = newHTML;
}

// 创建实例
let app = new Vue({
  el: '#app',
  data: {
    user: {
      name: 'youngwind',
      age: 25
    }
  }
});

console.log(app);