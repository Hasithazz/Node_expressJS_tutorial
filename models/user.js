const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class User {

    constructor(username, email, id) {
        this.username = username;
        this.email = email;
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    static findById(id) {
        const db = getDb();
        return db.collection('users').findOne({_id: new mongodb.ObjectId(id)});
    }

    save() {
        const db = getDb();
        let dbOp;

        if (this._id) {
            dbOp = db.collection('users').updateOne({_id: this._id}, {$set: this});
        } else {
            dbOp = db.collection('users').insertOne(this);

        }
        return dbOp;

    }
}

module.exports = User;