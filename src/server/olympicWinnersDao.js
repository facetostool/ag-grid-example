var mysql = require('mysql');

var connection = mysql.createConnection({host: 'localhost', user: 'root', password: 'october'});

function OlympicWinnersDao() {}

OlympicWinnersDao.prototype.createSelectSql = function(rowGroupCols, valueCols, groupKeys) {
    if (this.isDoingGrouping(rowGroupCols, groupKeys)) {
        var colsToSelect = [];

        var rowGroupCol = rowGroupCols[groupKeys.length];
        colsToSelect.push(rowGroupCol.field);

        valueCols.forEach( function(valueCol) {
            colsToSelect.push(valueCol.aggFunc + '(' + valueCol.field + ') as ' + valueCol.field);
        });

        return ' select ' + colsToSelect.join(', ');
    } else {
        // select all columns
        return ' select *';
    }
};

OlympicWinnersDao.prototype.createFilterSql = function(key, item) {
    switch (item.filterType) {
        case 'text': return this.createTextFilterSql(key, item);
        case 'number': return this.createNumberFilterSql(key, item);
        default: console.log('unkonwn filter type: ' + item.filterType);
    }
};

OlympicWinnersDao.prototype.createNumberFilterSql = function(key, item) {
    switch (item.type) {
        case 'equals':
            return key + ' = '+ item.filter;
        case 'notEqual':
            return key + ' != '+ item.filter;
        case 'greaterThan':
            return key + ' > ' + item.filter;
        case 'greaterThanOrEqual':
            return key + ' >= ' + item.filter;
        case 'lessThan':
            return key + ' < ' + item.filter;
        case 'lessThanOrEqual':
            return key + ' <= ' + item.filter;
        case 'inRange':
            return '(' + key + ' >= ' + item.filter + ' and ' + key + ' <= ' + item.filterTo + ')';
        default:
            console.log('unknown number filter type: ' + item.type);
            return 'true';
    }
};

OlympicWinnersDao.prototype.createTextFilterSql = function(key, item) {
    switch (item.type) {
        case 'equals':
            return key + ' = "'+ item.filter +'"';
        case 'notEqual':
            return key + ' != "'+ item.filter +'"';
        case 'contains':
            return key + ' like "%'+ item.filter +'%"';
        case 'notContains':
            return key + ' not like "%'+ item.filter +'%"';
        case 'startsWith':
            return key + ' like "'+ item.filter +'%"';
        case 'endsWith':
            return key + ' like "%'+ item.filter +'"';
        default:
            console.log('unknown text filter type: ' + item.type);
            return 'true';
    }
};

OlympicWinnersDao.prototype.createWhereSql = function(rowGroupCols, groupKeys, filterModel) {
    var that = this;
    var whereParts = [];

    if (groupKeys.length > 0) {
        groupKeys.forEach(function (key, index) {
            var colName = rowGroupCols[index].field;
            whereParts.push(colName + ' = "' + key + '"')
        });
    }

    if (filterModel) {
        var keySet = Object.keys(filterModel);
        keySet.forEach( function(key) {
            var item = filterModel[key];
            whereParts.push(that.createFilterSql(key, item));
        });
    }

    if (whereParts.length>0) {
        return ' where ' + whereParts.join(' and ');
    } else {
        return '';
    }
};

OlympicWinnersDao.prototype.createGroupBySql = function(rowGroupCols, groupKeys) {
    if (this.isDoingGrouping(rowGroupCols, groupKeys)) {
        var colsToGroupBy = [];

        var rowGroupCol = rowGroupCols[groupKeys.length];
        colsToGroupBy.push(rowGroupCol.field);

        return ' group by ' + colsToGroupBy.join(', ');
    } else {
        // select all columns
        return '';
    }
};

OlympicWinnersDao.prototype.createOrderBySql = function(sortModel) {
    var sortParts = [];
    if (sortModel) {
        sortModel.forEach( function(item) {
            sortParts.push(item.colId + ' ' + item.sort);
        });
    }
    if (sortParts.length>0) {
        return ' order by ' + sortParts.join(', ');
    } else {
        return '';
    }
};

OlympicWinnersDao.prototype.isDoingGrouping = function(rowGroupCols, groupKeys) {
    // we are not doing grouping if at the lowest level. we are at the lowest level
    // if we are grouping by more columns than we have keys for (that means the user
    // has not expanded a lowest level group, OR we are not grouping at all).
    return rowGroupCols.length > groupKeys.length;
};

OlympicWinnersDao.prototype.list = function(request, resultsCallback) {

    var rowGroupCols = request.rowGroupCols;
    var groupKeys = request.groupKeys;
    var valueCols = request.valueCols;
    var filterModel = request.filterModel;
    var sortModel = request.sortModel;

    var selectSql = this.createSelectSql(rowGroupCols, valueCols, groupKeys);
    var groupBySql = this.createGroupBySql(rowGroupCols, groupKeys);
    var whereSql = this.createWhereSql(rowGroupCols, groupKeys, filterModel);
    var orderBySql = this.createOrderBySql(sortModel);

    var sql = selectSql + ' from sample_data.olympic_winners ' + whereSql + groupBySql + orderBySql;

    console.log('sql = ' + sql);

    connection.query(sql, function(error, results, fields) {
        resultsCallback(results);
    });

};

module.exports = new OlympicWinnersDao();
