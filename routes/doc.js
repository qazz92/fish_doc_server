var express = require('express');
var router = express.Router();
var dao = require('../controller/dao');
var r = require('rethinkdbdash')({servers: [{host: 'localhost', port: 28015, db:'fish'}]});
var bodyParser = require('body-parser');

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });



/* GET home page. */
router.get('/', function(req, res, next) {
       r.table('fish_info').orderBy('fish_id').run().then(function(result) {
  	//console.log(result);
	res.json(result);
});
});

router.post('/new',function(req, res, next) {
    req.accepts('Content-Type', 'application/json');
    var data = {
	'fish_id':req.body.fish_id,
	'doc':req.body.doc
	};
    	console.log(data);
   	r.table('fish_info').insert(data).run().then(function(result) {
        console.log(result);
        res.json(result);
	});
});
router.post('/:id/edit', jsonParser ,function(req, res, next) {
    req.accepts('Content-Type', 'application/json');
    res.set('Content-Type', 'application/json');
    var fish_id = req.params.id;
    var data = {
        'doc': req.body.doc
    };
        console.log(data);
        r.table("fish_info").get(fish_id).update(data).run().then(function(result) {
        console.log(result);
        res.json(result);
        });

});
module.exports = router;
