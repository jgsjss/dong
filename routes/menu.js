var express = require('express');
var router = express.Router();
const db = require('../db/mysql')
const path = require("path")
const {urlencoded, request} = require("express");


//카테고리 페이지 첫화면
router.post('/categories', async function (req, res) {
    let [rows, fields] = await db.query("select * from categories")
    console.log(rows)
    console.log(fields)
    res.status(200).json(rows)
})




module.exports = router;