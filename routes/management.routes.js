const router = require("express").Router()
const isSignedIn = require("../middleware/is-signed-in.js");
const Books = require("../models/Books.js");
const Categories = require("../models/Categories.js");
const upload = require('../middleware/upload-images.js');

const getErrorMessage = (error) => {
    const details = error?.error?.message ?? error?.message ?? error;
    if (typeof details === 'string') return details;

    try {
        return JSON.stringify(details);
    } catch {
        return String(details);
    }
};

const uploadCoverImage = (req, res, next) => {
    upload.single('coverImage')(req, res, (error) => {
        if (error) {
            console.error('Cover image upload failed:', error);
            return res.status(500).send(`Error uploading cover image: ${getErrorMessage(error)}`);
        }
        next();
    });
};

/// To get the Categories values fron the other model to be displayed in the form as a dropdown
router.get('/new', isSignedIn, async (req, res) => {
    const categories = await Categories.find();

    res.render('management/create.ejs', { categories });
});

//// To Add a new Book
router.post('/new', isSignedIn, uploadCoverImage, async (req, res) => {
    try {
        console.log(req.body); // Text fields are safely populated here
        console.log(req.file); // Cloudinary file details populate here
        console.log(req.session.user._id);

        // 2. Extract the Cloudinary secure URL if a file was provided
        let coverImageUrl = '';
        if (req.file) {
            coverImageUrl = req.file.path; // The direct Cloudinary image link
        }

        const createdBook = await Books.create({
            coverImage: coverImageUrl,
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
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error creating book: ${getErrorMessage(error)}`);
    }
});

//// To Display all Added Book
////router.get('/dashboard', isSignedIn, async (req, res) => {
    ////const allBooks = await Books.find().populate('categoryName');
   //// res.render('management/dashboard.ejs', {
       /// books: allBooks,
        ///user: req.session.user
   /// });
    ///console.log(allBooks)
///});

//// To Display the 7 Latest Added Books
router.get('/dashboard', isSignedIn, async (req, res) => {
    try {
        const latestBooks = await Books.find()
            .populate('categoryName')
            .sort({ createdAt: -1 }) // Sorts by newest first using timestamps
            .limit(7);               // Limits query to the latest 7

        res.render('management/dashboard.ejs', {
            books: latestBooks,
            user: req.session.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error loading dashboard: ${getErrorMessage(error)}`);
    }
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
    console.log('Received book ID:', req.params.bookId);
    const foundBook = await Books.findById(req.params.bookId).populate('categoryName');
    const categories = await Categories.find();

    if (!foundBook) {
        return res.send('Book not found');
    }

    res.render('management/edit.ejs', {
        books: foundBook,
        categories
    });
});



    router.put('/:bookId', isSignedIn, uploadCoverImage, async (req, res) => {

        console.log('Book ID:', req.params.bookId);
        console.log('Updated information:', req.body);
        console.log('Uploaded image:', req.file);

        const updatedData = {
            title: req.body.title,
            description: req.body.description,
            categoryName: req.body.categoryName,
            author: req.body.author,
            rating: req.body.rating,
            publishYear: req.body.publishYear,
            Status: req.body.Status
        };

        if (req.file) {
            updatedData.coverImage = req.file.path;
        }

        await Books.findByIdAndUpdate(req.params.bookId, updatedData);

        res.redirect('/dashboard');
    });



module.exports = router;
