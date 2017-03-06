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

			tempData.data[i] = [];
			tempData.data[i].push(rawData[i].Open,rawData[i].Close,rawData[i].Low,rawData[i].High);
			
			tempData.volume.push(rawData[i].Volume);
		};
		return tempData;
	};
})();

function buildChart(data){
	var myChart = echarts.init(document.getElementById("main"));

	option = {
		title: {
			text: 'K线图'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross'
			}
		},
		legend: {
			data: ['日K']
		},
		grid: {
			bottom: '15%'
		},
		xAxis: {
			type: 'category',
			data: data.date,
			scale: true,
			min: 'dataMin',
			max: 'dataMax'
		},
		yAxis: {
			scale: true,
			splitArea: {
				show: true
			}
		},
		dataZoom: [
			{
				type: 'inside',
				start: 50,
				end: 100
			},
			{
				type: 'slider',
				show: true,
				y: '90%',
				start: 50,
				end: 100
			}
		],
		series: [
			{
				name: '日K',
				type: 'candlestick',
				data: data.data,
			}
		]
	};

	myChart.setOption(option);
}