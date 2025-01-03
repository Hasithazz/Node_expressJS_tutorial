const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getproducts = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Products',
            path: '/products',
        });
    }).catch(err => {
        console.log(err)
    });
};

exports.getproduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(([row]) => {
            console.log(row);

            res.render('shop/product-detail', {
                product: row[0],
                pageTitle: 'Product Details',
                path: '/products-details',
            });
        })
        .catch((err) => console.error(err));
};

exports.getIndex = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        });
    }).catch(err => {
        console.log(err)
    })
};

exports.getCart = (req, res, next) => {
    Cart.getCart((cart) => {
        let cartProducts = [];
        Product.fetchALL((products) => {
            for (product of products) {
                const cartProductData = cart.products.find(
                    (prod) => prod.id === product.id
                );
                if (cartProductData) {
                    cartProducts.push({product: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                cartProducts: cartProducts,
            });
        });
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, (product) => {
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Order',
    });
};
