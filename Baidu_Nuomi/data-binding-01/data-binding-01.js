function Observer (obj){
	var _obj = {
		data: {}
	};

	for(let key in obj){	// 此处存在变量作用域问题，需要用let或采用闭包
		let val = obj[key];

		Object.defineProperty(_obj.data,key,{
			set: function (newVal){
				val = newVal;	// 这行是如何实时起到作用的？
				console.log("你设置了"+key+"，新的值为"+val);
			},
			get: function (){
				console.log("你访问了"+key);
				return val;
			}
		});

		// 若val仍旧是对象则递归处理
		_obj.data[key] = typeof val === 'object' ? new Observer(val) : val;
	}

	return _obj;
}

var app1 = new Observer({
  name: 'youngwind',
  age: 25
});

var app2 = new Observer({
  university: 'bupt',
  major: 'computer'
});

// 要实现的结果如下：
app1.data.name; // 你访问了 name
app1.data.age = 100;  // 你设置了 age，新的值为100
app2.data.university; // 你访问了 university
app2.data.major = 'science';  // 你设置了 major，新的值为 science