const mongoose = require('mongoose')
const dotenv = require("dotenv").config() //this allows me to use my .env values in this file
const Categories = require('./models/Categories')
const connectToDB = require('./db')



async function addToDB(){
    await connectToDB()

    await Categories.insertMany([
        {categoryName:'Literary & General Fiction'},
        {categoryName: 'Mystery & Crime'},
        {categoryName: 'Thriller & Suspense'},
         {categoryName:'Science Fiction (Sci-Fi)'},
        {categoryName: 'Fantasy'},
        {categoryName: 'Romance'},
         {categoryName:'Horror & Gothic'},
        {categoryName: 'Westerns'},
        {categoryName: 'Biography, Autobiography & Memoir'},
         {categoryName:'History'},
        {categoryName: 'Business, Finance & Economics'},
        {categoryName: 'Self-Help, Wellness & Personal Development'},
         {categoryName:'Health, Fitness & Diet'},
        {categoryName: 'Science, Technology & Nature'},
        {categoryName: 'Philosophy, Religion & Spirituality'},
         {categoryName:'Arts, Design & Entertainment'},
        {categoryName: 'Politics, Law & Social Sciences'},
        {categoryName: 'Lifestyle, Hobbies & Home'},
        {categoryName: 'Reference, Academia & Textbooks'},
    ])


    await mongoose.disconnect()
}

addToDB()