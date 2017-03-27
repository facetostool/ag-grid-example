var expect = require('chai').expect;
var _ = require('lodash');

var dao = require('../src/server/olympicWinnersDao');

describe("Bring back lots of results", function() {

    var countryCol = {field: 'country', headerName: 'Country'};
    var athleteCol = {field: 'athlete', headerName: 'Athlete'};

    var goldCol = {field: 'gold', headerName: 'Gold', aggFunc: 'sum'};

    var TOTAL_RECORD_COUNT = 8001;
    var TOTAL_RECORD_COUNT_FOR_UNITED_STATES = 1063;
    var TOTAL_ATHLETES_IN_UNITED_STATES = 844;
    var TOTAL_RECORDS_FOR_MICHAEL_PHELPS = 3;
    var COUNTRY_COUNT = 108;
    var TOTAL_GOLD_FOR_UNITED_STATES = 540;

    it("Top level, no aggregation", function(done) {

        var request = {
            groupKeys: [],
            pivotCols: [],
            rowGroupCols: [],
            valueCols: []
        };

        dao.list(request, callback);

        function callback(results) {
            expect(results.length).equals(TOTAL_RECORD_COUNT);
            done();
        };
    });

    it("groupKeys: [], rowGroupCols: ['country']", function(done) {

        var request = {
            groupKeys: [],
            pivotCols: [],
            rowGroupCols: [countryCol],
            valueCols: []
        };

        dao.list(request, callback);

        function callback(results) {
            expect(results.length).equals(COUNTRY_COUNT);
            done();
        };
    });

    it("groupKeys: [], rowGroupCols: ['country'], valueCols: [gold]", function(done) {

        var request = {
            groupKeys: [],
            pivotCols: [],
            rowGroupCols: [countryCol],
            valueCols: [goldCol]
        };

        dao.list(request, callback);

        function callback(results) {
            expect(results.length).equals(COUNTRY_COUNT);

            var unitedStatesGroup = _.find(results, {country: 'United States'});
            expect(unitedStatesGroup.gold).equals(TOTAL_GOLD_FOR_UNITED_STATES);

            done();
        };
    });

    it("groupKeys: ['United States'], rowGroupCols: ['country']", function(done) {

        var request = {
            groupKeys: ['United States'],
            pivotCols: [],
            rowGroupCols: [countryCol],
            valueCols: []
        };

        dao.list(request, callback);

        function callback(results) {
            expect(results.length).equals(TOTAL_RECORD_COUNT_FOR_UNITED_STATES);
            done();
        };
    });

    it("groupKeys: ['United States'], rowGroupCols: ['country','athlete']", function(done) {

        var request = {
            groupKeys: ['United States'],
            pivotCols: [],
            rowGroupCols: [countryCol, athleteCol],
            valueCols: []
        };

        dao.list(request, callback);

        function callback(results) {
            expect(results.length).equals(TOTAL_ATHLETES_IN_UNITED_STATES);
            done();
        };
    });

    it("groupKeys: [], rowGroupCols: ['country','athlete']", function(done) {

        var request = {
            groupKeys: [],
            pivotCols: [],
            rowGroupCols: [countryCol, athleteCol],
            valueCols: []
        };

        dao.list(request, callback);

        function callback(results) {
            expect(results.length).equals(COUNTRY_COUNT);
            done();
        };
    });

    it("groupKeys: ['United States', 'Michael Phelps'], rowGroupCols: ['country','athlete']", function(done) {

        var request = {
            groupKeys: ['United States', 'Michael Phelps'],
            pivotCols: [],
            rowGroupCols: [countryCol, athleteCol],
            valueCols: []
        };

        dao.list(request, callback);

        function callback(results) {
            expect(results.length).equals(TOTAL_RECORDS_FOR_MICHAEL_PHELPS);
            done();
        };
    });
});
