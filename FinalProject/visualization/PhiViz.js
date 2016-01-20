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

loadJSON(function(response)
{
	var phi = JSON.parse(response);
	var diseases = {};

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
	$('#selectedOverview').jtable('addRecord', {
		record: {
			DiseaseId: disease.id, Disease: disease.name
		},
		clientOnly: true
	});
}

function forceGraph() {


}

function stackBars() {

}
