const Category = require('../model/category');

const getCategories = ( async( req, res, next ) => {
    try {
        const getAllCategories = await Category.find({});
        if ( getAllCategories ) {
            return res.status(200).json({
                categories: getAllCategories
            });
        }
    }
    catch (error) {
        return res.status(500).send( error );
    }
});

const addCategory = ( async ( req, res, next ) => {
    const newCategory = new Category( req.body );
    let categoryCreated = await Category.createCategory( newCategory );
    if( categoryCreated ) {
        return res.status(200).json({
            category: newCategory.name,
            message: 'הקטגוריה נוצרה בהצלחה'
        });
    };
    return res.status(500).json({
        message: 'הקטגוריה קיימת במערכת'
    });
});

const CategoriesController = {
    getCategories,
    addCategory
};

module.exports = CategoriesController;