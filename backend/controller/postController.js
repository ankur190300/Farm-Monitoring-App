const Post = require( '../models/post');

exports.CreatePost = (req, res, next)=>{ // can add any number of functions from left
  //                       to right , single() stands for expecting
  //                       a single file

  // without using mongoDB
  //const post = req.body; // field added by body-parser

  const url = req.protocol + "://" + req.get("host");

  const post = new Post({
    title : req.body.title ,
    content : req.body.content,
    imagePath : url + "/images/" + req.file.filename, // making an image url
    creator : req.userData.userId
  });

  post.save().then(latest_post=>{

    res.status(201).json({
      message:'Post added successfully',
      //postId :latest_post.id //usefull when we want to return only the id and not the entire post
      post : {
        // using spread operator
        ...latest_post,
        id : latest_post._id,
        // without using the spread (...) operator
        // title: latest_post.title ,
        // content : latest_post.content ,
        // imagePath : latest_post.imagePath
      }
    }); // 200 -everything is ok and a new resource was created
  })
  .catch(error=>{
    res.status(500).json({
      message:"Creating a post failed !"
    })
  })


}

exports.GetPosts = (req, res, next)=> {
  // posts = [
  //   {
  //     id:"1sae32d2sewe",
  //     title:"First Post !",
  //     content:"This is the content of my First post "
  //   },
  //   {
  //     id:"1wj3jfw33tw3w",
  //     title:"Second Post !",
  //     content:"This is the content of my Second post "
  //   }
  // ];

  // queries are added to the url using '?' sign in the url
  // different parameteres are seperated by '&' sign

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts ;

  if(pageSize&&currentPage){
    postQuery
    .skip(pageSize*(currentPage-1))
    .limit(pageSize);
  }
  postQuery
  .then((documents)=>{// is asynchronous
    fetchedPosts = documents ;
    return Post.count();
  })
  .then((count)=>{
    //console.log("YO");
    //console.log(count);
    res.status(200).json({ // 200 -everything is ok
      posts:fetchedPosts ,
      message:"Posts were fetched successfully !",
      totalPosts :count
    });
    //console.log(documents);
  })
  .catch(error=>{
    res.status(500).json({
      message:"Fetching posts failed !"
    })
  });

}


exports.GetPost =  (req, res, next)=>{

  Post.findById(req.params.id).then(post=>{
    if(post){
      res.status(200).json(post);
    }
    else{
      res.status(200).json({message:"Post was not found "});
    }
  })
  .catch(error=>{
    res.status(500).json({
      message:"Fetching post failed !"
    })
  });
}


exports.DeletePost = (req, res, next)=>{
  //console.log(req.params.id);
  Post.deleteOne({_id:req.params.id , creator:req.userData.userId}).then(result=>{

    if(result.n> 0){ // has a positive value only when a post is deleted or is modified
      res.status(200).json({
        message:"Post Deleted Successfully !"
      });
    }else {
      res.status(401).json({
        message:"Not Authorized "
      });
    }
  })
  .catch(error=>{
    res.status(500).json({
      message:"Post deletion failed !"
    })
  });
}


exports.UpdatePost = ( req, res, next)=>{
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + "://" + req.get("host");
    imagePath : url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id : req.body.id ,
    title : req.body.title ,
    content : req.body.content,
    imagePath:imagePath,
    creator:req.userData.userId
  });
  Post.updateOne({_id:req.params.id , creator:req.userData.userId}, post).then(result=>{
    //console.log(result);

    // result.nModified will have a positive value if post is modified , result.n will have a positive value
    // even if same post is saved without doing any change
    if(result.n> 0){ // has a positive value only when a post is modified
      res.status(200).json({
        message:"Post Updated !"
      });
    }else {
      res.status(401).json({
        message:"Not Authorized "
      });
    }

  })
  .catch(error=>{
      res.status(500).json({
        message:"Couldn't update post"
      })
  });
}
