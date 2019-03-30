const Order = require('../model/order');

const sendOrder = ( async ( req, res, next ) => {
    const newOrder = new Order( req.body );
    const orderCreated = await Order.createOrder( req, newOrder );
    if ( orderCreated ) {
        return res.status(200).json({
            status: true,
            message: 'תודה שקנית! נתראה בקנייה הבאה'
        })
    }  
    res.status(500).json({
        status: false,
        message: 'אין עגלה פתוחה במערכת'
    });
});

const CheckOutController = { sendOrder };
module.exports = CheckOutController;