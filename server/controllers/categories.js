const Category = require('../model/category');

const getCategories = (( req, res, next ) => {
    Category.find({}).then( categories => {
        res.status(200).send(categories);
    })
	.catch( error => {
        res.status(500).send(error);
    })
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