var myChart = echarts.init(document.getElementById("main"));

var option = {
	title: {
		text: '2016全球手机销量及市场占有率'
	},
	tooltip: {},
	legend: {
		data:['销量','占有率']
	},
	xAxis: {
		data: ['三星','苹果','华为','OPPO','VIVO','其他']
	},
	yAxis: [{
		type: 'value',
		name: '销量',
		position: 'left',
		axisLabel: {
			formatter: '{value}(百万台)'
		}
	},{
		type: 'value',
		name: '占有率',
		position: 'right',
		axisLabel: {
			formatter: '{value}(%)'
		}
	}],
	series: [{
		name: '销量',
		type: 'bar',
		data: [311,215,139,99,77,628]
	},{
		name: '占有率',
		type: 'line',
		yAxisIndex: 1,
		data: [21.2,14.6,9.5,6.8,5.3,42.7]
	}]
};
myChart.setOption(option);