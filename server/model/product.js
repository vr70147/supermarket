const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	name: String,
	image: String,
	price: Number,
	category: { type: Schema.Types.ObjectId, ref: 'categories'}
});

const Product = mongoose.model('products', ProductSchema); 
module.exports = Product;