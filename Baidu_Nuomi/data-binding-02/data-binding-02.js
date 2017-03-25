function Observer (obj,isRecursion){
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
				if(typeof newVal === 'object')val = new Observer(newVal,true);
				else {
					val = newVal;
					// 触发watch事件
					that.watch.emit(key,val);
					console.log("你设置了"+key+"，新的值为"+that.data[key]);
				};
			},
			get: function (){
				console.log("你访问了"+key);
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
		if(that.callbacks.hasOwnProperty(key))that.callbacks[key](...arg);
	}
}

// 绑定watch事件
Observer.prototype.$watch = function(key,callback){
	this.watch.on(key,callback);
}


// 测试数据
let obj = new Observer({
 	a: 1,
 	b: 2,
 	c: {
   	  	d: 3,
    	e: 4
 	}
});

console.log('--------------');

let app1 = new Observer({
	name: 'youngwind',
	age: 25
});

app1.data.name = {
	lastName: 'liang',
	firstName: 'shaofeng'
};

app1.data.name.lastName;
// 这里还需要输出 '你访问了 lastName '
app1.data.name.firstName = 'lalala';
// 这里还需要输出 '你设置了firstName, 新的值为 lalala'

console.log('--------------');

let app2 = new Observer({
	name: 'youngwind',
	age: 25
});

// 你需要实现 $watch 这个 API
app2.$watch('age', function(age) {
	console.log(`我的年纪变了，现在已经是：${age}岁了`)
});

app2.data.age = 100; // 输出：'我的年纪变了，现在已经是100岁了'