const Product = require('../model/product');
const Upload = require('../cloud/cloud');
const fs = require('fs');

const getProducts = ( async (req, res, next) => {
    try {
        const gotAllProducts = await Product.find({}).populate('category', 'name');
        if ( gotAllProducts ) {
            return res.status(200).json({
                products: gotAllProducts
            });
        }
    }
    catch (error) {
        return res.status(500).send( error );
    }
});

const addProduct = ( async ( req, res, next ) => {
    const upload = await Upload.uploadImage(req.file.filename);
    const newProduct = new Product({
        name: req.body.name,
        image: upload.secure_url,
        price: req.body.price,
        unit: req.body.unit,
        category: req.body.category
    });

    const productCreated = await Product.createProduct( newProduct );
    fs.unlinkSync(`./images/${req.file.filename}`);
    if( productCreated ){
        return res.status(200).json({ message: 'המוצר נוצר בהצלחה' })
    }
    return res.status(500).json({ message: new Error });
});

const deleteProduct = ( async ( req, res, next ) => {
    const id = req.params.id;
    const deletedProduct = await Product.deleteProduct(id);
    if ( deletedProduct ) {
        return res.status(200).json({
            message: 'המוצר הוסר בהצלחה'
        })
    }
    return res.status(500).json({
        message: 'המוצר לא קיים במערכת'
    });
});

const updateProduct = async( req, res, next ) => {
    let update;
    const id = req.params.id;
    if( req.file === undefined ) {
        update = {
            name: req.body.name,
            image: req.body.image,
            price: req.body.price,
            unit: req.body.unit,
            category: req.body.category
        }
    }
    else {
        const upload = await Upload.uploadImage(req.file.filename);
        update = {
            name: req.body.name,
            image: upload.secure_url,
            price: req.body.price,
            unit: req.body.unit,
            category: req.body.category
        }
    }
    console.log(update);
    Product.update({_id : id }, update, { new: true })
    .then(() => {
        return res.status(200).json({
            message: 'המוצר עודכן בהצלחה'
        })
    })
    .catch((error) => {
        res.send(error);
    })
};

const ProductsController = {
    getProducts,
    addProduct,
    deleteProduct,
    updateProduct
};
module.exports = ProductsController;