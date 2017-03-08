var myChart = echarts.init(document.getElementById("main"));
myChart.showLoading();

ajax({
	url: '../../echarts_data/Books about US politics.gexf',
	type: "GET",
	dataType: "gexf",
	success: function(response,xml){
		var graph = echarts.dataTool.gexf.parse(response);
		var categories = [];

		categories[0] = {
			name: 'liberal',
			icon: 'circle'
		};
		categories[1] = {
			name: 'neutral',
			icon: 'roundRect'
		};
		categories[2] = {
			name: 'conservative',
			icon: 'rect'
		};

		graph.nodes.forEach(function (node){
			node.itemStyle = null;
			node.symbolSize = 20;

			switch(node.attributes.value){		// 根据数据标记分类
				case 'l':
					node.category = 0;
					node.value = 'liberal';
					node.symbol = 'circle';
					break;
				case 'n':
					node.category = 1;
					node.value = 'neutral';
					node.symbol = 'roundRect';
					break;
				case 'c':
					node.category = 2;
					node.value = 'conservative';
					node.symbol = 'rect';
					break;
				default:
					node.category = 3;	// others
			}

			node.draggable = true;	// 节点可拖拽
		});

		buildChart(graph,categories);
	},
	fail: function(status) {
		console.log(status);
		return false;
	}
});

function buildChart(graph,categories){
	option = {
		title: {
			text: 'Books about US politics',
			top: '5%',
			left: '5%'
		},
		tooltip: {
			formatter: '{b}</br>political complexion: {c}'
		},
		legend: [{
			data: categories,
			top: '5%',
			right: '5%'
		}],
		series: [
			{
				name: 'Books about US politics',
				type: 'graph',
				layout: 'force',
				data: graph.nodes,
				links: graph.links,
				categories: categories,
				roam: true,	// 鼠标缩放和平移漫游
				label: {
					emphasis: {
						show: false
					},
					normal: {
						show: false
					}
				},
				force: {
					repulsion: 500	// 节点间斥力因子
				}
			}
		],
		color: ['#0099CC','#9966CC','#CC3300']
	};
	myChart.hideLoading();
	myChart.setOption(option);
}