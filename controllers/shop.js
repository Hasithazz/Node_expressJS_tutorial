const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Products',
                path: '/products'
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then((product) => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products-details'
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then((cart) => {
            return cart.getProducts();
        })
        .then((cartProducts) => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                cartProducts: cartProducts
            });
        })
        .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user
        .getCart()
        .then((cart) => {
            fetchedCart = cart;
            return cart.getProducts({where: {id: prodId}});
        })
        .then((products) => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(prodId);
        })
        .then((product) => {
            fetchedCart.addProduct(product, {
                through: {quantity: newQuantity} //Telling sequalize to add quantity to the intermediate table
            });
            res.redirect('/cart');
        })
        .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user
        .getCart()
        .then((cart) => {
            return cart.getProducts({where: {id: productId}});
        })
        .then((products) => {
            const product = products[0];
            if (product.cartItem.quantity > 1) {
                return product.cartItem.update({
                                                   quantity: product.cartItem.quantity - 1
                                               });
            }
            return product.cartItem.destroy();
        })
        .then((result) => {
            res.redirect('/cart');
        })
        .catch((err) => console.log(err));

};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};

exports.getOrders = (req, res, next) => {
    //below is known as eager loading in sequelize
    //this works because you have associate orders and products
    //the include need to be mentioned as plural of defined model in this case product+s
    //this will simply say sequalize 'When you fetching orders also fetch products allocated to those orders and give it back as an array
    req.user.getOrders({include: ['products']}).then((orders) => {
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Order',
            orders: orders
        });
    }).catch(error => {
        console.log(error);
    });

};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart().then((cart) => {
        fetchedCart = cart;
        return cart.getProducts();
    }).then(products => {
        return req.user.createOrder().then(order => {
            //this will add the products to the order with the quantity
            return order.addProducts(products.map(product => {
                product.orderItem = {quantity: product.cartItem.quantity};
                return product;
            }));
        }).catch(error => {
            console.log(error);
        });
    }).then(result => {
        return fetchedCart.setProducts(null);
    }).then(result => {
        res.redirect('/orders');
    })
        .catch(error => {
            console.log(error);
        });
};
