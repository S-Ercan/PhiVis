$("#stackBarsButton").click(function() {
	var rows = $('#selectedOverview').find('.jtable-data-row');
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
	 	phenotype= phi[i].MutantPhenotype;
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
	if(!$('#selectedOverview').jtable('getRowByKey', disease.id))
	{
		$('#selectedOverview').jtable('addRecord', {
			record: {
				DiseaseId: disease.id, Disease: disease.name
			},
			clientOnly: true
		});
	}
}

// ~~~~~~ Stack Bars ~~~~~~~
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
			genes.push(disease.Gene);
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

	var margin = {top: 40, right: 20, bottom: 200, left: 50},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], 0.1);

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
		.attr("height", 50)
		.call(xAxis)
        .selectAll("text")  
            .style({"text-anchor": "end", "font-size": "0.8em"})
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)" );

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Genes");
		
	svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", (margin.top / 2) - 35)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Genes by disease");

	var state = svg.selectAll(".gene")
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
}

// ~~~~~~ Force Graph ~~~~~~~
function forceGraph() {
	var width = 960,
	    height = 500;

	var nodes = [
    { x:   width/3, y: height/2, name: "Hi" },
    { x: 2*width/3, y: height/2, name: "Hello" }
	];

	var links = [
    { source: 0, target: 1 }
	];

	var svg = d3.select("#graphViz").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	var force = d3.layout.force()
			.gravity(0.05)
			.distance(100)
			.charge(-100)
			.size([width, height]);

	force
			.nodes(nodes)
			.links(links)
			.start();

	var link = svg.selectAll(".link")
	      .data(links)
	    	.enter().append("line")
	      .attr("class", "link");

	var node = svg.selectAll(".node")
	      .data(nodes)
	    	.enter().append("g")
	      .attr("class", "node")
	      .call(force.drag);

	node.append("image")
      .attr("xlink:href", "https://github.com/favicon.ico")
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 16)
      .attr("height", 16);

	node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });

	force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

		node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
			});
}
