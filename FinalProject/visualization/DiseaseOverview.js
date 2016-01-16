// Populates dropdown with data
function populateOverview(options)
{
	var dropDown = document.getElementsByName('diseaseOverview')[0];

	for(var i = 0; i < options.length; i++)
	{
		var opt = options[i];
		var optionElement = document.createElement(opt);
		optionElement.textContent = opt;
		optionElement.value = opt;
		dropDown.appendChild(optionElement);
	}
}

// Handles clicks on diseases
function selectDisease(disease)
{
	
}