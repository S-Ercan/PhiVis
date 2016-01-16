$(document).ready(function () {
	var selectedOverview = $('#selectedOverview').jtable({
		title: 'Selected diseases',
		addRecordButton: {click: null},
		actions: {
			deleteAction: function(data) {
				$('#selectedOverview').jtable('deleteRecord', {
					key: data.DiseaseId,
					clientOnly: true
				});
			}
		},
		fields: {
			DiseaseId: {
				key: true,
				list: false
			},
			Disease: {
				title: 'Disease'
			}
		}
	});
	addDisease({DiseaseId: 1, Disease: 'X'});
});

function addDisease(disease)
{
	$('#selectedOverview').jtable('addRecord', {
		record: {
			DiseaseId: 1, Disease: 'X'
		},
		clientOnly: true
	});
}