const multer = require('multer')
const path = require("path");

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
module.exports = upload