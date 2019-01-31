const Product = require('../model/product');
const Category = require('../model/category');
const CartItem = require('../model/product-from-cart');
const Cart = require('../model/cart');
const User = require('../model/user');
const Order = require('../model/order');

const getProducts = ((req, res) => {
    Product.find().then( data => {
        res.send(data);
    });
});

const addProduct = (( req, res ) => {
    const newProduct = new Product( req.body );
    newProduct.save().then( data => {
        res.send(data);
    })
    .catch((error) => {
        res.send(error);
    });
});

const deleteProduct = (( req, res ) => {
    const id = req.params.id;
    Product.findByIdAndDelete({ _id: id })
    .then(() => {
        res.send('Product has deleted')
    })
    .catch((error) => {
        res.send(error);
    })

});

const updateProduct = (( req, res ) => {
    const id = req.params.id;
    const update = {
        name: req.body.name,
        image: req.body.image,
        price: req.body.price
    }
    Product.findByIdAndUpdate(id, update, { new: true })
    .then(() => {
        res.send('Product has updated!')
    })
    .catch((error) => {
        res.send(error);
    })
});

const createCart = (( req, res ) => {

});

const getCart = (( req, res ) => {

});

const deleteCart = (( req, res ) => {

});

const getCartProducts = (( req, res ) => {

});

const addCartProduct = (( req, res ) => {

});

const deleteCartProduct = (( req, res ) => {

});

const updateCartProduct = (( req, res ) => {

});

const Middlewares = {
    addProduct,
    getProducts,
    deleteProduct,
    updateProduct,
    createCart,
    getCart,
    deleteCart,
    getCartProducts,
    addCartProduct,
    deleteCartProduct,
    updateCartProduct
};

module.exports = Middlewares;