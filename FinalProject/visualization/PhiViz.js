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
	console.log(diseases);

	//var diseaseNames = diseases.keys();
	$(function()
	{
		var ms1 = $('#overview').magicSuggest({
		  data: Object.keys(diseases),
		  placeholder: 'Diseases...'
		});

		$(ms1).on('selectionchange', function(e, m) {
			ms1.setSelection([]);
		});
	});

});

function forceGraph() {


}

function stackBars() {

}
