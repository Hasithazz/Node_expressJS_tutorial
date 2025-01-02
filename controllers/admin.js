const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.findAll().then((products) => {
        res.render('admin/products', {
            pageTitle: 'Admin Products',
            path: '/admin/products',
            prods: products,
        });
    }).catch(err => {
        console.log(err)
    })
};

exports.getAddProducts = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
    });
};

exports.postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;

    Product.create({title: title, price: price, imageUrl: imageUrl, description: description}).then((result) => {
        console.log(result)
    }).catch(err => {
        console.log(err)
    });
};

exports.getEditProducts = (req, res, next) => {
    const editMode = req.query.edit;
    const productId = req.params.productId;
    if (!editMode) {
        res.redirect('/');
    }
    Product.findById(productId, (product) => {
        console.log(product);
        res.render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product,
        });
    });
};

exports.postEditProducts = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const id = req.body.productId;
    console.log(id, ' this is id');
    const product = new Product(id, title, imageUrl, description, price);
    product.save();
    res.redirect('/admin/products');
};

exports.postDeleteProducts = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteById(productId);
    res.redirect('/admin/products');
};
