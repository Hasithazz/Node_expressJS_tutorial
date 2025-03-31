const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
                                   orderItems: [{
                                       product: {
                                           type: {
                                               prodId: {
                                                   type: mongoose.Types.ObjectId,
                                                   ref: 'Product'
                                               },
                                               title: String,
                                               price: Number
                                           },
                                           required: true
                                       },
                                       quantity: {
                                           type: Number,
                                           required: true
                                       }
                                   }],
                                   orderTime: {
                                       type: Date,
                                       required: true

                                   },
                                   totalPrice: {
                                       type: Number,
                                       required: true
                                   },
                                   userId: {
                                       type: mongoose.Types.ObjectId,
                                       ref: "User",
                                       required: true
                                   }

                               });

module.exports = mongoose.model("Order", orderSchema);