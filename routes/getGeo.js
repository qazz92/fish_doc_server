var express = require('express');
var router = express.Router();
var request = require('request');
var urlencode = require('urlencode');
var dao = require('../controller/dao');

router.get('/:sido', function(req, res, next) {
  var sido = req.params.sido.trim();
  dao.conn.query('SELECT sido_kr from sido', function(err, rows, fields) {
      if (!err) {
        //var url = 'http://maps.google.com/maps/api/geocode/json?address='+urlencode(rows[i].sido_kr)+'&language=ko&sensor=false';
            request.get({url: 'http://maps.google.com/maps/api/geocode/json?address='+urlencode(sido)+'&language=ko&sensor=false'}, function(err, response, body){
                  var getGeocodeJSON = JSON.parse(body);
                  var wido = getGeocodeJSON.results[0].geometry["location"].lat;
                  var kydo = getGeocodeJSON.results[0].geometry["location"].lng;
                  //console.log("위도 :"+wido+"  경도 : "+kydo);
                  res.send("위도 : "+wido+"\n"+"경도 : "+kydo);
            });
      } else {
          console.log('Error while performing Query.');
      }
  });
});

module.exports = router;

