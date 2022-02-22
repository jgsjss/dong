var express = require('express');
var router = express.Router();
const db = require('../db/mysql')
const path = require("path")
const {urlencoded, request} = require("express");


//카테고리 페이지 첫화면
router.post('/categories', async function (req, res) {

    let curpage = req.body.data.curpage
    let pageSize = 10;

    const DEFAULT_START_PAGE = 1;
    const DEFAULT_PAGE_SIZE = 10;

    if (!curpage || curpage <= 0) {
        curpage = DEFAULT_START_PAGE
    }
    if (!pageSize || pageSize <= 0) {
        pageSize = DEFAULT_PAGE_SIZE
    }

    //offset,limit
    let result = [
        (curpage - 1) * Number(pageSize),
        Number(pageSize)
    ]

    console.log(curpage)
    //조인문 쿼리
    let joinquery = "select * from categories as a right outer join subcategories b on a.ctnum = b.ctnum limit ?,?"

    //카테고리와 서브카테고리 조인문
    let [rows, joinfields] = await db.query(joinquery, result);

    console.log(rows)
    res.status(200).json(rows)
})


module.exports = router;