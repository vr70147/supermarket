const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  	name: { type: String, unique: true }
});

const Category = module.exports = mongoose.model('categories', CategorySchema);

module.exports.createCategory = async (newCategory) => {
	try {
		const category = await newCategory.save();
		if (category) return true
		return false;
	} catch (error) {
		return false;
	}
}
