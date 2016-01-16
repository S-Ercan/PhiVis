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
	var selectedDiseases = [];

	for (var i = 0; i < phi.length; i++) {
		selectedDiseases.push({id: phi[i].Identifier, name: phi[i].Disease});
	}
	console.log(selectedDiseases);

	$(function()
	{
		var ms1 = $('#overview').magicSuggest({
		  data: selectedDiseases,
		  placeholder: 'Diseases...'
		});
	});

});

function forceGraph() {


}

function stackBars() {

}
