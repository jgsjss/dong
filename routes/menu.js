var express = require('express');
var router = express.Router();
const db = require('../db/mysql')
const path = require("path")
const {urlencoded, request} = require("express");
const _ = require("lodash");
const {pdupload} = require("../config/pdupload")
const sharp = require("sharp")
const fs = require("fs")
const {readdirSync} = require("fs");


router.post('/menucategory', async function (req, res) {

    let shopcodereq = req.body.data.shopcode

    let [rows, fields] = await db.query('select * from paycoq.categories where shopcode = ?', shopcodereq)
    // console.log(rows)

    res.status(200).json({rows: rows})
})


//카테고리 페이지 첫화면 페이징처리
router.post('/categories', async function (req, res) {

    let curpage = req.body.data.curpage
    let shopcode = req.body.data.shopcode
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
        shopcode,
        (curpage - 1) * Number(pageSize),
        Number(pageSize)
    ]
    // console.log(result[0])
    // console.log(result[1])
    //조인문 쿼리

    let cateNpd = "select * from categories as c cross join products as p on c.ctnum = p.ctnum where c.shopcode=? order by p.pdnum asc limit ?,?"

    // 게시물 갯수
    let articleLengthQuery = "select * from categories as c right outer join products p on c.ctnum = p.ctnum where c.shopcode=? order by p.pdnum asc"

    let [articleLengthBefore] = await db.query(articleLengthQuery, shopcode)
    let ActualArticleLength = Math.ceil(articleLengthBefore.length / 10)
    console.log("카테고리 리스트 갯수 : ", ActualArticleLength)
    // 게시물 갯수
    //카테고리와 서브카테고리 조인문
    let [rows, joinfields] = await db.query(cateNpd, result);

    let articles = {rows: rows, length: ActualArticleLength}
    // console.log(rows)
    res.status(200).json(articles)
})

router.post('/addcategory', async function (req, res) {
    let ctvalues = new Array()
    _.map(req.body, (value, key, collection) => {
        ctvalues.push(value)
        console.log("키", key)
        console.log("벨류", value)
        console.log("콜렉션", collection)
    })
    // console.log(ctvalues)
    let insertquery = "insert into paycoq.categories values(null, ?,?,?,?)"
    let [rows, ctfields] = await db.query(insertquery, ctvalues)
    res.status(200).json(rows)

})

router.post('/menus', async function (req, res) {
    let curpage = req.body.data.curpage
    let shopcode = req.body.data.shopcode
    let pageSize = 5;

    console.log(curpage)
    console.log(shopcode)
    const DEFAULT_START_PAGE = 1;
    const DEFAULT_PAGE_SIZE = 5;

    if (!curpage || curpage <= 0) {
        curpage = DEFAULT_START_PAGE
    }
    if (!pageSize || pageSize <= 0) {
        pageSize = DEFAULT_PAGE_SIZE
    }
    //offset,limit
    let result = [
        shopcode,
        (curpage - 1) * Number(pageSize),
        Number(pageSize)
    ]
    // console.log(result[0])
    // console.log(result[1])
    //조인문 쿼리

    let cateNpd = "select * from categories as c cross join products as p on c.ctnum = p.ctnum where c.shopcode=? order by p.pdnum asc limit ?,?"

    // 게시물 갯수
    let articleLengthQuery = "select * from categories as c right outer join products p on c.ctnum = p.ctnum where c.shopcode=? order by p.pdnum asc"


    let [articleLengthBefore] = await db.query(articleLengthQuery, shopcode)
    let ActualArticleLength = Math.ceil(articleLengthBefore.length / 5)
    console.log("메뉴 리스트 갯수 : ", ActualArticleLength)
    // 게시물 갯수
    //카테고리와 프로덕츠 조인문
    let [rows, joinfields] = await db.query(cateNpd, result);

    let articles = {rows: rows, length: ActualArticleLength}
    // console.log(rows)
    res.status(200).json(articles)
})

router.post("/pdupload", pdupload.single("image"), function (req, res) {
    // const usercookie = req.body.shopcode
    // console.log("usercookie: ", usercookie)
    // console.log("req.body.shopcode: ", req.body.shopcode)
    try {
        sharp(req.file.path) //압축할 이미지 경로
            .resize({width: 300}) //비율을 유지하며 가로 크기 줄이기(반응형)
            .withMetadata()  //이미지의 exif 데이터 유지
            .toBuffer((err, buffer) => {
                if (err) throw err;
                //압축된 파일 새로 저장(덮어씌우기)
                fs.writeFile(req.file.path, buffer, (err) => {
                    if (err) throw err;
                })
            })
    } catch (err) {
        console.log("err", err)
    }
    res.status(200).json(1)
})

router.post("/addMenu", async function (req, res) {
    let products = new Array()

    console.log("BE addmenu go")
    //req.body.data 까지 해야함, 프론트에서 data에 json으로 감싸서 보내기때문
    _.map(req.body.data, (value, key, collection) => {
        products.push(value)
        // console.log("키", key)
        // console.log("벨류", value)
        // console.log("콜렉션", collection)
    })

    let insertquery = "insert into paycoq.products value(null, ?, ?, ?, ?, ?, null, null,?, ?)"
    let [rows, fields] = await db.query(insertquery, products)

    res.status(200).json(rows)
})

router.get("/join", async function (req, res, next) {

})
router.get("/pdimage", async function (req, res, next) {
    // const pdimage = require("../uploads/pdimage")
    // const url=req.query.pdnum
    let imgList = []
    let folder = "./uploads/pdimage"
    const files = fs.readdirSync(folder).forEach(file => {
        imgList.push(file)
        console.log(file)
    })

    res.status(200).json(imgList)
})


module.exports = router;