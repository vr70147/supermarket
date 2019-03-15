
const Cart = require('../model/cart');

const getCart = ( async ( req, res, next ) => {
    try {
        const findCart = await Cart.findOne({ user: req.decoded.userId });
        if( findCart ) {
            return res.send( true );
        }
        return res.send( false );
    }
    catch(error) {
        return res.status(500).send(error);
    }
});

const createCart = ( async ( req, res, next ) => {
    const newCart = new Cart({ user: req.decoded.userId });
    const createdCart = await Cart.createCart(req, newCart);
    if ( createdCart ) {
        return res.status(200).json({
            cart: createdCart
        });
    }
    res.status(500).json({
        massage: 'קיימת כבר עגלה פתוחה'
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
        if( cart[0].items != undefined) {
            res.status(200).send({
                items: cart[0].items
            });
        }
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

const deleteCartItem = ( async ( req, res, next ) => {
    const deletedItem = await Cart.deleteItemFromCart(req);
    if ( deletedItem ) {
        return res.status(200).send({
            message: 'הפריט הוסר בהצלחה'
        });
    }
    res.status(500).send({
        message: new Error
    });
});

deleteAllItems = ( async ( req, res, next ) => {
    const deleteAll = await Cart.deleteAllItems(req);
    if ( deleteAll ) {
        return res.status(200).send({
            message: 'המוצרים נמחקו בהצלחה'
        });
    }
    res.status(500).send({
        message: req.error
    });
})

const CartController = {
    getCart,
    createCart,
    deleteCart,
    getCartItems,
    addCartItem,
    deleteCartItem,
    deleteAllItems
}

module.exports = CartController;