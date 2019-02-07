const express = require('express');
const router = express.Router();
const Middlewares = require('../dal/middlewares');
const checkAuth = require('../check-auth');

//upload image start

const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: ( req, file, cb ) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if(isValid) {
            error = null;
        }
        cb( error, 'images');
    },
    filename: (req, file, cb ) => {
        const name = file.originalname.toLowerCase().split( ' ' ).join( '-' );
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb( null, name + '-' + Date.now() + '.' + ext);
    }
});

//end upload image

const getCategories = Middlewares.getCategories;
const addCategory = Middlewares.addCategory;
const getProducts = Middlewares.getProducts;
const addProduct = Middlewares.addProduct;
const deleteProduct = Middlewares.deleteProduct;
const updateProduct = Middlewares.updateProduct;
const createCart = Middlewares.createCart;
const deleteCart = Middlewares.deleteCart;
const getCartItems = Middlewares.getCartItems;
const addCartItem = Middlewares.addCartItem;
const deleteCartItem = Middlewares.deleteCartItem;
const updateCartItem = Middlewares.updateCartItem;
const sendOrder = Middlewares.sendOrder;

//Categories routs
router.get('/categories', checkAuth, getCategories);
router.put('/categories', checkAuth, addCategory);

// Products routes
router.get('/products', checkAuth, getProducts);
router.put('/products', multer({ storage: storage }).single('image'), checkAuth, addProduct);
router.delete('/products/:id', checkAuth, deleteProduct);
router.patch('/products/:id', checkAuth, updateProduct);

//Cart routes
router.put('/cart', checkAuth, createCart);
router.delete('/cart', checkAuth, deleteCart);
router.get('/cart/products', checkAuth, getCartItems);
router.put('/cart/products', checkAuth, addCartItem);
router.delete('/cart/products/:id', checkAuth, deleteCartItem);
router.patch('/cart/products', checkAuth, updateCartItem);

//checkout
router.put('/order', checkAuth, sendOrder);

module.exports = router;