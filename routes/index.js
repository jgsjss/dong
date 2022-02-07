var express = require('express');
const {urlencoded} = require("express");
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/test', function (req, res) {
    let json = {성공하였음: "asd", 다음: "zxc"}
    res.json(json)
    console.log(json.다음)

})




module.exports = router;
