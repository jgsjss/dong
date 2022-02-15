const multer = require('multer')
const path = require("path");

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/png" || file.mimetype ==="image/jpg" || file.mimetype === "image/jpeg"){
        cb(null, true); // 위의 확장자 이미지 파일만 받겠다
    }else{
        req.fileValidationError = "jpg, jpeg, png, gif, webp 파일만 업로드 가능합니다.";
        cb(null, false);
    }
}


const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/image/')
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