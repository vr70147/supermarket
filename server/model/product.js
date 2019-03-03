const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	name: { type: String, required: true, unique: true },
	image: { type: String, required: true },
	price: { type: Number, required: true },
	type: { type: String, required: true },
	category: { type: Schema.Types.ObjectId, ref: 'categories'}
});

const Product = module.exports = mongoose.model('products', ProductSchema);
module.exports.createProduct = async (newProduct) => {
	try {
		const product = await newProduct.save();
		if (product) return true
		return false;
	} catch (error) {
		return false;
	}
};
module.exports.deleteProduct = async id  => {
	try {
		const deleteP = await Product.findByIdAndDelete({ _id: id });
		if (deleteP) return true
		return false;
	} catch (error) {
		return false;
	}
}

