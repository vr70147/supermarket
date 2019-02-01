const Product = require('../model/product');
const Category = require('../model/category');
const CartItem = require('../model/product-from-cart');
const Cart = require('../model/cart');
const User = require('../model/user');
const Order = require('../model/order');

let cartFlag = false;
// Error Handler

const isDuplicatedProducts = ( res, productName, cb ) => {
    Product.find({ 'name': productName }).then( result => {
        if ( result.length > 0 ) {
            return res.status(500).send({
                massage: 'this product already exist'
            });
        }
        return cb();
    });
}

const isDuplicatedProductsInCart = ( productName, next, cb ) => {
    Cart.find({}).then( cart => {
       
            for ( let i = 0 ; i < cart[0].items.length ; i++ ) {
                if(cart[0].items[i].name === productName) {
                cartFlag = true;
                }
            }
        
        return cb();
    });
}

// End Error Handler


const getProducts = ((req, res, next) => {
    Product.find().then( data => {
        res.send(data);
    });
});

const addProduct = (( req, res, next ) => {
    const newProduct = new Product( req.body );
    isDuplicatedProducts(res, newProduct.name, cb =>{
        newProduct.save().then( data => {
            res.send(data);
        })
        .catch((error) => {
            res.send(error);
        });
    });
});

const deleteProduct = (( req, res, next ) => {
    const id = req.params.id;
    Product.findByIdAndDelete({ _id: id })
    .then(() => {
        res.send('Product has deleted')
    })
    .catch((error) => {
        res.send(error);
    })
});

const updateProduct = (( req, res, next ) => {
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

const createCart = (( req, res, next ) => {
    Cart.find({ user: req.decoded.userId }).then((results) => {
        if( results.length > 0 ) {
            return res.status(500).send({
                massage: 'you have an open cart already'
            });
        }
        const newCart = new Cart({ user: req.decoded.userId });
        newCart.save().then( data => {
            res.send(data);
        })
        .catch((error) => {
            res.send(error);
        });  
    });
});

const deleteCart = (( req, res, next ) => {

});

const getCartProducts = (( req, res, next ) => {
   
});

const addCartProduct = (( req, res, next ) => {
    Product.findById({ _id: req.body.id }).then( choosenProduct => {
        isDuplicatedProductsInCart( choosenProduct.name, next, cb => {
            console.log(cartFlag);
            if( cartFlag ) {
                Cart.updateOne( { user: req.decoded.userId }, { $inc: { "items.$[].price" : choosenProduct.price } })
                .then( () => {
                    return res.status(200).send({
                        massage: 'item updated successfuly'
                    });
                })
                .catch(( error ) => {
                    return res.send(error);
                });
            }
            if ( !cartFlag ) {
                Cart.updateOne( { user: req.decoded.userId }, { $push: { items: choosenProduct } })
                .then( () => {
                    return res.status(200).send({
                        massage: 'item added successfuly'
                    });
                })
                .catch(( error ) => {
                    return res.send(error);
                });
            }
        })
    });
});

const deleteCartProduct = (( req, res, next ) => {

});

const updateCartProduct = (( req, res, next ) => {

});

const Middlewares = {
    addProduct,
    getProducts,
    deleteProduct,
    updateProduct,
    createCart,
    deleteCart,
    getCartProducts,
    addCartProduct,
    deleteCartProduct,
    updateCartProduct
};

module.exports = Middlewares;