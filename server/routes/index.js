const express = require('express');
const router = express.Router();
const CartController = require('../controllers/carts');
const ProductsController = require('../controllers/products');
const CheckOutController = require('../controllers/checkout');
const CategoriesController = require('../controllers/categories');
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
        console.log(file)
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

const getCategories = CategoriesController.getCategories;
const addCategory = CategoriesController.addCategory;
const getProducts = ProductsController.getProducts;
const addProduct = ProductsController.addProduct;
const deleteProduct = ProductsController.deleteProduct;
const updateProduct = ProductsController.updateProduct;
const createCart = CartController.createCart;
const deleteCart = CartController.deleteCart;
const getCartItems = CartController.getCartItems;
const addCartItem = CartController.addCartItem;
const deleteCartItem = CartController.deleteCartItem;
const sendOrder = CheckOutController.sendOrder;

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

//checkout
router.put('/order', checkAuth, sendOrder);

module.exports = router;