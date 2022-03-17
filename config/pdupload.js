const multer = require('multer')
const path = require("path");
const fs = require("fs");
const {originalMaxAge} = require("express-session/session/cookie");

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
            // shopcode에 따른 저장경로 분배
            // console.log("shopcode : ", req.body.data.shopcode);
            // const shopcode = req.body.data.shopcode;
            done(null, imageDir);
            console.log(done)
        }, filename(req, file, done) {
            const shopcode = String(req.body.shopcode)
            // const productcode = req.body.productcode
            // const nameset = shopcode + "-" + productcode
            console.log("nameset ", shopcode)
            done(null, shopcode);
            const ext = path.extname(file.originalname);
            // const timestamp = new Date().getTime().valueOf();
            // console.log("ext : " + ext)
            // console.log("original : " + file.originalname)
            done(null, file.originalname)
            const filename = path.basename(shopcode, ext) + ext;
            // console.log("filename : " + filename)
            done(null, filename);
        },
    }),
})

module.exports = {pdupload}