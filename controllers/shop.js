const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getproducts = (req, res, next) => {
    Product.fetchALL((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Products',
            path: '/products',
        });
    });
};

exports.getproduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: 'Product Details',
            path: '/products-details',
        })
    })

};

exports.getIndex = (req, res, next) => {
    Product.fetchALL((products) => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        });
    });
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        let cartProducts = [];
        Product.fetchALL(products => {
            for (product of products) {
                if(cart.products.find(prod => prod.id === product.id)) {
                    cartProducts.push(product);
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                cartProducts: cartProducts,
            });
        })
    })

};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    })
    res.redirect('/cart');
}

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