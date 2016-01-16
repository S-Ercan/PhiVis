$(document).ready(function () {
	$('#selectedOverview').jtable({
		title: 'Selected diseases',
		addRecordButton: {click: null},
		deleteConfirmation: false,
		actions: {
			deleteAction: function(data) {
				$('#selectedOverview').jtable('deleteRecord', {
					key: data.DiseaseId,
					clientOnly: true
				});
				return {"Result": "OK"};
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
	addDisease({DiseaseId: 2, Disease: 'Y'});
	addDisease({DiseaseId: 3, Disease: 'Z'});
});

function addDisease(disease)
{
	$('#selectedOverview').jtable('addRecord', {
		record: {
			DiseaseId: disease.DiseaseId, Disease: disease.Disease
		},
		clientOnly: true
	});
}