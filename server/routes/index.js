const express = require('express');
const router = express.Router();
const Middlewares = require('../dal/middlewares');
const checkAuth = require('../check-auth');

const getProducts = Middlewares.getProducts;
const addProduct = Middlewares.addProduct;
const deleteProduct = Middlewares.deleteProduct;
const updateProduct = Middlewares.updateProduct;
const createCart = Middlewares.createCart;
const getCart = Middlewares.getCart;
const getCartProducts = Middlewares.getCartProducts;
const addCartProduct = Middlewares.addCartProduct;
const deleteCartProduct = Middlewares.deleteCartProduct;
const updateCartProduct = Middlewares.updateCartProduct;

const auth = ((req, res, next) => {
    if(req.isAuthenticated) {
        return next();
    }
    res.redirect('/');

});

// Products routes
router.get('/products', getProducts);
router.put('/products', checkAuth, addProduct);
router.delete('/products/:id', checkAuth, deleteProduct);
router.patch('/products/:id', checkAuth, updateProduct);

//Cart routes
router.put('/cart', createCart);
router.get('/cart/:id', getCart);
router.get('/cart/products', getCartProducts);
router.put('/cart', addCartProduct);
router.delete('/cart/products/:id', deleteCartProduct);
router.patch('/cart/product/:id', updateCartProduct);

module.exports = router;