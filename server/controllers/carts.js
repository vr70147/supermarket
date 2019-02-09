
const Cart = require('../model/cart');

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

const addCartItem = ( async ( req, res, next ) => {
    const id = req.body.id;
    const qty = req.body.qty;
    const addItem = await Cart.addItemtoCart( req, res, id, qty );
    if ( addItem ) {
       const cart = await Cart.findOne({ user: req.decoded.userId });
       return res.status(200).send(cart.items);
    }
    return res.status(500).json({
        error: new Error(),
        message: 'אין אפשרות לעדכן את העגלה'
    })
    
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
const CartController = {
    createCart,
    deleteCart,
    getCartItems,
    addCartItem,
    deleteCartItem,
    updateCartItem
}

module.exports = CartController;