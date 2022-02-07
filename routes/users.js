var express = require('express');
var router = express.Router();
const {urlencoded} = require("express");

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

// get방식의 경우 req.params.user 등과같이 사용
router.post('/signup', function (req, res) {
    let user = req.body.user
    res.json(user)
    console.log(user)
});

router.get('/get', function (req, res) {
    let get = req.query.user
    console.log(get)
    console.log("asd")
    res.json(get)
});

// router.post('signin', function(req, res, next){
//     console.log('')
// })



module.exports = router;
