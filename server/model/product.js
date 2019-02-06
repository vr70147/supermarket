const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	name: { type: String, required: true },
	image: { type: String, required: true },
	price: { type: Number, required: true },
	category: { type: Schema.Types.ObjectId, ref: 'categories'}
});

const Product = mongoose.model('products', ProductSchema); 
module.exports = Product;