const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
	name: String,
	image: String,
	quantity: String,
	price: String,
	cart: {type: Schema.Types.ObjectId, ref: 'carts'}
});

const CartItem = mongoose.model('cart_items', CartItemSchema); 
module.exports = CartItem;