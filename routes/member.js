const express = require('express')
const router = express.Router();
const {urlencoded, request} = require("express");
const jwt = require('jsonwebtoken');
const db = require('../db/mysql.js');
const auth = require('../config/auth.js');
const _ = require("lodash");
const {decoded} = require("jsonwebtoken");

router.post('/login', function (req, res, next) {
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    let myarr = new Array();
    sql = 'select * from user where userid = ?'
    data = db.query(sql, userid)
    data.then(async result => {
        if (result[0][0] != null) {
            let shopname = result[0][0].shopname;
            let shopphnum = result[0][0].shopphnum;
            let mgname = result[0][0].mgname;
            if (result[0][0].userpw == userpw) {
                // Access-Token
                let accessToken = '';
                let errorMessageAT = '';
                try {
                    accessToken = await new Promise((resolve, reject) => {
                        jwt.sign({
                                userid: result[0][0].userid,
                                userName: result[0][0].username
                            }, auth.secret,
                            {
                                expiresIn: '1h'
                            },
                            (err, token) => {
                                if (err) reject(err);
                                else resolve(token);
                            });
                    });
                    // res.json({success: true, accessToken: accessToken});
                } catch (err) {
                    errorMessageAT = err;
                }
                console.log("Access-Token : " + accessToken);
                console.log("Access-Token Error : " + errorMessageAT);
                //Refresh-Token
                let refreshToken = '';
                let errorMessageRT = '';
                try {
                    refreshToken = await new Promise((resolve, reject) => {
                        jwt.sign({
                                userid: result[0][0].userid,
                            },
                            auth.secret,
                            {
                                expiresIn: '1d',
                            },
                            (err, token) => {
                                if (err) reject(err);
                                else resolve(token);
                            });
                    });
                } catch (err) {
                    errorMessageRT = err;
                }
                console.log("Refresh-Token : " + refreshToken);
                console.log("Refresh-Token Error : " + errorMessageRT);

                if (errorMessageAT == '' && errorMessageRT == '') {
                    // let updateSql ='update user set refreshToken = ? where userid = "' + userid +'";'
                    let updateSql = 'update user set refreshToken = ? where userid=?'
                    let params = []
                    params.push(refreshToken, userid)
                    db.query(updateSql, params)
                    // result[0][0].refreshToken = refreshToken;
                    let mydata = { success: true, accessToken: accessToken, refreshToken: refreshToken, shopname: shopname, shopphnum: shopphnum, mgname: mgname  }
                    res.json(mydata);
                    console.log(mydata)
                } else {
                    res.status(401).json({success: false, errormessage: 'token sign fail'});
                }
            } else res.status(401).json({success: false, errormessage: 'ID와 비밀번호가 일치하지 않습니다.'})
        } else res.status(401).json({success: false, errormessage: '존재하지 않는 ID입니다.'})
    })
})

//토큰 재발급
router.post(' /refresh', function (req, res, next) {
    console.log("REST API Post Method - Member JWT Refresh");
    const userid = req.body.userid;
    const accessToken = req.body.accessToken;
    const refreshToken = req.body.refreshToken;

    sql = 'select * from user where userid = ?'
    data = db.query(sql, userid)

    data.then(async result => {
        if (result[0][0] != null) {
            //Refresh-Token verify
            let refreshPayload = '';
            let errorMessageRT = '';
            try {
                refreshPayload = await new Promise((resolve, reject) => {
                    jwt.verify(refreshToken, auth.secret,
                        (err, decoded) => {
                            if (err) reject(err);
                            else resolve(decoded);
                        });
                })
            } catch (err) {
                errorMessageRT = err;
            }
            "==================================="
            // 추후 사용자 정보 모두 조회 하여 사용? 대비
            // console.log("decoded = ", decoded)
            console.log(refreshPayload.userid)
            // userId 가 아니라 userid임
            const userInfoQuery = 'select * from user where userid=?'
            const userInfo = db.query(userInfoQuery, refreshPayload.userid)
            "==================================="
            console.log("Refresh-Token Payload : ", refreshPayload);
            console.log("Refresh-Token Verify : ", errorMessageRT);

            //Access-Token verify
            let accessPayload = '';
            let errorMessageAT = '';

            try {
                accessPayload = await new Promise((resolve, reject) => {
                    jwt.verify(accessToken, auth.secret, {ignoreExpiration: true},
                        (err, decoded) => {
                            if (err) reject(err)
                            else resolve(decoded)
                        });
                });
            } catch (err) {
                errorMessageAT = err;
            }
            console.log("Access-Token Payload : ");
            console.log(accessPayload);
            console.log("Access-Token Verify : " , errorMessageAT);

            if (errorMessageAT == "" && errorMessageRT == "") {
                if (userid == accessPayload.userid && userid == refreshPayload.userid && result[0][0].refreshToken == refreshToken) {
                    let accessToken = "";
                    errorMessageAT = "";

                    // Access-Token
                    try {
                        accessToken = await new Promise((resolve, reject) => {
                            jwt.sign({
                                    userid: result[0][0].userid,
                                    username: result[0][0].username
                                },
                                auth.secret,
                                {
                                    expiresIn: '10m'
                                },
                                (err, token) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(token);
                                    }
                                });
                        });
                    } catch (err) {
                        errorMessageAT = err;
                    }
                    console.log("Access-Token : " + accessToken);
                    console.log("Access-Token Error : " + errorMessageAT);

                    if (errorMessageAT == "") {
                        res.json({success: true, accessToken: accessToken});
                    } else {
                        res.status(401).json({success: false, errormessage: 'token sign fail'});
                    }
                } else {
                    res.status(401).json({success: false, errormessage: 'Token is not identical'});
                }
            } else if (errorMessageRT != "") {
                res.status(401).json({success: false, errormessage: 'Refresh-Token has expired or invalid signature'});
            } else if (errorMessageAT != "") {
                res.status(401).json({success: false, errormessage: 'Access-Token is invalid signature'});
            }
        } else {
            res.status(401).json({success: false, errormessage: '일치하는 회원정보가 없습니다.'});
        }
    })

})

module.exports = router;
