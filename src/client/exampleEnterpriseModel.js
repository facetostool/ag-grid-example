var agGrid = require('ag-grid');
require('ag-grid-enterprise');
require('ag-grid/dist/styles/ag-grid.css');
require('ag-grid/dist/styles/theme-fresh.css');

(function() {

    var columnDefs = [
        {
            headerName: 'Dimensions',
            children: [
                {headerName: "Athlete", field: "athlete", enableRowGroup: true},
                {headerName: "Age", field: "age", enableRowGroup: true, filter: 'number'},
                {headerName: "Country", field: "country", enableRowGroup: true},
                {headerName: "Year", field: "year", enableRowGroup: true},
                {headerName: "Sport", field: "sport", enableRowGroup: true}
            ]
        },
        {
            headerName: 'Values',
            children: [
                {headerName: "Gold", field: "gold", enableValue: true, aggFunc: 'sum'},
                {headerName: "Silver", field: "silver", enableValue: true, aggFunc: 'min'},
                {headerName: "Bronze", field: "bronze", enableValue: true,aggFunc: 'max'},
                {headerName: "Total", field: "total", enableValue: true}
            ]
        }
    ];

    var gridOptions = {
        defaultColDef: {
            filter: 'text',
            filterParams: {
                newRowsAction: 'keep'
            }
        },
        columnDefs: columnDefs,
        enableColResize: true,
        rowModelType: 'enterprise',
        rowGroupPanelShow: 'always',
        animateRows: true,
        showToolPanel: true,
        enableSorting: true,
        suppressDragLeaveHidesColumns: true,
        debug: true,
        onGridReady: function(params) {
            // params.api.sizeColumnsToFit();
        }
    };

    function EnterpriseDatasource() {}

    EnterpriseDatasource.prototype.getRows = function(params) {
        console.log('EnterpriseDatasource.getRows: params = ', params);

        var requestForServer = JSON.stringify(params.request);

        var httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', './olympicWinners/');
        httpRequest.setRequestHeader("Content-type", "application/json");
        httpRequest.send(requestForServer);
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var httpResponse = JSON.parse(httpRequest.responseText);
                params.successCallback(httpResponse);
            }
        };
    };

    // setup the grid after the page has finished loading
    document.addEventListener('DOMContentLoaded', function() {
        var gridDiv = document.querySelector('#myGrid');
        new agGrid.Grid(gridDiv, gridOptions);

        var datasource = new EnterpriseDatasource();
        gridOptions.api.setEnterpriseDatasource(datasource);
    });

})();