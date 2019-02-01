const express = require('express');
const router = express.Router();
const Middlewares = require('../dal/middlewares');
const checkAuth = require('../check-auth');

const getProducts = Middlewares.getProducts;
const addProduct = Middlewares.addProduct;
const deleteProduct = Middlewares.deleteProduct;
const updateProduct = Middlewares.updateProduct;
const createCart = Middlewares.createCart;
const deleteCart = Middlewares.deleteCart;
const getCartProducts = Middlewares.getCartProducts;
const addCartProduct = Middlewares.addCartProduct;
const deleteCartProduct = Middlewares.deleteCartProduct;
const updateCartProduct = Middlewares.updateCartProduct;

// Products routes
router.get('/products', checkAuth, getProducts);
router.put('/products', checkAuth, addProduct);
router.delete('/products/:id', checkAuth, deleteProduct);
router.patch('/products/:id', checkAuth, updateProduct);

//Cart routes
router.put('/cart', checkAuth, createCart);
router.delete('/cart/:id', checkAuth, deleteCart);
router.get('/cart/:id/products', checkAuth, getCartProducts);
router.put('/cart/:id/products', checkAuth, addCartProduct);
router.delete('/cart/:id/products/:id', checkAuth, deleteCartProduct);
router.patch('/cart/:id/product/:id', checkAuth, updateCartProduct);

module.exports = router;