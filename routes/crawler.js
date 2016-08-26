var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var dao = require('../controller/dao');

/* GET home page. */
router.get('/:cido/:month', function(req, res, next) {
  var cido = req.params.cido.trim();
  var month = req.params.month.trim();
request.get({url: 'http://www.khoa.go.kr/info/tide/'+cido+'/'+month+'.htm'}, function(err, response, body){

  var $ = cheerio.load(body);
  var jsonTable = [];
  var height = [];
  $('#tifo_pop_list').children('tbody').children('tr').each(function(i, elem) {
         var data = $('th.date', this).text();
         height[i] = $('td.height', this).text().trim().split("\r\n");
         var moonCa = $('td.luna', this).text();
         jsonTable[i] = {"data":data.trim(),"height":height[i],"luna":moonCa.trim()};
  });
      res.json(jsonTable);
});
});
router.get('/getCido', function(req, res, next) {
    dao.conn.query('SELECT * from sido order by sido_kr', function(err, rows, fields) {
        if (!err) {
            console.log('The solution is: ', rows);
            res.set('Content-Type', 'application/json');
            res.json(rows);
        } else {
            console.log('Error while performing Query.');
        }
    });
});
router.get('/sidoMoon/sidocode/:sido/:year/:month', function(req, res, next) {
  var sido_name = req.params.sido;
  var year = req.params.year;
  var month = req.params.month;
  console.log("RYU - 요청하신 시도 코드 : "+sido_name);
  dao.conn.query('SELECT sido_url from moon_sido WHERE sido_name = ?',[sido_name], function(err, rows, fields) {
        if (!err) {
            console.log('The solution is: ', rows);
              request.get({url: 'http://astro.kasi.re.kr/Life/Knowledge/sunmoon_map/sunmoon_popup.php?year='+year+'&month='+month+'&location='+rows[0].sido_url}, function(err, response, body){
                var $ = cheerio.load(body);
                var date = [];
                var jsonTable = [];
                $('table.graytable').children('tbody').children('tr').each(function(i, elem) {
                      var date = $('td',this).eq(0).text();
                      var moonRise = $('td',this).eq(5).text();
                      var moonIng = $('td',this).eq(6).text();
                      var moonSet = $('td',this).eq(7).text();
                      jsonTable[i] = {"date":date.trim(),"moonRise":moonRise,"moonIng":moonIng,"moonSet":moonSet};
                });
                    res.json(jsonTable);
              });
        } else {
            console.log('Error while performing Query.');
        }
    });
});
module.exports = router;
