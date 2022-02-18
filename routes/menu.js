var express = require('express');
var router = express.Router();
const db = require('../db/mysql')
const path = require("path")
const {urlencoded, request} = require("express");


//카테고리 페이지 첫화면
router.post('/categories', async function (req , res) {

    //조인문 쿼리
    let joinquery =  "select * from categories as a right outer join subcategories b on a.ctnum = b.ctnum"

    //카테고리와 서브카테고리 조인문
    let [rows, joinfields] = await db.query(joinquery);

    console.log(rows)
    res.status(200).json(rows)
})




module.exports = router;