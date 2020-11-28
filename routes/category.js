const express = require('express');
const router = express.Router();

const {getUserById} = require('../controllers/user')
const {isAdmin,isSignedIn,isAuthenticated} = require('../controllers/auth')
const {getCategoryById,createCategory,getCategory,getAllaCtegories,updateCategory,removeCategory} = require('../controllers/category')

//params
router.param("userId",getUserById);
router.param("categoryId",getCategoryById);

//actual routes goes here

// create routes
router.post('/category/create/:userId',isSignedIn,isAuthenticated,isAdmin,createCategory);

// read one category
router.get('/category/:categoryId',isSignedIn,isAuthenticated,isAdmin,getCategory);

// read all category
router.get("/categories", getAllaCtegories);

// update
router.put('/category/:categoryId/:userId',isSignedIn,isAuthenticated,isAdmin,updateCategory);

// delete
router.delete('/category/:categoryId/:userId',isSignedIn,isAuthenticated,isAdmin,removeCategory);

module.exports = router;