const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'users'},
	cart: { type: Schema.Types.ObjectId, ref: 'carts' },
	price: Number,
	city: String,
	street: String,
	dateOfDelivery: { type: Date, timeStamp: true },
	dateOfOrder: { type: Date, default: new Date() },
	creditCard: Number
});

const Order = mongoose.model('orders', OrderSchema); 
module.exports = Order;