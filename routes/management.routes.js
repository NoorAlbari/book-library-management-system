const router = require("express").Router()
const isSignedIn = require("../middleware/is-signed-in.js");
const Books = require("../models/Books.js");
const Category = require("../models/Categories.js");

router.get('/new', isSignedIn, async (req, res) => {
    const categories = await Category.find();

    res.render('management/create.ejs', { categories });
});

router.post('/new', isSignedIn, async (req, res) => {
    console.log(req.body)
    console.log(req.session.user._id);
    const createdBook = await Books.create({
        title: req.body.title,
        description: req.body.description,
        categoryName: req.body.category,
        author: req.body.author,
        rating: req.body.rating,
        publishYear: req.body.publishYear,
        Status: req.body.Status,
        addedBy: req.session.user._id
    })
    res.redirect('/dashboard')
})


router.get('/dashboard', isSignedIn, async (req, res) => {
    res.render('management/dashboard.ejs');
});


module.exports = router;
