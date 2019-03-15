const mongoose = require('mongoose');
const pdf = require('pdfkit');
const fs = require('fs');
const Cart = require('../model/cart');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
	cart: String,
	total: Number,
	city: String,
	street: String,
	dateOfDelivery: { type: Date, timeStamp: true },
	dateOfOrder: { type: Date, default: new Date() },
	creditCard: Number
});

const Order = module.exports = mongoose.model('orders', OrderSchema);
module.exports.createOrder = async ( req, newOrder ) => {
	try {
		const order = await newOrder.save();
		if (order) {
			const cart = await Cart.find({ user: req.decoded.userId });
				if ( cart.length > 0 ) {
					const receipt = new pdf;
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
					receipt.end()
					const deletedCart = await Cart.findOneAndDelete({ user: req.decoded.userId });
					if( deletedCart._id ) {
						return true;
					}
				}
				return false;
			}
		
	} catch (error) {
		return false;
	}
}