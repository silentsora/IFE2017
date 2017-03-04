ajax({
	url: '../../map/ne_110m_admin_0_countries.json',
	type: "GET",
	dataType: "json",
	success: function(response,xml){
		echarts.registerMap('countries',response);
		var chart = echarts.init(document.getElementById("main"));
		chart.setOption({
			title: {
				text: 'Global Map',
				subtext: 'only show countries'
			},
			series: [{
				type: 'map',
				map: 'countries'
			}]
		})
	},
	fail: function(status) {
		alert(status);
	}
})