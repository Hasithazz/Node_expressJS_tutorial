const fs = require("fs");
const path = require("path");
const utility = require("../util/path");
const p = path.join(utility, "data", "products.json");
const Cart = require("./cart");

const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            return cb([]);
        }
        return cb(JSON.parse(fileContent));
    });
};

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    static fetchALL(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile((products) => {
            const product = products.find(p => p.id === id);
            cb(product)
        });

    }

    static deleteById(id) {
        getProductsFromFile((products) => {
            const deletedProduct = products.find(p => p.id === id);
            const updateProduct = products.filter(products => products.id !== id);
             Cart.deleteProduct(deletedProduct.id, deletedProduct.price);
            fs.writeFile(p, JSON.stringify(updateProduct), (err) => {
                console.log(err);
            });
        })
    }

    save() {
        getProductsFromFile((products) => {
            if (this.id) {
                const findProductIndex = products.findIndex((product) => product.id === this.id);
                const updateProduct = [...products];
                updateProduct[findProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updateProduct), (err) => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
    }
};
