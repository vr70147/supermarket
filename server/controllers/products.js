const Product = require('../model/product');

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
    const url = req.protocol + '://' + req.get('host');
    const newProduct = new Product({
        name: req.body.name,
        image: url + '/images/' + req.file.filename,
        price: req.body.price
    });
    const productCreated = await Product.createProduct( newProduct );
    if( productCreated ) return res.status(200).json({ message: 'המוצר נוצר בהצלחה' })
    return res.status(500).json({ message: 'המוצר כבר קיים במערכת' });
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

const updateProduct = (( req, res, next ) => {
    const id = req.params.id;
    const update = {
        name: req.body.name,
        image: req.body.image,
        price: req.body.price
    }
    Product.findByIdAndUpdate(id, update, { new: true })
    .then(() => {
        res.send('המוצר עודכן בהצלחה')
    })
    .catch((error) => {
        res.send(error);
    })
});

const ProductsController = {
    getProducts,
    addProduct,
    deleteProduct,
    updateProduct
};
module.exports = ProductsController;