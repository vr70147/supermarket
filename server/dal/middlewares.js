
const mongoose = require('mongoose');
const Product = require('../model/product');
const Category = require('../model/category');
const Cart = require('../model/cart');
const Order = require('../model/order');

let cartFlag = false;
// Error Handler

// Check if product exist
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

// Check if product exist in cart
const isDuplicatedItemInCart = ( req, product, cb ) => {
    
    Cart.findOne({ user: req.decoded.userId }).then( cart => {
            for ( let i = 0 ; i < cart.items.length ; i++ ) {
                if(cart.items[i].name === product.name) {
                    cart.items[i].name
                    cartFlag = true;
                }
            }
        return cb();
    });
}

// Check if category exist
const isDuplicatedCategories = ( req, res, category, cb ) => {
    Category.findOne({ name: category }).then(( category ) => {
        if ( category ) {
            return res.status(500).send({
                massage: 'הקטגוריה שבחרת כבר קיימת'
            });
        }
        return cb();
    })
    .catch( err => {
        res.status(500).send({
            error: err
        });
    });
}
// Update the price of the modified item
const updateCartItemPrice = ( req, res, choosenItem, qty ) => {
    Cart.updateOne({ user: req.decoded.userId },
        { $inc: { 'items.$[t].qty': qty } },
        { arrayFilters: [ { 't.name': choosenItem.name } ]})
        .then( () => {
            return res.status(200).send({
                massage: 'המוצר עודכן בהצלחה'
            });
        })
        .catch(( error ) => {
            return res.send(error);
        });
}

// End Error Handler

const getCategories = (( req, res, next ) => {
    Category.find({}).then( categories => {
        res.status(200).send(categories);
    })
	.catch( error => {
        res.status(500).send(error);
    })
});

const addCategory = (( req, res, next ) => {
    const newCategory = new Category( req. body );
    isDuplicatedCategories( req, res, newCategory.name, () => {
        newCategory.save().then(( data ) => {
            res.send(data)
        }).catch( err => {
            res.status(500).send({
                error: err
            })
        })
    });
});

const getProducts = ((req, res, next) => {
    Product.find({}).populate('category', 'name').exec( ( err, category ) => {
		if (err){ return console.log(err)};
		res.status(200).json(category);
	}) 
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
        newCart.save().then( cart => {
            res.status(200).send({
                id: cart._id,
                items: cart.items,
                user: cart.user,
                date: cart.date.toString().split(" ")
            });
        })
        .catch(err => {
            res.status(500).send(err);
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

const getCartItems = (( req, res, next ) => {
    Cart.find({ user: req.decoded.userId }).then( cart => {
        res.status(200).send({
            items: cart[0].items
        });
    })
});

const addCartItem = (( req, res, next ) => {
    const id = req.body.id;
    const qty = req.body.qty;
    Product.findById({ _id: id }).then( choosenItem => {
        isDuplicatedItemInCart( req, choosenItem, cb => {
            if( cartFlag ) {
                updateCartItemPrice( req, res, choosenItem, qty );
            }
            if ( !cartFlag ) {
                const selectedItem = {
                    _id: choosenItem._id,
                    name: choosenItem.name,
                    image: choosenItem.image,
                    qty: qty,
                    price: choosenItem.price
                }
                Cart.updateOne( { user: req.decoded.userId }, { $push: { items: selectedItem } })
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

const deleteCartItem = (( req, res, next ) => {
    Cart.updateOne({ user: req.decoded.userId }, { "$pull": { "items": { "_id": req.params.id } }}, { safe: true, multi:true })
    .then(() => {
        res.status(200).send({
            massage: 'הפריט הוסר בהצלחה'
        });
    })
    .catch( error => {
        res.status(500).send({
            massage: error
        });
    });
});

const updateCartItem = (( req, res, next ) => {
    const id = req.body.id;
    const qty = req.body.qty;
    Product.findById({ _id: id }).then( choosenProduct => {
        updateCartItemPrice( req, res, choosenProduct, qty );
    });
});

const sendOrder = (( req, res, next ) => {

});

const Middlewares = {
    addCategory,
    getCategories,
    addProduct,
    getProducts,
    deleteProduct,
    updateProduct,
    createCart,
    deleteCart,
    getCartItems,
    addCartItem,
    deleteCartItem,
    updateCartItem,
    sendOrder
};

module.exports = Middlewares;