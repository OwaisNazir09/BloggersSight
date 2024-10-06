const express = require('express');
const router = express.Router();
const blog = require('../model/blogschema'); // Blog schema/model
const { route } = require('./user');
const multer = require('multer');
const path = require('path');
const comment = require('../model/commentschema');

// Update: Use an absolute path for the upload directory
const uploadDir = path.join(__dirname, '../public/images/uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, file.originalname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

router.get("/addblog", (req, res) => {
  res.render('addblog')
})

router.post('/addblog', upload.single('coverImage'), async (req, res) => {

  console.log('File uploaded:', req.file);
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }
  res.send('File uploaded successfully!');
  const { title, body } = req.body;
  const createdBy = req.user.id;  // Use only the user's ObjectId

  try {
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