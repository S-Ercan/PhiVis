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

$("#forceGraphButton").click(function() {
	var rows = $('#selectedOverview').find('.jtable-data-row');
	var selectedDiseases = {};
	var diseaseName;
	$.each(rows, function() {
		diseaseName = $(this).attr('data-record-key');
		selectedDiseases[diseaseName] = diseases[diseaseName];
	});
	forceGraph(selectedDiseases);
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
var margin = {top: 40, right: 20, bottom: 200, left: 50},
	width = 900 - margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;
function stackBars(diseases) {
	// Adapted from http://bl.ocks.org/mbostock/3886208
	var data = [];
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
		d3.select('#graphVis').selectAll('*').remove();
	}
	svg = d3.select("#graphVis").append("svg")
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
		.attr("fill", "#e8e7e7")
		.call(xAxis)
        .selectAll("text")
            .style({"text-anchor": "end", "font-size": "0.95em"})
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)" );

	svg.append("g")
		.attr("class", "y axis")
		.attr("fill", "#e8e7e7")
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
		.attr("fill", "#e8e7e7")
        .style("font-size", "18px")
        .text("Gene distribution across diseases");

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
function forceGraph(diseases) {
	var nodes = [];
	var links = [];
	var phenotypes = {};
	var nodesIndex = -1;
	var lastDiseaseIndex = 0;
	
	var colors = {disease: "#de2b2b", unique: "#3d7de8", common: "#b16cf4", maxCommon: "#50e83d"};
	var nodeColor = "#383838";

	for (var key in diseases) {
		nodes.push({name: key, type: "disease"});
		nodesIndex += 1;
		lastDiseaseIndex = nodesIndex;
		for (var i in diseases[key])
		{
			var phenoName = diseases[key][i].MutantPhenotype;
			var phenoNode = nodes[phenotypes[phenoName]];
			if (phenoName in phenotypes) {
					links.push({"source": lastDiseaseIndex, "target": phenotypes[phenoName]});
					if (phenoNode.diseases.indexOf(key) == -1) {
						phenoNode.type = "commonPhenotype";
						phenoNode.diseases.push(key);
					}
			}
			else {
					nodes.push({name: phenoName, type: "uniquePhenotype", diseases: [key]});
					nodesIndex += 1;
					links.push({"source": lastDiseaseIndex, "target": nodesIndex});
					phenotypes[phenoName] = nodesIndex;
			}
		}
	}

	if (svg)
	{
		d3.select('#graphVis').selectAll('*').remove();
	}

	svg = d3.select("#graphVis").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("text")
        .attr("x", (width / 2))
        .attr("y", (margin.top / 2) - 35)
        .attr("text-anchor", "middle")
		.attr("fill", "#e8e7e7")
        .style("font-size", "18px")
        .text("Phenotype distribution across diseases");

	var force = d3.layout.force()
		.gravity(0.03)
		.distance(150)
		.charge(-150)
		.linkStrength(0.1)
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

	node.append("circle")
			.attr("r", function(d){
				if (d.type == "disease") {
					return 10;
				}
				else if (d.type == "uniquePhenotype" || d.type == "commonPhenotype") {
					return 5;
				}
			})
			.attr("fill", function(d){
				if (d.type == "disease"){
					return colors.disease;
				}
				else if (d.type == "uniquePhenotype"){
					return colors.unique;
				}
				else if (d.type == "commonPhenotype"){
					if (d.diseases.length == Object.keys(diseases).length) {
						return colors.maxCommon;
					}
					else {
						return colors.common;
					}
				}});

	node.append("text")
		.attr("dx", 12)
		.attr("dy", ".35em")
		.attr("fill", nodeColor)
		.text(function(d) {
			return d.name;
		});

	force.on("tick", function() {
		link.attr("x1", function(d) { return d.source.x; })
		  .attr("y1", function(d) { return d.source.y; })
		  .attr("x2", function(d) { return d.target.x; })
		  .attr("y2", function(d) { return d.target.y; });
		node.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
		});
	});

	var legendData = [
		{name: "Disease",  type: "disease"},
		{name: "Unique phenotype",  type: "unique"},
		{name: "Shared phenotype",  type: "common"},
		{name: "Maximally shared phenotype",  type: "maxCommon"}
	];

	var legend = svg.append("g")
		.selectAll("g")
		.data(legendData)
		.enter()
		.append('g')
		.attr('class', 'legend')
		.attr('transform', function(d, i) {
			var x = 0;
			var y = (i + 1) * 20;
			return 'translate(' + x + ',' + y + ')';
		});

	legend.append('circle')
		.attr('r', 5)
		.style('fill', function(d){
			return colors[d.type];
		})
		.style('stroke', 'black');

	legend.append('text')
		.attr('x', 10)
		.attr('y', 5)
		.attr("fill", nodeColor)
		.text(function(d) {return d.name; });
}
