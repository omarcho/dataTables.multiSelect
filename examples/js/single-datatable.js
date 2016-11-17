$(document).ready(function() {


    $('#maintable').DataTable( {
		iDisplayLength: 20,
		aaData: data,
		columns: [
            { title: "Name" },
            { title: "Position" },
            { title: "Office" },
            { title: "Extn." },
            { title: "Start date" },
            { title: "Salary" }
        ],
		ordering:true,
		//scrollY:'100%',
		//scrollX: true,
		//scrollCollapse:true,
		stateSave:true
	});
} );
