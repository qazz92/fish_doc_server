var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var dao = require('../controller/dao');

router.get('/:sido_name', function(req, res, next) {
    var sido_name = req.params.sido_name.trim();
    dao.conn.query('SELECT sido_code from weather_sido where sido_name = ?',sido_name, function(err, rows, fields) {
      var sido_code = rows[0].sido_code;
          var formData = {
              obsItem: 'ALL',
              obsSubItem: 'S_ALL',
              menuNo: '07',
              st_area: 'PUSA',
              s_name: sido_name,
              tsType: '0',
              tsId: sido_code
          };
          console.log("name is "+sido_name);
          console.log("code is "+sido_code);
          console.log("formData is "+formData);
          request.post({
              url: 'http://www.khoa.go.kr/koofs/kor/observation/obs_sub_all.do',
              formData: formData
          }, function(err, response, body) {
              var $ = cheerio.load(body);
              var result_head = {};
              var result_body = {};
              var jowi_detail = [];
              //console.log(body);
              console.log("conneting");
              $('div.rig_box3').each(function(i, elem) {
                var time_cw = $('div.all_time_txt',this).children('ul');
                var time = time_cw.children('li').eq(1).text().trim();
                var jowi_cw = $('div.rig_box3_1',this).children('ul');
                var jowi = jowi_cw.children('li').eq(1).text().trim();
                var jowi_dan = jowi_cw.children('li').eq(2).text().trim();
                var jowi_result = jowi+' '+jowi_dan;
                var jowi_detail_cw = $('div.rig_box3_4',this).children('ul');
                var jowi_detail_len = jowi_detail_cw.children('li').toArray().length;
                console.log(jowi_detail_len);
                for(var i=0;i<jowi_detail_len;i++){
                  var jowi_time = jowi_detail_cw.children('li').children('span.box3_4spanst01').eq(i).text().trim();
                  var jowi_detail_dan =  jowi_detail_cw.children('li').children('span.box3_4spanst02').eq(i).text().trim();
                  var jowi_label = jowi_detail_cw.children('li').children('img').eq(i).attr('alt');
                  jowi_detail[i] = jowi_time+','+jowi_label+','+jowi_detail_dan
                }
                  result_head = {'Time':time,"Jowi":jowi_result,"Jowi_detail":jowi_detail}
              });
              $('div.rig_box7').each(function(i, elem) {
                var info_len = $('div.rig_box8',this).children('ul').toArray().length;
                var info = [];
                var infoJson = {};
                for(var i=0;i<info_len;i++){
                  var info_title = $('div.rig_box8',this).children('ul').eq(i).children('li').eq(0).children('img').attr('title');
                  var info_contents = $('div.rig_box8',this).children('ul').eq(i).children('li').eq(2).children('span.box8_font10').text().trim();
                  info[i] = info_title+','+info_contents;
                }
                //var ssu = $('div.rig_box8',this).children('ul').children('li').children('span.box8_font10').text().trim();
                //console.log(info);
                result_body = info;
              });
              res.json({"section Jowi":result_head,"setction gen":{"info":result_body}});
          });
    });
});

module.exports = router;

