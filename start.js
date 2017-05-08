var express = require('express');
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var olympicWinnersDao = require('./src/server/olympicWinnersDao');

app.post('/olympicWinners', function (req, res) {
    olympicWinnersDao.list(req.body, function(rows, lastRow) {
        res.json({
            rows: rows,
            lastRow: lastRow
        });
    });
});

app.use(express.static('public'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
