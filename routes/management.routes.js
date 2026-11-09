const router = require("express").Router()
const isSignedIn = require("../middleware/is-signed-in.js");
const Books = require("../models/Books.js");
const Categories = require("../models/Categories.js");
const upload = require('../middleware/upload-images.js');


router.get('/404-page', (req, res) => {
    res.status(404).render('404-page.ejs', {
        user: req.session ? req.session.user : null
    });
});

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

router.get('/', async (req, res) => {
    try {
        const latestAvailableBooks = await Books.find()
            .populate('categoryName')
            .sort({ createdAt: -1 })
            .limit(7);

        res.render('homepage.ejs', {
            books: latestAvailableBooks,
            user: req.session ? req.session.user : null // In case your navbar checks user auth
        });
    } catch (error) {
res.redirect('/404-page');
    }
});

/// To get the Categories values from the other model to be displayed in the form as a dropdown
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
        res.redirect('/404-page');
    }
});



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
        res.redirect('/404-page');
    }
});


router.delete('/:bookId', isSignedIn, async (req, res) => {
    const foundBook = await Books.findById(req.params.bookId);
    try {

        await Books.findByIdAndDelete(req.params.bookId);

        res.redirect('/dashboard');
    }


    catch (error) {
        res.redirect('/404-page');
    }
});


router.get('/:bookId/edit', isSignedIn, async (req, res) => {
    console.log('Received book ID:', req.params.bookId);
    const foundBook = await Books.findById(req.params.bookId).populate('categoryName');
    const categories = await Categories.find();
    try {

        res.render('management/edit.ejs', {
            books: foundBook,
            categories
        });
    }
    catch (error) {
        res.redirect('/404-page');
    }
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
    try {

        if (req.file) {
            updatedData.coverImage = req.file.path;
        }

        await Books.findByIdAndUpdate(req.params.bookId, updatedData);

        res.redirect('/dashboard');
    }

    catch (error) {
        res.redirect('/404-page');
    }
});

router.get('/full-shelf/:status', async (req, res) => {
    try {
        console.log('Requested status:', req.params.status);
        const latestAvailableBooks = await Books.find({ Status: req.params.status })
            .populate('categoryName')
            .sort({ createdAt: -1 })

        console.log(latestAvailableBooks.length)

        let index = 0
        const nestedBooks = [[]]
        for (let i = 0; i < latestAvailableBooks.length; i += 1) {
            if (nestedBooks[index].length === 7) {
                index++
                nestedBooks.push([])
            }
            nestedBooks[index].push(latestAvailableBooks[i])
        }

        let booksStatus = ''

        latestAvailableBooks.forEach((book) => {
            if (book.Status === 'Available') {
                booksStatus = 'Available'
            } else if (book.Status === 'Coming Soon') {
                booksStatus = 'Coming Soon'
            } else if (book.Status === 'Borrowed') {
                booksStatus = 'Borrowed'
            }
        })


        console.log(nestedBooks[0])
        console.log(nestedBooks[1])

        res.render('full-shelf.ejs', {
            nestedBooks,
            books: latestAvailableBooks,
            user: req.session ? req.session.user : null, // In case your navbar checks user auth
            booksStatus
        });
    } catch (error) {
        console.error(error);
        res.redirect('/404-page');
    }
});



module.exports = router;
