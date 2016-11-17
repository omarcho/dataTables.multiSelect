"use strict";
/**
This tests build components with minimun parameters and checks
that don't trows errors
*/
describe("DataTables.multiSelect default tests", function () {
    var chart;
  

	
    beforeEach(function () {
        $("body")
			.append($('<select id="quick-filter-0" multiple class="form-control" size="1" data-enable-filtering="true" data-button-class="btn btn-sm btn-default" data-placeholder="Name" style="display:none"></select>'));
		var dom = $("body").append($("<table id='maintable'></table>"));
    });

    afterEach(function () {});

    it("default values", function () {

       var dt = $('#maintable').DataTable( {
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
        expect(dt).not.toBe(null);
    });

    
});