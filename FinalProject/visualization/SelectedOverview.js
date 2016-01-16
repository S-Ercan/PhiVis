$(document).ready(function () {
	$('#selectedOverview').jtable({
		title: 'Selected diseases',
		actions: {
			listAction: '/GettingStarted/PersonList',
			createAction: '/GettingStarted/CreatePerson',
			updateAction: '/GettingStarted/UpdatePerson',
			deleteAction: '/GettingStarted/DeletePerson'
		},
		fields: {
			PersonId: {
				key: true,
				list: false
			},
			Name: {
				title: 'Disease',
				width: '40%'
			}
		}
	});
});