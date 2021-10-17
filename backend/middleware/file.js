const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/jpg':'jpg',
  'image/jpeg':'jpg',
  'image/png':'png'
}
const storage = multer.diskStorage({
  destination:(req,file,call_back) =>{
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid) error = null;// mimetype exists
    call_back(error, "backend/images")// path is relative to server.js
  },
  filename:(req, file,call_back ) =>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    call_back(null, name + '-'+ Date.now() + '.' + ext);
  }
});

module.exports =  multer({storage:storage}).single("image");
