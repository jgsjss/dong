var express = require('express');
var router = express.Router();
const {urlencoded, request} = require("express");
const db = require('../../db/mysql')
const {upload, fileFilter} = require('../../config/upload')
const fs = require("fs");
const _ = require("lodash");
const {forEach} = require("lodash");
const {stringify} = require("nodemon/lib/utils");
const path = require("path")
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

    let data = await db.query('select * from user').then((result) => {

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


    let insertSql = 'insert into user values (null,?,?,?,?,?,?,?,?,?,?,?,?,?,?,now(),0,null,null,0,?)'
    db.query(insertSql, myarr, function (err, rows, fields) {
        console.log("======================", err)
        console.log("======================", rows)
        if (err) {
            console.log(err)
            console.log(rows.usernum)
            res.status(401).json({result: 0})
        } else {
            // console.log(myMap)
            console.log(res)
            res.status(200).json({result: 1})
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
        console.log('result: ', result)
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

//가입 신청 취소
router.post('/deleteuser', async function (req, res) {
    let userid = req.body.userid
    let userpw = req.body.userpw
    console.log(userid)
    const sql = 'select * from user where userid=?'
    const deletesql = 'delete from user where userid=?'

    let data = db.query(sql, userid)
    console.log(data)
    await data.then(result => {
        // const useridResult = result[0][0].userid
        console.log('result: ', result[0][0])
        if (result[0][0] != null) {
            if (result[0][0].userpw == userpw) {
                console.log('result[0][0] : ', result[0][0].userpw)
                try {  //'uploads/image' + result[0][0].biznum
                    let biznum = stringify(result[0][0].biznum)
                    let pre = biznum.concat(".png")
                    let abspath = path.resolve("uploads", "image")
                    let target = abspath.concat("/" + pre)
                    fs.unlink(target, function (err) {
                        console.log((err))
                    })
                    db.query(deletesql, userid)
                } catch (err) {
                    console.log(err)
                }
                return res.json(1)
            } else {
                //비밀번호가 틀림
                return res.json(0)
            }
        } else {
            // console.log("탐색되지 않음")
            return res.json(0)
        }
    })
})

//사진삭제 테스트 메소드
router.post('/delPhoto', function (req, res) {
    let biznum = stringify(req.body.biznum)
    let pre = biznum.concat(".png")
    let abspath = path.resolve("uploads", "image")
    let target = abspath.concat("/" + pre)
    let isExist = fs.existsSync(abspath, pre)

    fs.unlink(target, function (err) {
        console.log(err)
    })
    // fs.readdir('../../uploads/image',function(err,filelist){ console.log(filelist); });

    console.log('path 주소 :', isExist)
    console.log('abs 주소 :', abspath)
    // console.log('직접 지정 :',"/uploads/image/" + pre)
    // console.log('가공 :',pre)
    res.status(200).json(isExist)
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
