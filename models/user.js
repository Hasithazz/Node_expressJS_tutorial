const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  console.log(product);
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
    console.log("this", this);
  }
  this.cart = { items: updatedCartItems };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const getDb = require('../util/database').getDb;
// const mongodb = require('mongodb');

// class User {

//     constructor(username, email, id) {
//         this.username = username;
//         this.email = email;
//         this._id = id ? new mongodb.ObjectId(id) : null;
//     }

//     static findById(id) {
//         const db = getDb();
//         return db.collection('users').findOne({_id: new mongodb.ObjectId(id)});
//     }

//     save() {
//         const db = getDb();
//         let dbOp;

//         if (this._id) {
//             dbOp = db.collection('users').updateOne({_id: this._id}, {$set: this});
//         } else {
//             dbOp = db.collection('users').insertOne(this);

//         }
//         return dbOp;

//     }
// }

// module.exports = User;
