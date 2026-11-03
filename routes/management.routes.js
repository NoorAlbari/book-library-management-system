const router = require("express").Router()
const isSignedIn = require("../middleware/is-signed-in.js");
const Listing = require("../models/Listing.js");

router.get('/new', isSignedIn, (req, res) => {
    res.render('listing/create-listing.ejs')
})


router.post('/', isSignedIn, async (req, res) => {
    const { streetAddress, city, price, size } = req.body
    const createdListing = await Listing.create({
        streetAddress,
        city,
        price,
        size,
        owner: req.session.user._id,
    })

    res.redirect('/all')
})


router.get('/all', isSignedIn, async (req, res) => {
    const allListing = await Listing.find().populate('owner')
    res.render('listing/all.ejs', { listing: allListing })
})


router.get('/:listingId', isSignedIn, async (req, res) => {
    console.log(req.params.listingId)
    const allListingInfo = await Listing.findById(req.params.listingId).populate('owner')
    console.log(allListingInfo.owner._id)
    console.log(req.session.user._id)
     console.log(allListingInfo.owner._id.equals(req.session.user._id))
    res.render('listing/details.ejs', { listing: allListingInfo })
})



router.delete('/:listingId', isSignedIn, async (req, res) => {

   await Listing.findByIdAndDelete(req.params.listingId)
   res.redirect('/listing/all')

})


router.post('/:listingId/favorite',async (req, res)=>{
    const updatedListing = await Listing.findByIdAndUpdate(req.params.listingId,{$push: {favoritedByUsers: req.session.user._id}})
  
res.redirect('/listing/' + updatedListing._id)
})

router.post('/:listingId/unfavorite',async (req, res)=>{
    const updatedListing = await Listing.findByIdAndUpdate(req.params.listingId,{$pull: {favoritedByUsers: req.session.user._id}})
  
res.redirect('/listing/' + updatedListing._id)
})

router.get('/my-listings', isSignedIn, async (req,res)=>{
    const myListings = await Listing.find({owner: req.session.user._id})
})

module.exports = router;
