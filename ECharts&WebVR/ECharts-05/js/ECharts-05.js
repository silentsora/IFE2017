var myChart = echarts.init(document.getElementById("main"));
myChart.showLoading();

(function (){
	var rawData = [];
	ajax({
		url: '../../echarts_data/ticker_A.json',
		type: "GET",
		dataType: "json",
		success: function(response,xml){
			rawData = JSON.parse(response).concat();
			var newData = splitData(rawData);

			buildChart(newData);
		},
		fail: function(status) {
			console.log(status);
			return false;
		}
	});

	function splitData(rawData){
		var tempData = {
			'date': [],
			'data': [],
			'volume': []
		};
		for (var i = 0;i < rawData.length;i++){
			tempData.date.push(rawData[i].Date);

			// date format
			var tempArr = [];
			tempArr[0] = tempData.date[i].slice(0,4);
			tempArr[1] = tempData.date[i].slice(4,6);
			tempArr[2] = tempData.date[i].slice(6,8);
			tempData.date[i] = tempArr.join('-');

			tempData.data[i] = [];
			tempData.data[i].push(rawData[i].Open,rawData[i].Close,rawData[i].Low,rawData[i].High);
			
			tempData.volume.push(rawData[i].Volume);
		};
		return tempData;
	};
})();

function calculateMA(dayCount,data){
	var result = [];
	for(var i = dayCount-1;i<data.length;i++){
		result[i] = 0;
		for(var j = 0;j<dayCount;j++){
			result[i] += parseFloat(data[i-j][1]);
		}
		result[i] /= dayCount;
		result[i] = result[i].toFixed(2);
	};
	return result;
};

var next = 0;
function changeData(data){
	var nowData = {
		date: [],
		data: [],
		volume: []
	};

	nowData.date = data.date.slice(next,next + 30);
	nowData.data = data.data.slice(next,next + 30);
	nowData.volume = data.volume.slice(next,next + 30);

	if(next == data.length - 30)next = 0;
	else next++;

	return nowData;
};

function buildChart(data){
	option = {
		title: {
			text: 'K线图',
			subtext: 'Ticker: A'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross'
			}
		},
		legend: {
			data: ['日K','MA5','MA10','MA20','MA30']
		},
		grid: [
			{
				bottom: '40%'
			},
			{
				top: '70%',
				bottom: '14%'
			}
		],
		xAxis: [
			{
				type: 'category',
				data: data.date,
				scale: true,
				min: 'dataMin',
				max: 'dataMax'
			},
			{
				type: 'category',
				gridIndex: 1,
				data: data.date
			}
		],
		yAxis: [
			{
				scale: true,
				splitArea: {
					show: true
				}
			},
			{
				scale: true,
				gridIndex: 1
			}
		],
		series: [
			{
				name: '日K',
				type: 'candlestick',
				data: changeData(data).data
			},
			{
				name:'成交量',
				type: 'bar',
				xAxisIndex: 1,
				yAxisIndex: 1,
				data: changeData(data).volume
			},
			{
				name: 'MA5',
				type: 'line',
				yAxisIndex: 0,
				yAxisIndex: 0,
				smooth: true,
				lineStyle: {
                    normal: {opacity: 0.3}
                },
				data: calculateMA(5,changeData(data).data)
			},
			{
				name: 'MA10',
				type: 'line',
				yAxisIndex: 0,
				yAxisIndex: 0,
				smooth: true,
				lineStyle: {
                    normal: {opacity: 0.3}
                },
				data: calculateMA(10,changeData(data).data)
			},
			{
				name: 'MA20',
				type: 'line',
				yAxisIndex: 0,
				yAxisIndex: 0,
				smooth: true,
				lineStyle: {
                    normal: {opacity: 0.3}
                },
				data: calculateMA(20,changeData(data).data)
			},
			{
				name: 'MA30',
				type: 'line',
				yAxisIndex: 0,
				yAxisIndex: 0,
				smooth: true,
				lineStyle: {
                    normal: {opacity: 0.3}
                },
				data: calculateMA(30,changeData(data).data)
			}
		]
	};

	myChart.hideLoading();
	myChart.setOption(option);

	setInterval(function(){
		var nowData = changeData(data);
		myChart.setOption({
			xAxis: [{
				data: nowData.date
			},
			{
				data: nowData.date
			}],
			series: [{
				name: '日K',
				data: nowData.data
			},
			{
				name: '成交量',
				data: nowData.volume
			},
			{
				name: 'MA5',
				data: calculateMA(5,nowData.data)
			},
			{
				name: 'MA10',
				data: calculateMA(10,nowData.data)
			},
			{
				name: 'MA20',
				data: calculateMA(20,nowData.data)
			},
			{
				name: 'MA30',
				data: calculateMA(30,nowData.data)
			}]
		});
	},200);
}