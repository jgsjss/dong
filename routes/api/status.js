const _ = require("lodash");
var express = require('express');
var router = express.Router();
const {urlencoded, request} = require("express");
const db = require('../../db/mysql');


router.get('/check', function (req, res, next) {
    console.log("serv checked")
    res.sendStatus(200);

});

module.exports = router;