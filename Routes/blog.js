const express = require('express');
const router = express.Router();
const blog = require('../model/blogschema');
const multer = require('multer');
const path = require('path');
const comment = require('../model/commentschema');
const fs = require('fs');

// Setup storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/images/uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, file.originalname + '-' + uniqueSuffix);
  }
});

// Configure multer for file uploads
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
    files: 1,
    fields: 10,
    parts: 10,
    headerPairs: 2000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
});

router.get("/addblog", (req, res) => {
  res.render('addblog');
});

// Add a blog post
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
    res.redirect('/');
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).send("Error saving the blog");
  }
});

// Get a specific blog post
router.get('/:id', async (req, res) => {
  try {
    const blogdescriptiodata = await blog.findOne({ _id: req.params.id }).populate("createdBy");
    const comments = await comment.find({ blogId: req.params.id }).populate("createdBy");
    
    res.render("blog", { user: req.user, blogdescriptiodata, comments });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).send("Error fetching blog data");
  }
});

// Post a comment
router.post('/comment/:blogId', async (req, res) => {
  try {
    await comment.create({
      content: req.body.content,
      createdBy: req.user.id,
      blogId: req.params.blogId,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).send("Error creating comment");
  }
});

// Delete a blog post
router.post('/:id', async (req, res) => {
  const blogId = req.params.id;
  try {
    const blogToDelete = await blog.findById(blogId);
    if (blogToDelete.createdBy.toString() !== req.user.id) {
      return res.status(403).send("You are not authorized to delete this blog");
    }

    await blog.deleteOne({ _id: blogId });
    res.redirect('/');
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).send("Error deleting the blog");
  }
});

module.exports = router;
