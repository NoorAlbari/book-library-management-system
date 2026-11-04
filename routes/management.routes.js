const router = require("express").Router()
const isSignedIn = require("../middleware/is-signed-in.js");
const Books = require("../models/Books.js");
const Categories = require("../models/Categories.js");

/// To get the Categories values fron the other model to be displayed in the form as a dropdown
router.get('/new', isSignedIn, async (req, res) => {
    const categories = await Categories.find();

    res.render('management/create.ejs', { categories });
});

//// To Add a new Book
router.post('/new', isSignedIn, async (req, res) => {
    console.log(req.body)
    console.log(req.session.user._id);
    const createdBook = await Books.create({
        title: req.body.title,
        description: req.body.description,
        categoryName: req.body.categoryName,
        author: req.body.author,
        rating: req.body.rating,
        publishYear: req.body.publishYear,
        Status: req.body.Status,
        addedBy: req.session.user._id
    })
    res.redirect('/dashboard')
})

//// To Display all Added Book
router.get('/dashboard', isSignedIn, async (req, res) => {
    const allBooks = await Books.find().populate('categoryName');
    res.render('management/dashboard.ejs',{
        books: allBooks,
        user: req.session.user
    });
    console.log(allBooks)
});


router.delete('/:bookId', isSignedIn, async (req, res) => {
    const foundBook = await Books.findById(req.params.bookId);

    if (!foundBook) {
        return res.send('Book not found');
    }

    await Books.findByIdAndDelete(req.params.bookId);

    res.redirect('/dashboard');
});


router.get('/:bookId/edit', isSignedIn, async (req, res) => {
    const foundBook = await Books.findById(req.params.bookId);
    const categories = await Categories.find();

    if (!foundBook) {
        return res.send('Book not found');
    }

    res.render('management/edit.ejs', {
        books: foundBook,
        categories
    });
});


router.put('/:bookId', isSignedIn, async (req, res) => {
     console.log('Edit route reached!');
    console.log(req.params.bookId);
    await Books.findByIdAndUpdate(
        req.params.bookId,
        req.body
    );

    res.redirect('/dashboard');
});



module.exports = router;
