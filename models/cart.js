const fs = require('fs');
const path = require('path');
const utility = require("../util/path");
const p = path.join(utility, "data", "cart.json");

module.exports = class Cart {

    static addProduct(id, productPrice) {
        fs.readFile(p, (err, data) => {
            let cart = {products: [], totalPrice: 0};
            if (!err) {
                cart = JSON.parse(data);
            }

            const existingProductIndex = cart.products.findIndex((product) => product.id === id);
            const existingProduct = cart.products[existingProductIndex];

            let updatedProduct;
            if (existingProduct) {
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct]
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err)
            })
        })
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, data) => {
            if (err) {
                return;
            }
            const cart = JSON.parse(data);

            const updatedCart = {...cart};
            const deletedProduct = updatedCart.products.filter((product) => product.id === id);
            const deletedProductQty = deletedProduct.qty;
            updatedCart.products = updatedCart.products.filter((product) => product.id !== id);
            updatedCart.totalPrice = cart.totalPrice - +productPrice * deletedProductQty;

            fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                console.log(err);
            })
        });
    }

    static getCart(cb) {
        fs.readFile(p, (err, data) => {
            const cart = JSON.parse(data);
            if (err) {
                cb(null);
            }
            cb(cart);
        });
    }

}