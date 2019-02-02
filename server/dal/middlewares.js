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
                massage: 'המוצר כבר קיים במערכת'
            });
        }
        return cb();
    });
}

const isDuplicatedProductsInCart = ( req, product, cb ) => {
    
    Cart.findOne({ user: req.decoded.userId }).then( cart => {
            for ( let i = 0 ; i < cart.items.length ; i++ ) {
                if(cart.items[i].name === product.name) {
                cart.items[i].name
                cartFlag = true;
                console.log(cartFlag);
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
        res.send('המוצר נמחק בהצלחה')
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
        res.send('המוצר עודכן בהצלחה')
    })
    .catch((error) => {
        res.send(error);
    })
});

const createCart = (( req, res, next ) => {
    Cart.find({ user: req.decoded.userId }).then((results) => {
        if( results.length > 0 ) {
            return res.status(500).send({
                massage: 'קיימת כבר עגלה פתוחה'
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
    Cart.deleteOne({ user: req.decoded.userId }).then( () => {
        res.status(200).send({
            massage: 'תודה שקנית! נתראה בקנייה הבאה'
        })
    })

});

const getCartProducts = (( req, res, next ) => {
    Cart.find({ user: req.decoded.userId }).then( cart => {
        res.status(200).send({
            items: cart[0].items
        });
    })
});

const addCartProduct = (( req, res, next ) => {
    const id = req.body.id;
    const qty = req.body.qty;
    Product.findById({ _id: id }).then( choosenProduct => {
        isDuplicatedProductsInCart( req, choosenProduct, cb => {
            if( cartFlag ) {
                Cart.updateOne({ user: req.decoded.userId },
                { $inc: { 'items.$[t].price': choosenProduct.price * qty } },
                { arrayFilters: [ { 't.name': choosenProduct.name } ]})
                .then( () => {
                    return res.status(200).send({
                        massage: 'המוצר עודכן בהצלחה'
                    });
                })
                .catch(( error ) => {
                    console.log('error')
                    return res.send(error);
                });
            }
            if ( !cartFlag ) {
                const selectedProduct = {
                    _id: choosenProduct._id,
                    name: choosenProduct.name,
                    image: choosenProduct.image,
                    price: choosenProduct.price * req.body.qty
                }
                Cart.updateOne( { user: req.decoded.userId }, { $push: { items: selectedProduct } })
                .then( () => {
                    return res.status(200).send({
                        massage: 'המוצר הוסף בהצלחה אל עגלת הקניות'
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