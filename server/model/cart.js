const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
	user: { type: String, unique: true },
	date: { type: Date, default: Date.now },
	items: [{
		name: String,
		image: String,
		price: Number,
		qty: Number
	}]
});

const Cart = mongoose.model('carts', CartSchema); 
module.exports = Cart;