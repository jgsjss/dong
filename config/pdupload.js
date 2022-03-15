const multer = require('multer')
const path = require("path");
const fs = require("fs");

//메뉴등록시 이미지 처리 뮬터


//이미지파일 저장경로, 경로에 폴더가 없을경우 자동 생성
const imageDir = 'uploads/pdimage/';
if(!fs.existsSync(imageDir)){
    fs.mkdtempSync(imageDir)
}

const pdupload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, imageDir)
            console.log(done)
        }, filename(req, file, done) {
            const ext = path.extname(file.originalname);
            const timestamp = new Date().getTime().valueOf();
            const filename = path.basename(file.originalname, ext) + timestamp + ext;
            done(null, filename);
        },
    }),
})

module.exports = { pdupload }