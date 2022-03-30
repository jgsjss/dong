const multer = require('multer')
const path = require("path");
const fs = require("fs");
const {originalMaxAge} = require("express-session/session/cookie");
const cookies = require("lodash");

//메뉴등록시 이미지 처리 뮬터


//이미지파일 저장경로, 경로에 폴더가 없을경우 자동 생성
const imageDir = 'uploads/pdimage/'
// +req.body.data.shopcode;
if (!fs.existsSync(imageDir)) {
    fs.mkdtempSync(imageDir)
}

const pdupload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            // console.log("req ========>",req)
            // shopcode에 따른 저장경로 분배
            // console.log("shopcode : ", req.body.shopcode);
            // console.log("haeder : ", req.headers.shopcode);
            console.log("mul shopcode : ", req.body.shopcode);
            console.log("mul pdname : ", req.body.pdname);
            console.log( typeof req.body.pdname);
            console.log(done)
            done(null, imageDir);
        }, filename(req, file, done) {
            const shopcode  = req.header('shopcode');
            console.log("뮬터에서 뽑은 샵코드 : ", shopcode )
            // shopcode = cookies.keys("shopCode")
            // for(let i = 0; i <= shopcode.length; i++ ){
            //     console.log("뮬터 안에서 쿠키불러온 후 뽑은 샵코드1: ",shopcode[i])
            // }
            // shopcode = cookies.keysIn("login")
            // for(let i = 0; i <= shopcode.length; i++ ){
            //     console.log("뮬터 안에서 쿠키불러온 후 뽑은 샵코드2: ",shopcode[i])
            // }
            // const pdname = req.body.pdname
            // const productcode = req.body.productcode
            // const nameset = shopcode + "-" + productcode
            // console.log("nameset ", shopcode)
            // done(null, shopcode);
            // for(let i = 0; i <= shopcode.length; i++ ){
            //     console.log("뮬터 안에서 쿠키불러온 후 뽑은 샵코드3: ",shopcode[i])
            // }
            const ext = path.extname(file.originalname);
            // const timestamp = new Date().getTime().valueOf();
            // console.log("ext : " + ext)
            // console.log("original : " + file.originalname)
            // done(null, file.originalname)
            const filename = path.basename(shopcode + '_' + file.originalname );
            // console.log("filename : " + filename)
            done(null, filename);
        },
    }),
})

module.exports = {pdupload}