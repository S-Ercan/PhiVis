$("#stackBarsButton").click(function() {
	var rows = $('#selectedOverview').find('.jtable-data-row')
	var selectedDiseases = {};
	var diseaseName;
	$.each(rows, function() {
		diseaseName = $(this).attr('data-record-key');
		selectedDiseases[diseaseName] = diseases[diseaseName];
	});
	stackBars(selectedDiseases);
});

function loadJSON(callback)
{
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', 'phi.json', true);
	xobj.onreadystatechange = function ()
	{
		if (xobj.readyState == 4 && xobj.status == "200")
			callback(xobj.responseText);
	};
	xobj.send(null);
}

var diseases = {};
loadJSON(function(response)
{
	var phi = JSON.parse(response);
	var disease;
	for (var i = 0; i < phi.length; i++) {
		disease = phi[i].Disease;
		gene = phi[i].Gene;
		if (disease in diseases) {
			diseases[disease].push(phi[i]);
		}
		else {
			diseases[disease] = [phi[i]];
		}
	}

	$(function()
	{
		var ms = $('#overview').magicSuggest({
			allowFreeEntries: false,
			data: Object.keys(diseases),
			placeholder: 'Diseases...'
		});

		$(ms).on('selectionchange', function(e, m, records) {
			if(records.length > 0)
			{
				addDisease(records[0]);
				ms.setSelection([]);	
			}
		});
	});
});

function addDisease(disease)
{
	$('#selectedOverview').jtable('addRecord', {
		record: {
			DiseaseId: disease.id, Disease: disease.name
		},
		clientOnly: true
	});
}

var svg;
function stackBars(diseases) {
	// Adapted from http://bl.ocks.org/mbostock/3886208
	var data = [];
	var diseaseList = [];
	var genes = [];
	for (var key in diseases) {
		var diseaseObject = {};
		for (var i in diseases[key])
		{
			var disease = diseases[key][i];
			var geneName = disease.Gene;
			diseaseObject.Disease = disease.Disease;

			if (!(geneName in diseaseObject))
			{
				diseaseObject[geneName] = 0;
			}
			diseaseObject[geneName] = diseaseObject[geneName] + 1;

			genes.push(geneName);
		}
		data.push(diseaseObject);
	}
	genes = genes.sort().filter(function(item, index, array) {
		return !index || item != array[index - 1];
	});

	var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 900 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
		.rangeRound([height, 0]);

	var color = d3.scale.ordinal()
		.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format(".2s"));
		
	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([25, 0])
		.html(function(d) {
			return "<strong>Gene:</strong> <span style='color:red'>" + d.gene + "</span>";
		});

	if (svg)
	{
		d3.select('#graphViz').selectAll('*').remove();
	}
	svg = d3.select("#graphViz").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.call(tip);

	color.domain(genes);

	data.forEach(function(d) {
		var y0 = 0;
		d.genes = color.domain().map(function(gene) {
			return {gene: gene, y0: y0, y1: y0 += +d[gene] ? +d[gene] : 0};
		});
		d.total = d.genes[d.genes.length - 1].y1;
	});

	data.sort(function(a, b) { return b.total - a.total; });

	x.domain(data.map(function(d) { return d.Disease; }));
	y.domain([0, d3.max(data, function(d) { return d.total; })]);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
	.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Population");

	var state = svg.selectAll(".state")
		.data(data)
		.enter().append("g")
		.attr("class", "g")
		.attr("transform", function(d) { return "translate(" + x(d.Disease) + ", 0)"; });

	state.selectAll("rect")
		.data(function(d) { return d.genes; })
		.enter().append("rect")
		.attr("width", x.rangeBand())
		.attr("y", function(d) { return y(d.y1); })
		.attr("height", function(d) { return y(d.y0) - y(d.y1); })
		.style("fill", function(d) { return color(d.gene); })
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

	var legend = svg.selectAll(".legend")
		.data(color.domain().slice().reverse())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
		.attr("x", width - 18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", color);

	legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; });
}

function forceGraph() {

}
