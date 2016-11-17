/*! DataTables Bootstrap 3 integration
 * ©2011-2015 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 3. This requires Bootstrap 3 and
 * DataTables 1.10 or newer.
 * for further information.  
 
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
	    define(['jquery', 'datatables.net', 'vendors/bootstrap-multiselect'], function ($) {
			return factory( $, window, document );
		} );
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;

var DTMultiSelectColumnApi = function (instance, column, index) {
    this.instance = instance;
    this.index = index;
    this.column = column;
    this.isChanging = false;
    this.seachList = [""];
    this._constructor();
    this.search = function () {
        var val = this._getSearchText();
		if(val == "" || val == null){
			DTMultiSelectColumnApi.last = null;
		}else{
			DTMultiSelectColumnApi.last = this;
		}
		
        this.column
                   .search(val, true, false)
                   .draw();
        
        return val;
    };
    this.update = function () {
        this._update();
    };
};
DTMultiSelectColumnApi.last = null;
DTMultiSelectColumnApi.prototype = { 
	
    _constructor: function () {
        var self = this; 
        this.instance.multiselect({ 
            onDropdownShow: function () {
                //self.isChanging = true;  
            }, 
            onDropdownHidden: function () { 
                //self.isChanging = false;
                //self._update();
            }
        });
        this.instance.on('change', function () {
                this.search();
            }.bind(this) 
        );
    }, 
	// Build a regular expresion from multiple selection in order to filter multiple rows.
    _getSearchText: function () {
        var arr = this._getSearchList();
        var val = "";
        if (arr != null) {
            
            for (var i = 0; i < arr.length; i++) {
                arr[i] = $.fn.dataTable.util.escapeRegex(
                    arr[i]
                );
                arr[i] = arr[i] != "" ? "(" + arr[i] + ")" : "";
            }
            val = arr.join("|");
        } else {
        }
        return val;
    },
    _getSearchList: function(){
        return this.instance.val();
    },
    _update: function () {
        var self = this;
        if(DTMultiSelectColumnApi.last == this){return;}
        var component = this.instance;
        component.empty();
		// Build an array from the search text applied to the column.
		// 
        var selected = this.column.search().split("|").map(function (value) {
			// Remove \ symbol added by escape.
            var _re_escape_regex = /\\/gi;
            value = value.replace(_re_escape_regex, '');
            return value.replace(/\((.*)\)/g, "$1");
        });
		// For each unique value we create an option for the filter component.
        this.column
            .data()
            .unique()
            .each(function (value) {
                if (value == "") { return; }
                var index = selected.indexOf(value.toString());
                var sel = index != -1 ? "selected" : "";
                component.append('<option value="' + value + '" ' + sel + '>' + value + '</option>');
                if(index != -1){
                    selected.splice(index, 1);
                }
                
            });
		// In case of filtered values are not in the column data we should add those options to able to the user unselect it.
        $.each(selected, function (i, value) {
            if(value != ""){
                component.append('<option value="' + value + '" selected>' + value + '</option>');
            }
            
        });
        component.multiselect('rebuild');
    }
};

var DTMultiSelectApi = function (settings) {
    // Sanity check that we are using DataTables 1.10 or newer
    if (!DataTable.versionCheck || !DataTable.versionCheck('1.10.1')) {
        throw 'DataTables MutiSelect requires DataTables 1.10.1 or newer';
    }

    this.s = {
        dt: new $.fn.dataTable.Api(settings),
        columns: []
    };

    settings.multiSelectApi = this;
    this._constructor();
};
DTMultiSelectApi.prototype = {

    _constructor: function () {
        var self = this;
		// This is the Id of the TABLE. We need to identify it.
		self.sInstance = self.s.dt.context[0].sInstance;
		// MultiSelect components.
        self.components = {};
		
        self._init();
   
        this.s.dt.on('draw.dt', function (e, settings) {
            // Detect changes in datasource for redraw.
            if (self.s.recordsDisplay != settings.fnRecordsDisplay()) {
                //console.log("draw.dt");
                self._draw();
            }
            self.s.recordsDisplay = settings.fnRecordsDisplay();
        });
		self._draw();  
    },
    _init: function () {
        var self = this;
        this.s.recordsDisplay = 0;
        this.s.dt.columns().eq(0).each(function (item, index) {
            var comp = $('#'+self.sInstance+'-quick-filter-' + index);
            if (comp.length > 0) {
                self.components[index] = new DTMultiSelectColumnApi(comp,
                    self.s.dt.column(index, { "filter": "applied" }),
                    index);
            }
        });
    },
    _draw: function (){
        this._updateComponents();
    },
    _updateComponents:function (){
        for (var key in this.components) {
			this.components[key].update();
        }
    },
   
};

$(document).on('init.dt.dtr', function (e, settings, json) {
    new DTMultiSelectApi(settings); 
});

return DTMultiSelectApi;
}));