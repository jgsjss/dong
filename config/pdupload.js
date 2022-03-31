const multer = require('multer')
const path = require("path");
const fs = require("fs");
const {originalMaxAge} = require("express-session/session/cookie");
const cookies = require("lodash");

//메뉴등록시 이미지 처리 뮬터


//이미지파일 저장경로, 경로에 폴더가 없을경우 자동 생성
const imageDir = 'uploads/pdimage/'
// +req.body.data.shopcode;

// !fs.existsSync(imageDir)&&fs.mkdirSync(imageDir);
//경로가 이미 존재한다면 콘솔창에 메시지 출력
fs.mkdir(imageDir, err => {
    if(err&&err.code !="EEXIST") throw"up"
    console.log("제품 이미지 디렉토리가 이미 존재합니다!")
})

const pdupload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            // console.log("req ========>",req)
            // shopcode에 따른 저장경로 분배
            // console.log("shopcode : ", req.body.shopcode);
            // console.log("haeder : ", req.headers.shopcode);
            // console.log("mul shopcode : ", req.body.shopcode);
            // console.log("mul pdname : ", req.body.pdname);
            // console.log( typeof req.body.pdname);
            // console.log(done)
            done(null, imageDir);
        }, filename(req, file, done) {
            const shopcode  = req.header('shopcode');
            // const pdname1  = req.body.data.pdname;
            const pdname2 = req.header('pdname')
            // const pdname3 = req.headers('pdname')
            console.log("뮬터에서 뽑은 샵코드 : ", shopcode )
            // console.log("뮬터에서 뽑은 pdname1 : ", pdname1 )
            console.log("뮬터에서 뽑은 pdname2 : ", pdname2 )
            // console.log("뮬터에서 뽑은 pdname3 : ", pdname3 )
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
            // const filename = path.basename(shopcode + '_' + file.originalname );
            console.log("BE ",pdname2)
            const filename = path.basename(shopcode + '_' + pdname2+ext );
            // console.log("filename : " + filename)
            done(null, filename);
        },
    }),
})

module.exports = {pdupload}