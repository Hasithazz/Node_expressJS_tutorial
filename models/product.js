const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, description, price, imageUrl) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
    }

    static findAll() {
        const db = getDb();
        return db.collection('products').find().toArray().then(products => {
            return products;
        }).catch(err => {
            console.log(err);
        });
    }

    save() {
        const db = getDb();
        return db.collection('products').insertOne(this).then(result => {
            console.log(result);
        }).catch(error => {
            console.log(error);
        });
    }
}

module.exports = Product;
