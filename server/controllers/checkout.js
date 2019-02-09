const Order = require('../model/order');
const pdf = require('pdfkit');
const fs = require('fs');

const sendOrder = (( req, res, next ) => {
    const newOrder = new Order( req.body );
	newOrder.save().then( order => {
		Cart.find({ user: req.decoded.userId }).then( cart => {
            const receipt = new pdf;
            console.log(receipt);
			receipt.pipe(fs.createWriteStream('./receipts/receipt_no-'+ cart[0]._id +'.pdf', { flag: 'a', encoding: 'UTF-8' }));
                receipt
                .font('Helvetica')
                .fontSize(15)
				.text(	'חשבונית מספר ' + cart[0]._id + '\n' +
						'________________________________________________' + '\n', 30, 30);
				for( let i = 0 ; i < cart[0].items.length ; i++ ){
					receipt.moveDown();	
					receipt.text('\n' + cart[0].items[i].name + ' x ' + cart[0].items[i].qty + ' price: ' + cart[0].items[i].price + '₪' + ' sum: ' + cart[0].items[i].qty*cart[0].items[i].price + '₪' + '\n')
				} 
			receipt.end();
            order.cart = cart._id
            
            res.status(200).json({
                massage: 'תודה שקנית! נתראה בקנייה הבאה'
            })

		}).catch( err => {
            res.status(500).json({
                error: err
            });
        });
	});
});

const CheckOutController = { sendOrder };
module.exports = CheckOutController;