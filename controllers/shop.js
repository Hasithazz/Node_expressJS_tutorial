const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "Products",
                path: "/products"
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
            res.render("shop/product-detail", {
                product: product,
                pageTitle: product.title,
                path: "/products-details"
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("shop/index", {
                prods: products,
                pageTitle: "Shop",
                path: "/"
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {

    req.user.populate('cart.items.productId').then((user) => {
        res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            cartProducts: user.cart.items
        });
    });
    // req.user
    //   .getCart()
    //   .then((cart) => {
    //     return cart.getProducts();
    //   })
    //   .then((cartProducts) => {
    //     res.render("shop/cart", {
    //       path: "/cart",
    //       pageTitle: "Your Cart",
    //       cartProducts: cartProducts,
    //     });
    //   })
    //   .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then((product) => {
            return req.user.addToCart(product);
        })
        .then((product) => {
            res.redirect("/cart");
        })
        .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user.removeFromCart(productId).then((result) => {
        res.redirect("/cart");
    })
        .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout"
    });
};

exports.getOrders = (req, res, next) => {

    Order.find({'userId': req.user._id}).then(orders => {
        console.log(orders);
        res.render("shop/orders", {
            path: "/orders",
            pageTitle: "Order",
            orders: orders
        });
    }).catch((error) => {
        console.log(error);
    });

    // //below is known as eager loading in sequelize
    // //this works because you have associate orders and products
    // //the include need to be mentioned as plural of defined model in this case product+s
    // //this will simply say sequalize 'When you fetching orders also fetch products allocated to those orders and give it back as an array
    // req.user
    //     .getOrders({include: ["products"]})
    //     .then((orders) => {
    //         res.render("shop/orders", {
    //             path: "/orders",
    //             pageTitle: "Order",
    //             orders: orders
    //         });
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
};

exports.postOrder = (req, res, next) => {
    const orderItems = [];
    let orderItem = {};
    let totalPrice = 0;
    req.user.populate("cart.items.productId").then((user) => {
        for (let cartItem of user.cart.items) {
            orderItem = {
                product: cartItem.productId._doc,
                quantity: cartItem.quantity
            };
            totalPrice += cartItem.productId.price * cartItem.quantity;
            orderItems.push(orderItem);
        }

        const order = new Order({
                                    orderItems: orderItems,
                                    orderTime: Date.now(),
                                    totalPrice: totalPrice,
                                    userId: req.user._id
                                });
        order.save().then((result) => {

            req.user.clearCart().then((result) => {
                res.redirect("/orders");
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    });

};
