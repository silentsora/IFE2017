function Vue(obj,fatherAttr = []){
	this.watch = new Event();

	// 顶层指针
	if (fatherAttr.length === 0) that = this;

	for (let attr in obj){
		// 值为对象则递归下一层
		if (typeof obj[attr] === 'object'){
			fatherAttr.push(attr);
			obj[attr] = new Vue(obj[attr],fatherAttr);
		}
		this[attr] = obj[attr];

		this.watch.on(attr,function(attr,val,rootNode){
			var path = fatherAttr.toString().replace(',','.');

			console.log(`${path}.${attr}的值发生了改变，新值为${val}`);

			compile(that.node,that.data);
		})

		setProperty(this,attr);
	}

	// 编译HTML模板片段
	if(this.hasOwnProperty('el')){
		this.node = document.getElementById(this.el.replace("#",''));
		this.node.originHTML = this.node.innerHTML;
		compile(this.node,this.data);
	}

	function setProperty(obj,attr){
		var val = obj[attr];

		Object.defineProperty(obj,attr,{
			set: function (newVal){
				val = newVal;
				obj.watch.emit(attr,val);	
			},
			get: function (){
				return val;
			}
		});
	}
}

function compile(node,data){
	var patt = /\{\{.*\}\}/g;
	var nodeHTML = node.originHTML;
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

	// 无变化则不修改DOM
	if (node.innerHTML !== newHTML){
		node.innerHTML = newHTML;
	}
	else return;

	// 渲染计数器
	renderCounter++;
	console.log(`第${renderCounter}次渲染`);
	document.getElementById("log").innerHTML += `<p>第${renderCounter}次渲染</p>`;
}

function Event(){
	// 订阅者/回调函数队列
	this.callbacks = {};

	// 订阅/绑定事件 
	this.on = function(attr,callback){
		if (typeof this.callbacks[attr] === 'undefined') this.callbacks[attr] = [];
		this.callbacks[attr].push(callback);
	};

	// 发布/触发事件
	this.emit = function(attr,val){
		this.callbacks[attr].forEach(function(callback){
			callback(attr,val);
		});
	};
}

// 渲染次数计时器
var renderCounter = 0;

// 创建实例
let app = new Vue({
  el: '#app',
  data: {
    user: {
      name: 'youngwind',
      age: 25
    },
    school: 'bupt',
    major: 'computer'
  }
});

document.getElementById("submitName").addEventListener('click',function(){
	app.data.user.name = document.getElementById("name").value;
});

document.getElementById("submitAge").addEventListener('click',function(){
	app.data.user.age = document.getElementById("age").value;
});

document.getElementById("submitMajor").addEventListener('click',function(){
	app.data.major = document.getElementById("major").value;
});