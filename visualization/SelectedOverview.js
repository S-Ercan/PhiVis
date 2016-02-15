/**
 * Grid containing a list of selected diseases.
 */
$(document).ready(function () {
	var selectedOverview = $('#selectedOverview').jtable({
		title: 'Selected diseases',
		// Don't show an 'Add record' button
		addRecordButton: {click: null},
		// Delete immediately on clicking the delete icon
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
