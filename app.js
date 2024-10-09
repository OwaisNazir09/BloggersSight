require("dotenv").config()
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const blog = require('./model/blogschema')
const cookieParser = require('cookie-parser');
const checkforauth = require('./middlewares/auth'); // Use default import


const app = express();
const port = process.env.PORT;
const userRoutes = require('./Routes/user');
const blogRoutes = require('./Routes/blog'); // Corrected import

app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Mongoose connected successfully");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set('views', path.resolve('views'));

app.use(express.urlencoded({ extended: false }));
app.use(checkforauth("token")); // Apply auth middleware globally


// Routes
app.use('/user', userRoutes);
app.use('/blog', blogRoutes); // Corrected usage
app.use(express.static(path.resolve("./public")));
app.get('/', async (req, res) => {
    const currentUser = req.user || null;

    try {
        const allblogs = await blog.find({});
        res.render('home', { currentUser, allblogs }); // Pass allblogs to the template
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).send('Error fetching blogs');
    }
});

app.get('/add-new', (req, res) => {
    const user = req.user || null;
    res.render('home', { user });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
