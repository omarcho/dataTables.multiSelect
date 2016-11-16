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
        this.searchList = this._getSearchList();
        this.column
                   .search(val, true, false)
                   .draw();
        
        return val;
    };
    this.update = function () {
        this._update();
    };
};

DTMultiSelectColumnApi.prototype = {
    _constructor: function () {
        var self = this;
        this.instance.multiselect({
            onDropdownShow: function () {
                self.isChanging = true;
            },
            onDropdownHidden: function () {
                self.isChanging = false;
                self._update();
            },
            //enableFiltering: true, __buttonWidth: '190px'
        });
        this.instance.on('change', function () {
                this.search();
            }.bind(this)
        );
    },
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
        if(this.isChanging){return;}
        var component = this.instance;
        component.empty();
        var selected = this.column.search().split("|").map(function (value) {
            //var tmp = $.fn.dataTable.util.escapeRegex(value);
            var _re_escape_regex = /\\/gi;
            value = value.replace(_re_escape_regex, '');
            return value.replace(/\((.*)\)/g, "$1");
        });
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

        self.components = {};
        //this.s.dt.on('init.dt', function (e, settings, json) {
        //    console.log("init");
            self._init();
        //});
        this.s.dt.on('draw.dt', function (e, settings) {
            
            if (self.s.recordsDisplay != settings.fnRecordsDisplay()) {
                //console.log("draw.dt");
                self._draw();
            }
            self.s.recordsDisplay = settings.fnRecordsDisplay();
        });
       
    },
    _init: function () {
        var self = this;
        this.s.recordsDisplay = 0;
        this.s.dt.columns().eq(0).each(function (item, index) {
            var comp = $('#quick-filter-' + index);
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