const express = require('express');
const router = express.Router(); // used to keep all the routes
const extractFile = require('../middleware/file');
const checkAuth = require('../middleware/check-auth');
const postController = require('../controller/postController');


router.post("",
  checkAuth, // only the reference to the function not the function(checkAuth())
  extractFile,
  postController.CreatePost
  );

router.get("", postController.GetPosts);
router.get("/:id",postController.GetPost);

router.delete("/:id",
  checkAuth, // only the reference to the function not the function(checkAuth())
  postController.DeletePost
 );

router.put("/:id",
  checkAuth, // only the reference to the function not the function(checkAuth())
  extractFile,
  postController.UpdatePost
);

module.exports = router ;

