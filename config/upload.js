const multer = require('multer')
const path = require("path");
const fs = require("fs");

//회원가입시 사업자 등록 뮬터

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/png" || file.mimetype ==="image/jpg" || file.mimetype === "image/jpeg"){
        cb(null, true); // 위의 확장자 이미지 파일만 받겠다
    }else{
        req.fileValidationError = "jpg, jpeg, png, gif, webp 파일만 업로드 가능합니다.";
        cb(null, false);
    }
}

//이미지파일 저장경로, 경로에 폴더가 없을경우 자동 생성
const imageDir = 'uploads/image/';
if(!fs.existsSync(imageDir)){
    fs.mkdtempSync(imageDir)
}


const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, imageDir)
            console.log(done)
        }, filename(req, file, done) {
            const ext = path.extname(file.originalname);
            // done(null, path.basename(file.originalname, ext) + Date.now() + ext);
            console.log("multer biznum =======> ", req.headers.biznum)
            const biznum=req.headers.biznum
            // done(null, path.basename(file.originalname, ext)+ ext);
            done(null, path.basename(biznum)+ ext);
            console.log(ext)
        },
    }), limits: {fileSize: 50 * 1024 * 1024}
});
module.exports = {upload, fileFilter}