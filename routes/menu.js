var express = require('express');
var router = express.Router();
const db = require('../db/mysql')
const path = require("path")
const {urlencoded, request} = require("express");
const _ = require("lodash");


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
    console.log(result[0])
    console.log(result[1])
    //조인문 쿼리
    let joinquery = "select * from categories as a right outer join subcategories b on a.ctnum = b.ctnum order by b.catenum asc limit ?,?"

    //카테고리와 서브카테고리 조인문
    let [rows, joinfields] = await db.query(joinquery, result);

    // console.log(rows)
    res.status(200).json(rows)
})

router.post('/addcategory', async function(req, res){

    let ctvalues = new Array()
    _.map(req.body, (value, key, collection) => {
        ctvalues.push(value)
        console.log("키",key)
        console.log("벨류",value)
        console.log("콜렉션",collection)
    })

    // console.log(ctvalues)
    let insertquery = "insert into categories values(null, ?,?,?)"
    let [rows, ctfields] = await db.query(insertquery, ctvalues)
    res.status(200).json(rows)

})


module.exports = router;