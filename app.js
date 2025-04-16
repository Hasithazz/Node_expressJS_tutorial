const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const mongodbUri = "mongodb+srv://read_write_user:iUadHdjj9dOwpQBt@cluster0.w7yvn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const mongoose = require("mongoose");
const User = require("./models/user");
//Importing Session module
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();
const store = new MongoDBStore({
                                   uri: mongodbUri,
                                   collection: 'sessions'
                               });

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

//using the imported session as middleware
//secret:value => this should be a long String in real scenarios which is used to encrypt the data (the hash value)
//resave:false => session will not be saved on every request that is done. Only if something changed
//saveUninitialized:false => will not save uninitialized sessions
app.use(session({
                    secret: 'my secret',
                    resave: false,
                    saveUninitialized: false,
                    store: store
                }));

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
    .connect(mongodbUri)
    .then((result) => {
        User.findOne().then((user) => {
            if (!user) {
                user = new User({
                                    name: "Hasitha",
                                    email: "hse@y.com",
                                    cart: {
                                        items: []
                                    }
                                });
                user.save();
            }
        });
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });
