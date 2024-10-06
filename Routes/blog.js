const express = require('express');
const router = express.Router();
const blog = require('../model/blogschema'); // Blog schema/model
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
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, file.originalname + '-' + uniqueSuffix)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, //  10MB
    files: 1, // only allow 1 file to be uploaded
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
})

router.get("/addblog", (req, res) => {
  res.render('addblog')
})

router.post('/addblog', upload.single('coverImage'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file was uploaded.');
  }

  const { title, body } = req.body;
  const createdBy = req.user.id; 
  try {
    const newBlog = await blog.create({
      title,
      body,
      createdBy,
      coverImageUrl: `/images/uploads/${req.file.filename}`,
    });

    console.log("Blog created successfully", newBlog);
    res.redirect('/'); // Redirect after successful blog creation
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).send("Error saving the blog");
  }
});


router.get('/:id', async (req, res) => {
  const blogdescriptiodata = await blog.findOne({ _id: req.params.id }).populate("createdBy")
  const comments = await comment.find({ blogId:req.params.id }).populate("createdBy")
  console.log(comments);
  res.render("blog", { user: req.user, blogdescriptiodata, comments })
})

router.post('/comment/:blogId', (req, res) => {
  console.log(req.params.blogId)
  console.log(req.body);
  console.log(req.params);
  comment.create({
    content: req.body.content,
    createdBy: req.user.id,
    blogId: req.params.blogId,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;