const express = require('express');
const router = express.Router();
const blog = require('../model/blogschema'); // Blog schema/model
<<<<<<< HEAD
const { route } = require('./user');
const multer = require('multer')
const path = require('path');
const comment = require('../model/commentschema');
;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/images/uploads"))
=======
const multer = require('multer')
const path = require('path');
const comment = require('../model/commentschema');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/images/uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
>>>>>>> 366e11f4523f68539e2d4ef0b83e934bcccef5f0
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, file.originalname + '-' + uniqueSuffix)
  }
})

<<<<<<< HEAD
const upload = multer({ storage: storage })
=======
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
    files: 1, // only allow 1 file to be uploaded
    fields: 10, // only allow 10 fields to be uploaded
    parts: 10, // only allow 10 parts to be uploaded
    headerPairs: 2000 // only allow 2000 header pairs to be uploaded
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
})
>>>>>>> 366e11f4523f68539e2d4ef0b83e934bcccef5f0

router.get("/addblog", (req, res) => {
  res.render('addblog')
})

router.post('/addblog', upload.single('coverImage'), async (req, res) => {
<<<<<<< HEAD
  const { title, body } = req.body;
  const createdBy = req.user.id;  // Use only the user's ObjectId

  try {
=======
  if (!req.file) {
    return res.status(400).send('No file was uploaded.');
  }

  const { title, body } = req.body;
  const createdBy = req.user.id; 

  try {
    // Add a wait time until the image gets uploaded
    await new Promise(resolve => setTimeout(resolve, 20000));

>>>>>>> 366e11f4523f68539e2d4ef0b83e934bcccef5f0
    const newBlog = await blog.create({
      title,
      body,
      createdBy,
      coverImageUrl: `/images/uploads/${req.file.filename}`,
    });

    console.log("Blog created successfully", newBlog);
    res.redirect('/');
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).send("Error saving the blog");
  }
});

<<<<<<< HEAD

router.get('/:id', async (req, res) => {
  const blogdescriptiodata = await blog.findOne({ _id: req.params.id }).populate("createdBy")
  const comments = await comment.find({ blogId:req.params.id }).populate("createdBy")
=======
router.get('/:id', async (req, res) => {
  const blogdescriptiodata = await blog.findOne({ _id: req.params.id }).populate("createdBy")
  const comments = await comment.find({ blogId:req.params.id }).populate("createdBy")
  console.log(comments);
>>>>>>> 366e11f4523f68539e2d4ef0b83e934bcccef5f0
  res.render("blog", { user: req.user, blogdescriptiodata, comments })
})

router.post('/comment/:blogId', (req, res) => {
<<<<<<< HEAD
=======
  console.log(req.params.blogId)
  console.log(req.body);
  console.log(req.params);
>>>>>>> 366e11f4523f68539e2d4ef0b83e934bcccef5f0
  comment.create({
    content: req.body.content,
    createdBy: req.user.id,
    blogId: req.params.blogId,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

<<<<<<< HEAD
router.post('/:id',async(req,res)=>{
  const blogId = req.params.id;
  console.log(`the blog id is ${blogId}`)
  try {
    await blog.deleteOne({ _id: blogId });
    res.redirect('/');
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).send("Error deleting the blog");
  }
})


module.exports = router;
=======
module.exports = router;
>>>>>>> 366e11f4523f68539e2d4ef0b83e934bcccef5f0
