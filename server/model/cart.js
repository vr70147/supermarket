const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('../model/product');

const CartSchema = new Schema({
	user: { type: String, unique: true, require: true },
	date: { type: Date, default: Date.now },
	items: [{
		name: { type:String, unique: true, require: true },
		image: { type:String, unique: true, require: true },
		price: { type: Number, require: true, require: true },
		qty: { type: Number, require: true, require: true }
	}]
});

const Cart = module.exports = mongoose.model('carts', CartSchema); 
module.exports.addItemtoCart = async (req, res, id, qty) => {
	try {
		//check if the product is exist
		const validProduct = await Product.findOne({ _id: id }).exec();
		const newItem = {
			name: validProduct.name,
			image: validProduct.image,
			price: validProduct.price,
			qty: qty
		}
		if( !validProduct ) {
			return false;
		}
		const cartItems = await Cart.findOne({ user: req.decoded.userId }, { items: 1, _id: 0 });

		const filteredCartItems = cartItems.items.filter( item => {
			return item.name === validProduct.name
		})
		if( filteredCartItems.length > 0 ) {
			const updateQty = await Cart.updateOne({ user: req.decoded.userId },
				{ $inc: { 'items.$[t].qty': qty } },
				{ arrayFilters: [ { 't.name': filteredCartItems[0].name } ]})
				if(updateQty.nModified === 1) return true;
				return false;
		}
		const addItemToCart = await Cart.updateOne( { user: req.decoded.userId }, { $push: { items: newItem } })
		if( addItemToCart.nModified === 1) return true
		return false;
		
	} catch (error) {
		return false;
	}
}
module.exports.deleteItemFromCart = async req => {
	try {
		const deleteItem = await Cart.updateOne({ user: req.decoded.userId },
			{ "$pull": { "items": { "_id": req.params.id } }},
			{ safe: true, multi:true });
		if( deleteItem.nModified === 1) return true
		return false;
	}
	catch(error) {
		return false;
	}
}
module.exports.createCart = async ( req, newCart ) => {
	try {
		const createNewCart = await Cart.find({ user: req.decoded.userId });
		
        if( createNewCart.length > 0 ) {
            return false;
        }
		const newCartCreated = await newCart.save();
		if ( newCartCreated ) {
			const cartValues = [{
				id: newCartCreated._id,
                items: newCartCreated.items,
                user: newCartCreated.user,
				date: newCartCreated.date.toString().split(" "),
			}]
			return cartValues;
		}
		return false;
	}
	catch (error) {
		console.log('error');
		return false;
	}
	
}