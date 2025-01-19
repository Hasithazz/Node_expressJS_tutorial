const Product = require('../models/product');

exports.getProducts = (req, res, next) => {

    Product.findAll().then((products) => {
        console.log(products[0]._id);
        res.render('admin/products', {
            pageTitle: 'Admin Products',
            path: '/admin/products',
            prods: products
        });
    }).catch(error => {
        console.log(error);
        res.redirect('/');
    });

};

exports.getAddProducts = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;

    const product = new Product(title, description, price, imageUrl);
    product.save().then(result => {
        res.redirect('/admin/products');

    });

};

exports.getEditProducts = (req, res, next) => {
    const editMode = req.query.edit;
    const productId = req.params.productId;
    if (!editMode) {
        res.redirect('/');
    }
    //Using magic method 'getProducts' to get the product by filtering the id of the product
    Product.findById(productId)
        .then((product) => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Add Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postEditProducts = (req, res, next) => {
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const id = req.body.productId;

    const product = new Product(updatedTitle, updatedDescription, updatedPrice, updatedImageUrl, id);
    product.save().then(result => {
        res.redirect('/admin/products');

    }).catch(error => {
        res.redirect('/');
    });

};

exports.postDeleteProducts = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByPk(productId)
        .then((product) => {
            return product.destroy();
        })
        .then((result) => {
            console.log('Product deleted successfully');
            res.redirect('/admin/products');
        })
        .catch((err) => {
            console.log(err);
        });
};
