
var columnDefs = [
    {
        headerName: 'Promotion',
        children: [
            {
                headerName: "Promotion Id",
                field: "id",
                enableRowGroup: true,
                filter: 'number'
            },
            {
                headerName: "Anticipated payment method",
                field: "payment_method",
                enableRowGroup: true
            },
            {
                headerName: "DOCS_OK",
                field: "docs_ok",
                enableRowGroup: true,
                filter: 'boolean'
            },
            {
                headerName: "Created by user",
                field: "user",
                enableRowGroup: true
            },
        ]
    },
    {
        headerName: 'Rebate',
        children: [
            {
                headerName: "Rebate Id",
                field: "rebate_id",
                enableRowGroup: true
            },
            {
                headerName: "Rebate Type",
                field: "rebate_type",
                enableRowGroup: true
            },
        ]
    }
];

var gridOptions = {
    defaultColDef: {
        filter: 'text',
        filterParams: {
            newRowsAction: 'keep'
        },
        allowedAggFuncs: ['sum','min','max']
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
    httpRequest.open('GET', 'http://localhost:3001/api/v1/reports');
    // httpRequest.open('POST', './olympicWinners/');
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.send(requestForServer);
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var httpResponse = JSON.parse(httpRequest.responseText);
            params.successCallback(httpResponse.rows, httpResponse.lastRow);
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
