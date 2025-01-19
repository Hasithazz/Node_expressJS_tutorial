const mongodb = require('mongodb');
const _this = require("./product");
const getDb = require('../util/database').getDb;

class Product {

    constructor(title, description, price, imageUrl, id) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this._id = new mongodb.ObjectId(id);
    }

    static findAll() {
        const db = getDb();
        return db.collection('products').find().toArray().then(products => {
            return products;
        }).catch(err => {
            console.log(err);
        });
    }

    static findById(id) {
        const db = getDb();
        return db.collection('products').find({_id: new mongodb.ObjectId(id)}).next().then(product => {
            return product;
        }).catch(error => {
            console.log(error);
        });
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            dbOp = db.collection('products').updateOne({_id: this._id}, {$set: this});
        } else {
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp.then(result => {
            console.log(result);
        }).catch(error => {
            console.log(error);
        });

    }
}

module.exports = Product;
