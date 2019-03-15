const Order = require('../model/order');

const sendOrder = ( async ( req, res, next ) => {
    const newOrder = new Order( req.body );
    const orderCreated = await Order.createOrder( req, newOrder );
    if ( orderCreated ) {
        return res.status(200).json({
            message: 'תודה שקנית! נתראה בקנייה הבאה'
        })
    }  
    res.status(500).json({
        message: 'אין עגלה פתוחה במערכת'
    });
});

const CheckOutController = { sendOrder };
module.exports = CheckOutController;