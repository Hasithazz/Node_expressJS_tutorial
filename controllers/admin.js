const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    //Using magic method 'getProducts' to get all products
    req.user
        .getProducts()
        .then((products) => {
            res.render('admin/products', {
                pageTitle: 'Admin Products',
                path: '/admin/products',
                prods: products,
            });
        })
        .catch((err) => {
            console.log(err);
        });
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
    //When you create association between two tables sequalize will automatically add a method to the object which is created by the assosiation.
    //These methods known as 'magic methods' in sequalize. In this case 'createProduct' is a magic method which is added to 'User' object by sequalize
    req.user
        .createProduct({
            title: title,
            price: price,
            imageUrl: imageUrl,
            description: description,
        })
        .then((result) => {
            console.log(result);
            res.redirect('/admin/products');
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getEditProducts = (req, res, next) => {
    const editMode = req.query.edit;
    const productId = req.params.productId;
    if (!editMode) {
        res.redirect('/');
    }
    //Using magic method 'getProducts' to get the product by filtering the id of the product
    req.user
        .getProducts({where: {id: productId}})
        .then((product) => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Add Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product[0],
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

    Product.findByPk(id)
        .then((product) => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            return product.save();
        })
        .then((result) => {
            console.log('Updated product');
            res.redirect('/admin/products');
        })
        .catch((err) => {
            console.log(err);
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
