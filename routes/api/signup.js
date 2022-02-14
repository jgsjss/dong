var express = require('express');
var router = express.Router();
const {urlencoded, request} = require("express");
const db = require('../../db/mysql')
const upload = require('../../config/upload')
const fs = require("fs");
const _ = require("lodash");
const {forEach} = require("lodash");
// let sql = require('/db/sql')

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

// get방식의 경우 req.params.user 등과같이 사용
router.post('/signuptest', function (req, res) {
    let user = req.body.user
    res.json(user)
    console.log(user)
});

router.get('/get', function (req, res) {
    let get = req.query.user
    console.log(get)
    res.json(get)
});

router.post('/db', async function (req, res) {
   //  let [rows, fields] = db.query('select * from user')
   // forEach(rows,(res)=>{
   //     console.log(res)
   // })

    let data =await db.query('select * from user').then((result) => {

        console.log(result)
        res.json(result[0])
    })

})

router.post('/signup', function (req, res) {
    // let {managename, biznum} = req.body

    let myMap = new Map()

    let myarr = new Array()
    let showarr = new Array()
    _.map(req.body, (value, key, collection) => {
        // console.log(key, "-", value)
        myMap = collection
        myarr.push([value])
        showarr.push([key, value])
    })
    // console.log(myMap)
    // console.log(showarr)
    console.log(myarr)


    let insertSql = 'insert into user values (null,?,?,?,?,?,?,?,?,?,?,?,?,?,?,now(),0,?,null)'
     db.query(insertSql, myarr, function (err, rows, fields) {
         console.log("======================",err)
         console.log("======================",rows)
        if (err) {
            console.log(err)
            console.log(rows.usernum)
            res.status(401).json(0)
        } else {
            // console.log(myMap)
            console.log(res)
            res.status(200).json(1)

        }
    })

})
router.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file, req.body)
    // console.log("biznum =======> ", req.headers.biznum)
    res.send('ok')
})
//유저 id 탐색
router.post('/isuser', function (req, res) {
    let userid = req.body.userid
    console.log(userid)
    const sql = 'select userid from user where userid=?'

    let data = db.query(sql, userid)
    console.log(data)
    data.then(result => {
        // const useridResult = result[0][0].userid
        console.log('result: ',result)
        if (result[0][0] != null) {
            if (result[0][0].userid) {
                // console.log(result[0][0].userid)
                return res.json(1)
            }
            return res.json(0)
        } else {
            // console.log("탐색되지 않음")
            return res.json(0)
        }
    })
})

// router.get('/isuser', function (req, res) {
//     // let userid = req.body.userid
//     let userid = req.query.userid
//     // console.log(userid)
//     const sql = 'select userid from user where userid=?'
//     let data =db.query(sql, userid, function (err, results, fields) {
//
//
//         if (err){
//             console.log("에러임")
//         }else{
//             console.log("에러아님")
//             const useridResult = results
//         }
//
//             // console.log(useridResult)
//             // if (useridResult == userid) {
//             //     // console.log('동일함')
//             //     return res.json(1)
//             // } else {
//             //     // console.log("탐색되지 않음")
//             //     return res.json(0)
//             // }
//         }
//     )

router.post('/test', function (req, res) {
    let userid = req.body.userid
    console.log(userid)
    console.log(sql.signup.getAll)
    return res.json("test")
})

// router.post("/xxxx/:productId/:type/:filename", async function (req, res) {
//     let {productId, type, filename} = req.params
// })
//
// router.post('/api/:alias', async function (req, res) {
//     try {
//         res.send(await req.db(request.params.alias, request.body.param, request.body.where));
//     } catch (err) {
//         res.status(500).send({
//             error: err
//         })
//     }
// })

module.exports = router;
