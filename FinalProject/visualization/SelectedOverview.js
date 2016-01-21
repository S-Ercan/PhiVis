$(document).ready(function () {
	var selectedOverview = $('#selectedOverview').jtable({
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
		},
		messages: {noDataAvailable: "No diseases selected"}
	});
});
