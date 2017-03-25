function Observer (obj,isRecursion,fatherKey){
	//判断是否为递归情况
	if(typeof isRecursion === 'undefined')isRecursion = false;

	this.data = obj;
	this.watch = new Event();

	for(let key in obj){
		let val = obj[key];
		let that = this;

		Object.defineProperty(this.data,key,{
			set: function (newVal){
				// 传入新值是对象则递归处理
				if(typeof newVal === 'object')val = new Observer(newVal,true,key);
				else {
					val = newVal;
					// 触发watch事件
					// 递归情况下事件冒泡
					if(isRecursion)that.watch.emit(fatherKey,val);
					else that.watch.emit(key,val);
					//console.log("你设置了"+key+"，新的值为"+that.data[key]);
				};
			},
			get: function (){
				//console.log("你访问了"+key);
				return val;
			}
		});

		this.data[key] = val;
	}

	if(isRecursion)return this.data;
}

// 自定义事件函数
function Event(){
	this.callbacks = {};
	that = this;

	// 绑定事件
	this.on = function (key,callback){
		that.callbacks[key] = callback;
	};
	// 触发事件
	this.emit = function (key,...arg){
		if(that.callbacks.hasOwnProperty(key)){
			that.callbacks[key](...arg);
		}
	}
}

// 绑定watch事件
Observer.prototype.$watch = function(key,callback){
	this.watch.on(key,callback);
}


// 测试数据
let app2 = new Observer({
    name: {
        firstName: 'shaofeng',
        lastName: 'liang'
    },
    age: 25
});

app2.$watch('name', function (newName) {
    console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。');
});

app2.data.name.firstName = 'hahaha';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。
app2.data.name.lastName = 'blablabla';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。

console.log(app2);